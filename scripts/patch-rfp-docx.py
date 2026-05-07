#!/usr/bin/env python3
"""(최종본)SKNK_제안요청서(안)_..._260507.docx 패치 스크립트.

목적:
  4.66MB 원본 docx의 외관(표지/헤더/푸터/표 스타일/이미지)을 100% 보존하면서
  마크다운 정렬(외부 시스템 9종, 표준 엑셀 양식 자동화)을 docx에 반영함.

전략:
  - <w:t> 분리 이슈 회피를 위해 paragraph 단위로 텍스트를 합쳐 매칭
  - 매칭 시 paragraph 내 첫 번째 <w:t>만 새 텍스트로 치환, 나머지는 비움
  - §4.2 외부 연동 시스템 6개 → 9종 항목 교체
  - §4.2.1 다이어그램 자리에 위치 표시 텍스트 삽입
  - §1.2/§1.3/§3.x 표 셀 내 옛 표현(REST API/Webhook/API 연동 등) 정렬

사용:
  python3 scripts/patch-rfp-docx.py
"""
from __future__ import annotations
import re
import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "dist-hwpx" / "(최종본)SKNK_제안요청서(안)_좋은생각 CS 시스템 웹 전환 및 데이터 통합 구축 사업_260507.docx"
DST = ROOT / "dist-hwpx" / "(최종본)SKNK_제안요청서(안)_좋은생각 CS 시스템 웹 전환 및 데이터 통합 구축 사업_260507_v2.docx"

# Paragraph 단위 정확 일치 치환 (구 텍스트 → 신 텍스트)
# key는 paragraph의 모든 <w:t>를 이은 전체 텍스트와 정확히 일치해야 함
PARAGRAPH_REPLACEMENTS: dict[str, str] = {
    # §1.2 나.(4) 범용 API 연동 부재
    "(4) 웹(자사몰·CMS·관리시스템) ↔ 현행 CS DB 간 범용 API 연동 부재":
        "(4) 웹(자사몰·CMS·관리시스템) ↔ 현행 CS DB 간 표준 데이터 연동 부재(엑셀 수작업 의존)",

    # §1.3 나. 데이터 통합 (API/Webhook 실시간 동기화)
    "나. 데이터 통합 : 자사몰·외부몰·CMS·CS 시스템 간 고객·주문·구독 데이터를 통합하고, API/Webhook 기반의 실시간 동기화 체계를 구축함.":
        "나. 데이터 통합 : 자사몰·외부몰·CMS·CS 시스템 간 고객·주문·구독 데이터를 통합하고, 표준 엑셀 양식(업로드/다운로드) 기반 일배치 자동화 체계를 구축함.",

    # §4.2.1 다이어그램 자리 (heading 다음 빈 paragraph는 다른 곳에 사용되므로 건드리지 않음 — 별도 삽입)

    # §4.2 백엔드 계층 - API Gateway
    "API Gateway: RESTful API 또는 GraphQL 엔드포인트 제공":
        "API Gateway: 내부 전용 RESTful API 또는 GraphQL 엔드포인트 제공 (외부 시스템에는 노출하지 않음)",

    # §4.2 데이터 계층 - 파일 스토리지
    "파일 스토리지: S3 또는 NAS 기반 파일 저장소":
        "파일 스토리지: S3 또는 NAS 기반 파일 저장소(엑셀 양식, 송장 PDF, 첨부파일)",

    # §4.2 외부 연동 시스템 헤더
    "외부 연동 시스템 (6개)":
        "외부 연동 시스템 (9종)",

    # §4.2 외부 연동 시스템 6개 항목 → 9종 (위치는 numId=44 6개 paragraph)
    "나이스페이 (PG): 신용카드, 계좌이체 등 결제 처리":
        "자사 홈페이지: 자사 쇼핑몰 주문·회원 데이터 (표준 엑셀 양식 일배치)",
    "Playauto (외부몰): 외부 쇼핑몰 주문 연동":
        "CMS (콘텐츠 관리): 결제 후 디지털 콘텐츠 권한 부여, 1영업일 이내 (표준 엑셀 양식 일배치)",
    "CMS (콘텐츠 관리): 상품 정보, 이미지, 설명 관리":
        "Playauto (외부몰): 네이버 스마트스토어·쿠팡 등 외부몰 주문 통합 수집 (표준 엑셀 양식 일배치)",
    "위하고 (ERP): 재고, 출고, 회계 연동":
        "위하고 (ERP): 재고·출고·매출·회계 동기화 (표준 엑셀 양식 일배치)",
    "CTI (전화 상담): 고객 상담 전화 시스템 연동":
        "나이스페이 (PG): 신용카드·계좌이체 결제, 환불 (PG 결제창 표준 호출 + 거래·정산 엑셀 다운로드)",
    "택배사: 배송 조회 및 송장 출력 연동":
        "CTI (전화 상담): 인입 콜 팝업, 통화 이력 (통신사 표준 인터페이스)",

    # §3.x 외부 시스템 연동 표 셀 (REST API → 표준 엑셀)
    # 표 셀은 단독 paragraph일 가능성이 높음

    # §SRE 결제 URL/팩스 등 API 연동 표현
    "(1) 목표상담 중 고객에게 결제 링크를 즉시 발송하고 당일 결제에 대해 상담원이 시스템 내에서 즉시 취소할 수 있게 지원.(2) 세부 내용- 결제 URL  생성·전송 API 연동- 전송 로그 및 만료시간 관리- 당일 결제 건에 대한 즉시 취소(나이스페이 API)- 보안: 링크 단발성·인증 토큰 적용- 전송 실패·재전송 정책 및 감사 로그":
        "(1) 목표상담 중 고객에게 결제 링크를 즉시 발송하고 당일 결제에 대해 상담원이 시스템 내에서 즉시 취소할 수 있게 지원.(2) 세부 내용- 결제 URL 생성·전송(PG 표준 인터페이스 활용)- 전송 로그 및 만료시간 관리- 당일 결제 건에 대한 즉시 취소(PG 결제창 표준 취소)- 보안: 링크 단발성·인증 토큰 적용- 전송 실패·재전송 정책 및 감사 로그",

    "(1) 목표영수증·증빙을 시스템에서 즉시 팩스 전송하여 별도 팩스기 운영 부담을 제거.(2) 세부 내용- 웹팩스 API 연동(파일 업로드·수신번호 지정)- 발송 결과·전송 로그 저장- 대체 전송(이메일/PDF) 옵션 제공- 전송 실패 시 재시도 정책- 발송 비용·발송 이력 리포트":
        "(1) 목표영수증·증빙을 시스템에서 즉시 팩스 전송하여 별도 팩스기 운영 부담을 제거.(2) 세부 내용- 웹팩스(통신사 표준 인터페이스 활용, 파일 업로드·수신번호 지정)- 발송 결과·전송 로그 저장- 대체 전송(이메일/PDF) 옵션 제공- 전송 실패 시 재시도 정책- 발송 비용·발송 이력 리포트",

    # §SRE 외부몰 주문 (Webhook 기반 수집)
    "주문 관리 도메인은 Playauto 등 외부 채널로부터 주문을 자동 수집하는 어댑터 패턴을 도입하여 수동 엑셀 작업을 제거하고, 접수→결제→준비→배송→완료의 라이프사이클을 실시간으로 추적할 수 있도록 지원합니다. 온·오프라인 통합 환불·취소 워크플로우를 제공하여 회계·재고 연동까지 자동화합니다. ":
        "주문 관리 도메인은 Playauto 등 외부 채널의 주문을 표준 엑셀 양식 자동화 기반으로 일배치 수집하여 수동 엑셀 검증·취합 부담을 제거하고, 접수→결제→준비→배송→완료의 라이프사이클을 추적할 수 있도록 지원합니다. 온·오프라인 통합 환불·취소 워크플로우를 제공하여 회계·재고 연동까지 자동화합니다. ",

    # §SRE PG 결제 (Webhook/API 실시간 수신)
    "결제/정산 도메인은 나이스페이 연동으로 신용카드·가상계좌 결제를 통합 처리하고 결제 완료 즉시 구독권을 자동 부여하며, 무통장 입금 내역을 자동 매칭하여 일일 대조 시간을 단축합니다.":
        "결제/정산 도메인은 나이스페이 PG 결제창 표준 호출로 신용카드·가상계좌 결제를 통합 처리하고 결제 완료 즉시 구독권을 자동 부여하며, PG 정산 엑셀 다운로드 일배치를 통해 무통장 입금 내역을 자동 매칭하여 일일 대조 시간을 단축합니다.",

    # §SRE 입금 매칭 (PG Webhook)
    "(1) 목표무통장·가상계좌 등 다양한 입금 내역을 자동 매칭하여 일일 대조 시간을 축소하고 미매칭 건만 수동 처리하게 함. (2) 세부 내용- PG Webhook(신용카드) 연동 및 가상계좌 파싱 모듈- 미매칭 건 전용 큐 및 관리자 수동 매칭 도구 제공- 매칭 결과 감사 로그 및 교정 리포트":
        "(1) 목표무통장·가상계좌 등 다양한 입금 내역을 자동 매칭하여 일일 대조 시간을 축소하고 미매칭 건만 수동 처리하게 함. (2) 세부 내용- PG 정산 엑셀 다운로드 일배치 + 가상계좌 입금 파일 자동 매칭 모듈- 미매칭 건 전용 큐 및 관리자 수동 매칭 도구 제공- 매칭 결과 감사 로그 및 교정 리포트",

    # §STR-005 외부 연동 통합 전략 (Webhook 등)
    "(1) 목표Playauto, PG(나이스페이), ERP(WEHAGO), 택배사, CMS 등 외부 시스템과 안정적·확장 가능한 연동 보장(2) 세부 내용- 어댑터 패턴 채택으로 신규 채널 추가 시 기존 코드 수정 최소화- 연동별 신뢰성 정책(재시도·큐잉·Circuit Breaker) 명시- 동기/비동기 처리 분리(예: PG 결제는 동기, 외부몰 주문 동기화는 비동기 폴링·Webhook)- Webhook/폴링 주기 명시(예: Playauto 5분 폴링) 및 실패 시 백업 프로세스- 연동 모니터링(성공률·지연시간·실패 알람) 대시보드 제공":
        "(1) 목표Playauto, PG(나이스페이), ERP(WEHAGO), 택배사, CMS 등 외부 시스템과 표준 엑셀 양식 자동화 기반의 안정적·확장 가능한 연동 보장(2) 세부 내용- 채널별 표준 엑셀 양식 정의 및 어댑터 패턴 채택으로 신규 채널 추가 시 기존 코드 수정 최소화- 연동별 신뢰성 정책(재시도·큐잉·Circuit Breaker) 명시- 동기/비동기 처리 분리(예: PG 결제창 호출은 동기, 정산 엑셀 일배치는 비동기)- 일배치 스케줄 명시(예: Playauto 일 1~수회 업로드) 및 실패 시 백업 프로세스- 연동 모니터링(성공률·지연시간·실패 알람) 대시보드 제공",

    "(1) 목표Playauto 등 외부 채널 주문을 데이터 템플릿/어댑터 기반으로 자동 수집하여 수동 엑셀 작업을 제거.(2) 세부 내용- 어댑터 패턴으로 네이버·쿠팡·자사몰 등 채널 통합 수집- 10분 폴링 또는 Webhook 기반 수집 설정- 채널별 포맷 템플릿 관리 및 매핑 UI- 중복 주문 방지 및 정합성 검증 로직- 수집 실패 시 재시도 및 예외 대기열":
        "(1) 목표Playauto 등 외부 채널 주문을 표준 엑셀 양식 자동화 기반으로 수집하여 수동 엑셀 검증·취합 부담을 제거.(2) 세부 내용- 채널별 표준 엑셀 양식 정의(네이버·쿠팡·자사몰 등) 및 업로드 자동 검증·매핑- 일 1~수회 일배치 스케줄링 또는 수동 업로드- 채널별 포맷 템플릿 관리 및 매핑 UI- 중복 주문 방지 및 정합성 검증 로직- 수집 실패 시 재시도 및 예외 대기열",

    "(1) 목표신용카드·가상계좌 결제를 통합 처리하고 결제 완료 즉시 구독권을 자동 부여하여 고객 대기 시간을 단축.(2) 세부 내용- 나이스페이 연동(Webhook/API)으로 결제 상태 실시간 수신- 가상계좌 입금 확인 자동화(입금 통지 파싱)- 결제 완료 시 구독 권한 자동 부여 이벤트- 결제 실패·취소 처리 규칙 및 환불 연계- 다중 계정(다중 나이스페이) 라우팅 고려":
        "(1) 목표신용카드·가상계좌 결제를 통합 처리하고 결제 완료 즉시 구독권을 자동 부여하여 고객 대기 시간을 단축.(2) 세부 내용- 나이스페이 PG 결제창 표준 호출로 결제 상태 수신- 가상계좌 입금 확인은 일배치 정산 엑셀 다운로드 기반 자동 매칭- 결제 완료 시 구독 권한 자동 부여 이벤트- 결제 실패·취소 처리 규칙 및 환불 연계- 다중 계정(다중 나이스페이) 라우팅 고려",

    "실시간 (권한 부여)": "일 1회 배치 (1영업일 이내)",
    "Playauto API 또는 직접 API": "채널별 엑셀 템플릿 업로드 (Playauto 다운로드 양식 포함)",
    "5~10분 폴링": "일 1~수회 배치",
    "일 1회 배치 + 필요 시 실시간": "일 1회 배치",
    "API 또는 SDK": "통화 이력 엑셀 템플릿 업로드",
    "파일 업로드 (현행 유지)": "지로 입금 파일 업로드 (현행 양식 유지)",
    "API 또는 파일 업로드": "송장·배송 결과 엑셀 템플릿 업로드/다운로드",
    "웹 접속 권한 부여": "웹 접속 권한 부여 (계정 발급)",

    "(1) 모든 외부 연동 인터페이스는 API 명세서를 작성하여 산출물로 제출함":
        "(1) 모든 외부 연동 인터페이스는 표준 엑셀 양식 정의서·데이터 매핑 명세서를 작성하여 산출물로 제출함 (불가피하게 API를 사용하는 내부 인터페이스가 있을 경우에는 API 명세서를 함께 제출)",
    "(2) 외부 시스템 장애 시 본 시스템의 핵심 기능이 마비되지 않도록 회복 전략 적용 (재시도, 회로 차단 등)":
        "(2) 엑셀 템플릿 업로드 시 시스템은 컬럼·자료형·필수값을 자동 검증하고, 오류 행을 분리하여 재업로드 가이드를 제공함",
    "(3) 외부 인증 정보(API Key, 토큰)는 별도 보안 저장소(KMS 또는 동등 솔루션)에 보관함":
        "(3) 외부 시스템 장애·양식 변경 시에도 본 시스템의 핵심 기능이 마비되지 않도록 양식 버전 관리 및 회복 전략(재처리 큐, 백업 양식 등)을 적용함",

    "5~10분 이내": "일 1~수회 배치 (수동 업로드 옵션)",
}

# 표 셀 단독 텍스트 치환 (REST API 4행)
# 같은 텍스트가 4번 등장하지만 인접 셀의 컨텍스트가 다르므로 위치 추적 필요 → 단순 일괄 치환
CELL_REPLACEMENTS: dict[str, str] = {
    # 단독 셀 "REST API"는 4건 모두 표준 엑셀로 정렬 (§3.x 외부 시스템 연동 방식)
}

# 셀 텍스트 단순 치환 (paragraph 안의 일부분 매칭)
INLINE_REPLACEMENTS: list[tuple[str, str]] = [
    ("REST API", "표준 엑셀 양식"),
    ("API 연동 대상", "엑셀 양식 자동화 대상"),
]

INDEX_REPLACEMENTS: dict[tuple[str, int], str] = {
    ("실시간", 0): "일 1~수회 배치",
    ("실시간", 1): "일 1회 정산 배치",
    ("실시간", 2): "일 1회 배치",
    ("실시간", 3): "사용자 등록 시",
}


W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"

# Paragraph regex
PARA_RE = re.compile(r"<w:p\b[^>]*>.*?</w:p>", re.DOTALL)
# <w:r>...</w:r> regex
RUN_RE = re.compile(r"<w:r\b[^>]*>.*?</w:r>", re.DOTALL)
# <w:t ...>text</w:t>
WT_RE = re.compile(r"<w:t(?:\s[^>]*)?>([^<]*)</w:t>")


def get_paragraph_text(para_xml: str) -> str:
    """Concatenate all <w:t> texts in a paragraph."""
    return "".join(WT_RE.findall(para_xml))


def replace_paragraph_text(para_xml: str, new_text: str) -> str:
    """Replace ALL <w:t> contents in paragraph: first gets new_text, rest get ''.

    Properly XML-escapes the new text and preserves xml:space="preserve" attribute
    by adding it if not present (since new text may have leading/trailing spaces).
    """
    # XML-escape
    safe = (
        new_text
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )

    first_replaced = False
    def sub_one(m: re.Match) -> str:
        nonlocal first_replaced
        full = m.group(0)
        # Preserve attributes if present, ensure xml:space="preserve"
        attr_match = re.match(r"<w:t(\s[^>]*)?>", full)
        attrs = attr_match.group(1) or ""
        if 'xml:space="preserve"' not in attrs:
            attrs = ' xml:space="preserve"' + attrs
        if not first_replaced:
            first_replaced = True
            return f"<w:t{attrs}>{safe}</w:t>"
        else:
            return f"<w:t{attrs}></w:t>"

    return WT_RE.sub(sub_one, para_xml)


def patch_paragraphs(xml: str) -> tuple[str, dict[str, int]]:
    """Apply PARAGRAPH_REPLACEMENTS by exact concatenated text match."""
    stats = {k: 0 for k in PARAGRAPH_REPLACEMENTS}

    def sub_para(m: re.Match) -> str:
        para = m.group(0)
        text = get_paragraph_text(para)
        if text in PARAGRAPH_REPLACEMENTS:
            new_text = PARAGRAPH_REPLACEMENTS[text]
            stats[text] += 1
            return replace_paragraph_text(para, new_text)
        return para

    out = PARA_RE.sub(sub_para, xml)
    return out, stats


def patch_paragraphs_indexed(xml: str) -> tuple[str, dict[tuple[str, int], int]]:
    stats = {k: 0 for k in INDEX_REPLACEMENTS}
    occurrence: dict[str, int] = {}
    parts: list[str] = []
    last_end = 0
    for m in PARA_RE.finditer(xml):
        parts.append(xml[last_end:m.start()])
        para = m.group(0)
        text = get_paragraph_text(para)
        idx = occurrence.get(text, 0)
        key = (text, idx)
        if key in INDEX_REPLACEMENTS:
            stats[key] += 1
            parts.append(replace_paragraph_text(para, INDEX_REPLACEMENTS[key]))
        else:
            parts.append(para)
        occurrence[text] = idx + 1
        last_end = m.end()
    parts.append(xml[last_end:])
    return "".join(parts), stats


def patch_inline(xml: str) -> tuple[str, dict[str, int]]:
    """Apply inline string replacements paragraph-by-paragraph.

    For each paragraph, concatenate text, check if inline pattern present,
    and if so replace via paragraph rewrite.
    """
    stats = {pat: 0 for pat, _ in INLINE_REPLACEMENTS}

    def sub_para(m: re.Match) -> str:
        para = m.group(0)
        text = get_paragraph_text(para)
        new_text = text
        changed = False
        for pat, repl in INLINE_REPLACEMENTS:
            if pat in new_text:
                new_text = new_text.replace(pat, repl)
                stats[pat] += text.count(pat)
                changed = True
        if changed:
            return replace_paragraph_text(para, new_text)
        return para

    out = PARA_RE.sub(sub_para, xml)
    return out, stats


def insert_diagram_placeholder(xml: str) -> tuple[str, bool]:
    """§4.2.1 전체 시스템 아키텍처 헤딩 다음의 빈 paragraph 2개 중 첫 번째에
    다이어그램 위치 표시 텍스트를 삽입.

    구조:
      [Heading3 4.2.1 전체 시스템 아키텍처]
      [empty paragraph]  ← 여기에 [다이어그램 위치] 텍스트 삽입
      [empty paragraph]
    """
    para_pattern = re.compile(r"<w:p\b[^>]*>(?:(?!</w:p>).)*?</w:p>", re.DOTALL)
    target = "4.2.1 전체 시스템 아키텍처"
    m = None
    for candidate in para_pattern.finditer(xml):
        if get_paragraph_text(candidate.group(0)) == target:
            m = candidate
            break
    if not m:
        return xml, False

    insertion_point = m.end()
    # Find next paragraph after heading
    next_para_match = re.search(r"<w:p\b[^>]*>.*?</w:p>", xml[insertion_point:], re.DOTALL)
    if not next_para_match:
        return xml, False

    abs_start = insertion_point + next_para_match.start()
    abs_end = insertion_point + next_para_match.end()
    next_para = xml[abs_start:abs_end]

    # Verify it's empty (defensive)
    if get_paragraph_text(next_para).strip():
        return xml, False

    # Build new paragraph reusing the empty paragraph structure but with inserted text.
    # Simplest: replace the empty paragraph with one carrying placeholder text via
    # a minimal <w:r><w:t>...</w:t></w:r>.
    placeholder = "[다이어그램 위치 — 표준 엑셀 자동화 기반 시스템 구성도(별도 첨부)]"
    safe = placeholder.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    # Inject a run before </w:p>
    new_para = next_para.replace(
        "</w:p>",
        f'<w:r><w:rPr><w:rFonts w:ascii="Gothic A1" w:cs="Gothic A1" w:eastAsia="Gothic A1" w:hAnsi="Gothic A1"/><w:i w:val="1"/><w:color w:val="666666"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">{safe}</w:t></w:r></w:p>',
        1,
    )

    return xml[:abs_start] + new_para + xml[abs_end:], True


def add_excel_strategy_note(xml: str) -> tuple[str, bool]:
    """§4.2.2 주요 구성 요소 헤딩 직전에 외부 연동 전략 안내 paragraph 추가."""
    # 외부 연동 시스템 헤더 paragraph를 찾고, 그 직후에 전략 paragraph 삽입
    target_text = "외부 연동 시스템 (9종)"
    # Find Heading4 paragraph with this text
    heading4_pattern = re.compile(
        r'(<w:p\b[^>]*>(?:(?!</w:p>).)*?<w:pStyle w:val="Heading4"/>(?:(?!</w:p>).)*?</w:p>)',
        re.DOTALL,
    )
    for m in heading4_pattern.finditer(xml):
        if get_paragraph_text(m.group(0)) == target_text:
            insertion_point = m.end()
            note_text = (
                "외부 시스템은 모두 표준 엑셀 양식(업로드/다운로드) 자동화 또는 "
                "결제창·통신사 표준 인터페이스 호출 방식으로 연동하며, 별도의 "
                "외부 공개 API/Webhook은 운용하지 않음(연동 방식 상세는 §2.4 참조)."
            )
            safe = note_text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            new_para = (
                f'<w:p w:rsidR="00000000" w:rsidRDefault="00000000">'
                f'<w:pPr><w:spacing w:after="120" w:before="60"/>'
                f'<w:rPr><w:rFonts w:ascii="Gothic A1" w:cs="Gothic A1" w:eastAsia="Gothic A1" w:hAnsi="Gothic A1"/><w:sz w:val="22"/></w:rPr></w:pPr>'
                f'<w:r><w:rPr><w:rFonts w:ascii="Gothic A1" w:cs="Gothic A1" w:eastAsia="Gothic A1" w:hAnsi="Gothic A1"/><w:sz w:val="22"/></w:rPr>'
                f'<w:t xml:space="preserve">{safe}</w:t></w:r></w:p>'
            )
            return xml[:insertion_point] + new_para + xml[insertion_point:], True
    return xml, False


def append_extra_external_systems(xml: str) -> tuple[str, int]:
    """§4.2 외부 연동 시스템 6개 항목(numId=44) 마지막 paragraph 뒤에
    7~9번째 시스템(지로·택배사·외부 콜센터) 항목 paragraph 추가.

    원본 6개 paragraph는 patch_paragraphs로 다른 9개 시스템(자사몰/CMS/Playauto/
    위하고/나이스페이/CTI)으로 교체됨. 따라서 7~9번째(지로/택배사/외부콜센터)를
    추가로 삽입해야 함.
    """
    # numId=44 paragraph 6개를 찾고, 마지막 직후에 3개 추가 삽입
    pattern = re.compile(
        r'<w:p\b[^>]*>(?:(?!</w:p>).)*?<w:numId w:val="44"/>(?:(?!</w:p>).)*?</w:p>',
        re.DOTALL,
    )
    matches = list(pattern.finditer(xml))
    if len(matches) < 6:
        return xml, 0

    # Use the 6th paragraph as a template
    template = matches[5].group(0)

    extra_items = [
        "지로: 정기구독 지로 청구·수납 대조 (표준 엑셀 양식 일배치)",
        "택배사: 송장 출력, 배송 조회 (표준 엑셀 양식 일배치)",
        "외부 콜센터: 외주 상담 인입·이관, 상담 이력 통합 (표준 엑셀 양식 일배치)",
    ]
    inserted = []
    for item in extra_items:
        new_para = replace_paragraph_text(template, item)
        inserted.append(new_para)

    insertion_point = matches[5].end()
    return xml[:insertion_point] + "".join(inserted) + xml[insertion_point:], len(inserted)


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"원본 docx 없음: {SRC}")

    print(f"원본: {SRC.name} ({SRC.stat().st_size:,} bytes)")
    shutil.copy2(SRC, DST)
    print(f"복사: {DST.name}")

    # 임시 작업 디렉터리
    tmp = ROOT / ".tmp-docx-patch"
    if tmp.exists():
        shutil.rmtree(tmp)
    tmp.mkdir()

    with zipfile.ZipFile(DST, "r") as zf:
        zf.extractall(tmp)

    doc_xml_path = tmp / "word" / "document.xml"
    xml = doc_xml_path.read_text(encoding="utf-8")
    orig_size = len(xml)

    # 1. Paragraph 단위 정확 매칭 치환
    xml, para_stats = patch_paragraphs(xml)
    print("\n=== Paragraph 치환 결과 ===")
    for k, n in para_stats.items():
        status = "OK" if n > 0 else "MISS"
        print(f"  [{status}] {n}회: {k[:60]}{'...' if len(k) > 60 else ''}")

    xml, idx_stats = patch_paragraphs_indexed(xml)
    print("\n=== Paragraph 인덱스 기반 치환 결과 ===")
    for k, n in idx_stats.items():
        status = "OK" if n > 0 else "MISS"
        print(f"  [{status}] {n}회: {k[0]!r} #{k[1]}")

    # 2. §4.2 외부 연동 7~9번째 항목 추가
    xml, extra_count = append_extra_external_systems(xml)
    print(f"\n=== §4.2 외부 시스템 항목 추가: {extra_count}개 ===")

    # 3. §4.2.1 다이어그램 위치 표시 삽입
    xml, diag_ok = insert_diagram_placeholder(xml)
    print(f"\n=== §4.2.1 다이어그램 위치 표시: {'OK' if diag_ok else 'MISS'} ===")

    # 4. §4.2 외부 연동 전략 안내 paragraph 추가
    xml, note_ok = add_excel_strategy_note(xml)
    print(f"\n=== §4.2 외부 연동 전략 안내 추가: {'OK' if note_ok else 'MISS'} ===")

    # 5. Inline 단편 치환 (REST API, API 연동 대상)
    xml, inline_stats = patch_inline(xml)
    print("\n=== Inline 치환 결과 ===")
    for k, n in inline_stats.items():
        print(f"  {k!r}: {n}회")

    # 저장
    doc_xml_path.write_text(xml, encoding="utf-8")
    print(f"\nXML 크기: {orig_size:,} → {len(xml):,} bytes")

    # zip 재패킹
    DST.unlink()
    with zipfile.ZipFile(DST, "w", zipfile.ZIP_DEFLATED) as zf:
        for path in sorted(tmp.rglob("*")):
            if path.is_file():
                arc = path.relative_to(tmp).as_posix()
                zf.write(path, arc)

    shutil.rmtree(tmp)
    print(f"\n완료: {DST.name} ({DST.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
