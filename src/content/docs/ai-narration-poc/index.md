---
title: AI 화면해설 PoC
description: AI 기반 화면해설 생성 및 협업 편집 SaaS PoC 시스템 구성 및 운영 비용 추산서
---

**AI 기반 화면해설 생성 및 협업 편집 SaaS PoC** 시스템 구성 및 운영 비용 추산 문서입니다.

---

## 문서 목록

| # | 분류 | 설명 |
|---|------|------|
| 1 | [시스템 구성 개요](./system-design/01-system-overview/) | Gemini 기반 7개 모듈 구성 및 12단계 데이터 흐름 |
| 2 | [기술 스택 권장안](./system-design/02-tech-stack/) | 백엔드, 프론트엔드, AI/ML 서비스 기술 선택 |
| 3 | [서비스별 단가표](./system-design/03-service-pricing/) | Gemini / GPT-4o / TTS / Fine-tuning 비용 |
| 4 | [인프라 비용](./system-design/04-infrastructure/) | AWS 기반 컴퓨팅, 스토리지, DB, 캐시 비용 |
| 5 | [PoC 월간 운영 비용](./system-design/05-cost-scenario/) | Gemini Flash 기준 30건/월 비용 시나리오 |
| 6 | [비용 스케일링](./system-design/06-cost-scaling/) | Gemini 기준 규모 확장 시 비용 추이 |
| 7 | [비용 최적화 전략](./system-design/07-cost-optimization/) | Context Caching, Batch Tier, 인프라 최적화 |
| 8 | [PoC 구현 우선순위](./system-design/08-poc-priority/) | P0~P3 단계별 구현 로드맵 |
| 9 | [주요 고려사항](./system-design/09-considerations/) | 성능, 품질, 보안, 확장성 |
| 10 | [서비스 비교 요약](./system-design/10-service-comparison/) | 영상 분석, LLM, TTS, STT 서비스 비교 |

### 개발 비용

| # | 분류 | 설명 |
|---|------|------|
| 1 | [비용 산출 기준](./development-cost/01-estimation-basis/) | 인력 구성, 인건비 단가, 산출 방법론 |
| 2 | [P0 필수 모듈](./development-cost/02-p0-core/) | 영상 입력, Gemini 분석, 해설 생성 파이프라인 |
| 3 | [P1 핵심 모듈](./development-cost/03-p1-essential/) | 데이터 저장, 편집 UI, TTS/영상 합성 |
| 4 | [P2 확장 모듈](./development-cost/04-p2-expansion/) | 버전 관리, 실시간 협업, GPT-4o 대안 |
| 5 | [P3 고도화 모듈](./development-cost/05-p3-advanced/) | 학습 데이터, Fine-tuning 파이프라인 |
| 6 | [개발 비용 종합](./development-cost/06-cost-summary/) | 시나리오별 비교, TCO, 타임라인 |

---

## 프로젝트 개요

- **프로젝트명**: AI 기반 화면해설 생성 및 협업 편집 SaaS PoC
- **목적**: TV 프로그램 등 영상 콘텐츠에 대한 AI 자동 화면해설 생성 및 협업 편집 시스템 구축
- **핵심 기술**: **Gemini 2.5 Flash** (네이티브 비디오 분석), Google Cloud TTS, React + CRDT
- **PoC 월간 비용**: 약 **$46 (₩63,000)** - Gemini Flash 기준 30건/월
- **대안 (GPT-4o)**: 약 $55\~60 — 프레임 추출 + Whisper STT 필요
- **개발 비용 (권장 P0+P1)**: 약 **₩27.8M \~ ₩46.0M** ($20K \~ $33K) / 8\~13주 / 3명
- **전체 개발 비용 (P0\~P3)**: 약 ₩53.3M \~ ₩78.4M / 15\~22주
- **문서 작성일**: 2026년 2월 26일
