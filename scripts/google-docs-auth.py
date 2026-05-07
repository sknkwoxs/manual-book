#!/usr/bin/env python3
"""Google Docs/Drive OAuth flow → token.json 발급 + 연결 테스트."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

CLIENT_SECRET = Path(
    "/Users/hyunseung-in/.config/gcloud/"
    "client_secret_693330560552-lvccphfeq29u4v0o1agsf0cemgnbdn4l."
    "apps.googleusercontent.com.json"
)
TOKEN_PATH = Path("/Users/hyunseung-in/.config/gcloud/docs_token.json")
SCOPES = [
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/drive",
]


def get_credentials() -> Credentials:
    creds: Credentials | None = None
    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                str(CLIENT_SECRET), SCOPES
            )
            creds = flow.run_local_server(port=0, open_browser=True)
        TOKEN_PATH.write_text(creds.to_json())
        TOKEN_PATH.chmod(0o600)
    return creds


def main() -> int:
    if not CLIENT_SECRET.exists():
        print(f"ERROR: client_secret 없음: {CLIENT_SECRET}", file=sys.stderr)
        return 1

    print(f"Client secret: {CLIENT_SECRET.name}")
    print(f"Token path:    {TOKEN_PATH}")
    print(f"Scopes:        {SCOPES}")
    print()

    creds = get_credentials()
    print(f"Token 발급 완료: valid={creds.valid}, scopes={creds.scopes}")
    print()

    drive = build("drive", "v3", credentials=creds)
    about = drive.about().get(fields="user(emailAddress,displayName)").execute()
    user = about.get("user", {})
    print(f"인증 사용자: {user.get('displayName')} <{user.get('emailAddress')}>")

    results = (
        drive.files()
        .list(
            pageSize=5,
            fields="files(id, name, mimeType, modifiedTime)",
            orderBy="modifiedTime desc",
        )
        .execute()
    )
    files = results.get("files", [])
    print(f"\n최근 Drive 파일 {len(files)}건:")
    for f in files:
        print(f"  - {f['name']}  [{f['mimeType']}]  {f.get('modifiedTime', '')}")

    docs = build("docs", "v1", credentials=creds)
    print(f"\nDocs API 연결: OK (서비스 객체 생성 성공)")

    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except HttpError as e:
        print(f"API 오류: {e}", file=sys.stderr)
        sys.exit(1)
