---
title: 기술 스택 권장안
description: 백엔드, 프론트엔드, AI/ML 서비스 기술 선택
sidebar:
  order: 2
---

## 백엔드

| 구성요소 | 기술 | 비고 |
|----------|------|------|
| API 서버 | FastAPI (Python) | 비동기 처리, AI 라이브러리 호환 |
| 작업 큐 | Celery + Redis | 영상 처리 등 비동기 작업 |
| DB | PostgreSQL | 해설 데이터, 사용자, 편집 이력 |
| 스토리지 | AWS S3 | 영상/음성 파일 저장 |
| 캐시/세션 | Redis (ElastiCache) | 세션, 실시간 편집 상태 |

## 프론트엔드

| 구성요소 | 기술 | 비고 |
|----------|------|------|
| UI 프레임워크 | React + TypeScript | SPA |
| 영상 플레이어 | Video.js / Plyr | 타임라인 동기화 |
| 실시간 편집 | Yjs (CRDT) + WebSocket | 다중 사용자 동시 편집 |
| 상태 관리 | Zustand / Redux Toolkit | 경량 상태 관리 |

## AI/ML 서비스

### 주력: Gemini 기반

| 기능 | 서비스 | 비고 | 비용 |
|------|--------|------|------|
| **영상 분석** | **Gemini 2.5 Flash** | **비디오 직접 입력** — 장면/인물/객체/동작 인식. 1 FPS 자동 샘플링, 258 tokens/초 | Input $0.30/1M, Output $2.50/1M |
| **오디오 분석 (STT 대체)** | **Gemini 2.5 Flash** | 비디오 업로드 시 오디오 동시 분석 (25 tokens/초). 대사 타이밍 추출 가능 | 별도 비용 없음 (비디오 분석에 포함) |
| **해설 텍스트 생성** | **Gemini 2.5 Flash** | 화면해설 초안 생성. 고품질 필요 시 Gemini 2.5 Pro 전환 가능 | Flash: $2.50/1M out, Pro: $10.00/1M out |
| 음성 합성 (TTS) | Google Cloud TTS (WaveNet/Neural2) | 화면해설 음성 생성 | WaveNet: $4/100만 글자 (무료 티어 400만) |
| 영상 전처리 | FFmpeg (EC2/로컬) | 메타데이터 추출, 최종 영상 합성 | EC2 c5.xlarge 스팟 \~$0.06/hr |

> **Gemini 2.5의 핵심 장점**: MP4 파일을 직접 업로드하여 비디오와 오디오를 단일 API 호출로 동시 분석합니다. FFmpeg 프레임 추출 파이프라인이 불필요하며, 별도 STT(Whisper) 호출 없이 대사 타이밍을 추출할 수 있습니다. 타임스탬프 기반 질의(MM:SS 형식)가 가능하여 화면해설 타이밍 동기화에 적합합니다.

### 대안: GPT-4o 기반

Gemini 대신 GPT-4o를 사용하는 경우 아래 구성이 필요합니다:

| 기능 | 서비스 | 비고 | 제약사항 |
|------|--------|------|----------|
| 영상/이미지 분석 | OpenAI GPT-4o Vision | 장면 분석, 객체 인식 | **영상 직접 처리 불가** — 프레임 이미지만 입력 가능. 한국어 자막 OCR 정확도 낮음 |
| 해설 텍스트 생성 | GPT-4o / Claude Sonnet 4 (`claude-sonnet-4-20250514`) | 화면해설 초안 | 화면해설 표준 지식 미보유 — 시스템 프롬프트에 가이드라인 임베딩 필수 |
| 음성 인식 (STT) | OpenAI Whisper API (`gpt-4o-transcribe`) | 기존 음성/대사 추출 | **파일 업로드 25MB 제한** — 30분 오디오는 분할 업로드 필요 |
| 화자 분리 (Option A) | `gpt-4o-transcribe-diarize` | STT + 화자분리 통합 | Whisper API와 동일한 25MB 제한 |
| 화자 분리 (Option B) | pyannote-audio | 로컬 실행, MIT 라이선스 | HuggingFace 토큰 + 이용약관 동의 필요, GPU 권장 (DER 7.8\~24.4%) |
| **프레임 추출 (필수)** | FFmpeg (EC2 c5.xlarge) | 영상에서 분석용 프레임 이미지 추출 | **GPT-4o Vision 사용 시 필수** 전처리 단계 |

> **참고**: GPT-4o Vision은 영상 파일을 직접 처리할 수 없으므로, FFmpeg로 프레임 이미지를 추출한 뒤 개별 이미지를 API에 전달하는 파이프라인이 필요합니다. 또한 별도로 Whisper API를 호출하여 음성/대사를 추출해야 합니다.

### TTS 공통

| 기능 | 서비스 | 비고 | 제약사항 |
|------|--------|------|----------|
| 음성 합성 (TTS) | Google Cloud TTS (WaveNet/Neural2) | 화면해설 음성 생성 | **Chirp 3 HD는 SSML 미지원 → 화면해설 부적합** (속도/일시정지 제어 불가). WaveNet/Neural2만 사용 |
