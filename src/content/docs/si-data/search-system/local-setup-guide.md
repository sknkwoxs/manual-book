---
title: "SLLM 로컬 환경 설치 가이드"
---

> [SI-DATA 문서](../../) / [검색시스템 설계 문서](../)

**버전**: 1.0  
**작성일**: 2026-01-14  
**대상 환경**: macOS (Apple Silicon M1/M2/M3/M4)  
**운영 배포 참고용**

---

## 1. 개요

이 문서는 SLLM(Small/Local LLM) 기반 검색 시스템의 로컬 개발 환경 설치 절차를 설명합니다.  
운영 환경 배포 시 이 문서를 참고하여 설치를 진행합니다.

### 1.1 시스템 요구사항

| 항목 | 최소 사양 | 권장 사양 |
|------|----------|----------|
| OS | macOS 12+ (Monterey) | macOS 14+ (Sonoma) |
| 칩셋 | Apple M1 | Apple M1 Max / M4 Pro 이상 |
| RAM | 16GB | 32GB 이상 |
| 디스크 | 20GB 여유 | 50GB 이상 |
| Python | 3.10+ | 3.11+ |

### 1.2 설치 구성요소

| 구성요소 | 버전 | 용도 |
|---------|------|------|
| Ollama | 0.14.0+ | LLM 실행 런타임 |
| **Qwen3 8B** | latest | 한국어 지원 LLM 모델 (권장) |
| Python | 3.11+ | FastAPI 서비스 |
| FastAPI | 0.109+ | API 서버 |

> **참고**: EEVE-Korean 모델은 Ollama 공식 라이브러리에서 제공되지 않아 Qwen3 8B를 권장 모델로 선정했습니다. Qwen3은 한국어 성능이 우수하고 thinking 기능을 지원합니다.

---

## 2. Ollama 설치

### 2.1 Homebrew를 통한 설치 (권장)

```bash
# Homebrew 업데이트
brew update

# Ollama 설치
brew install ollama

# 설치 확인
ollama --version
```

### 2.2 공식 웹사이트에서 설치 (대안)

1. https://ollama.ai 접속
2. "Download" 클릭
3. macOS용 설치 파일 다운로드
4. 설치 파일 실행 및 안내에 따라 설치

### 2.3 설치 확인

```bash
# 버전 확인
ollama --version
# 예상 출력: ollama version 0.x.x

# 설치 경로 확인
which ollama
# 예상 출력: /opt/homebrew/bin/ollama
```

---

## 3. Ollama 서비스 시작

### 3.1 서비스 시작

```bash
# 포그라운드 실행 (터미널 점유)
ollama serve

# 또는 백그라운드 실행
ollama serve &

# 또는 nohup으로 실행 (터미널 종료 후에도 유지)
nohup ollama serve > /tmp/ollama.log 2>&1 &
```

### 3.2 서비스 상태 확인

```bash
# API 응답 확인
curl http://localhost:11434/api/tags

# 예상 출력 (모델 없는 경우):
# {"models":[]}
```

### 3.3 서비스 포트

| 서비스 | 포트 | 용도 |
|--------|------|------|
| Ollama API | 11434 | LLM 요청 처리 |

---

## 4. LLM 모델 다운로드

### 4.1 권장 모델: Qwen3 8B

| 항목 | 값 |
|------|-----|
| 모델명 | qwen3:8b |
| 크기 | ~5.2GB |
| 특징 | 한국어 우수, thinking 지원, Alibaba |
| 응답 시간 | M1 Max 32GB 기준 약 5-6초 |

### 4.2 모델 다운로드

```bash
# Qwen3 8B 모델 다운로드 (약 5.2GB, 1-2분 소요)
ollama pull qwen3:8b

# 다운로드 진행률 표시됨
# pulling manifest
# pulling xxxx... 100% ████████████████████████████████
```

### 4.3 대안 모델 (필요시)

```bash
# Qwen2.5 7B (더 작은 크기, 빠른 응답)
ollama pull qwen2.5:7b-instruct

# Gemma3 12B (Google, 다국어 지원)
ollama pull gemma3:12b

# Llama 3.1 8B (Meta, 영어 우수)
ollama pull llama3.1:8b-instruct-q4_K_M
```

### 4.4 모델 목록 확인

```bash
ollama list

# 예상 출력:
# NAME        ID              SIZE      MODIFIED
# qwen3:8b    500a1f067a9f    5.2 GB    Just now
```

---

## 5. LLM 테스트

### 5.1 대화형 테스트

```bash
# 대화형 모드 실행
ollama run qwen3:8b

# 프롬프트 입력 예시:
>>> 서울 아파트 가격과 관련된 검색 키워드 5개를 추천해주세요.

# 예상 응답:
# 서울 아파트 가격 동향  
# 서울 강남 아파트 가격  
# 서울 주요 지방도 아파트 가격 비교  
# 서울 아파트 평균 가격  
# 서울 아파트 가격 영향 요인

# 종료: /bye 또는 Ctrl+D
```

### 5.2 API 테스트

```bash
# cURL로 API 호출
curl http://localhost:11434/api/generate -d '{
  "model": "qwen3:8b",
  "prompt": "서울 인구 통계 관련 검색어 3개 추천. JSON 배열로만 응답하세요.",
  "stream": false
}'

# 예상 응답:
# {
#   "model": "qwen3:8b",
#   "response": "[\"서울 인구 통계\", \"서울 인구 증가율\", \"서울 지역 인구 분포\"]",
#   "done": true
# }
```

### 5.3 응답 시간 측정

```bash
# 응답 시간 측정 (time 명령어 사용)
time curl -s http://localhost:11434/api/generate -d '{
  "model": "qwen3:8b",
  "prompt": "서울 교통 관련 키워드 3개를 JSON 배열로 응답하세요.",
  "stream": false
}' | jq -r '.response'

# M1 Max 32GB 기준 측정값: 약 5-6초
```

---

## 6. Python 환경 설정

### 6.1 Python 버전 확인

```bash
python3 --version
# 필요 버전: 3.10 이상
```

### 6.2 가상환경 생성

```bash
# 프로젝트 디렉토리로 이동
cd /path/to/si-data/services/llm-search

# 가상환경 생성
python3 -m venv venv

# 가상환경 활성화
source venv/bin/activate

# pip 업그레이드
pip install --upgrade pip
```

### 6.3 의존성 설치

```bash
# requirements.txt 설치
pip install -r requirements.txt
```

**requirements.txt 내용:**

```
fastapi>=0.109.0
uvicorn>=0.27.0
httpx>=0.26.0
pydantic>=2.5.0
python-dotenv>=1.0.0
```

---

## 7. FastAPI 서비스 실행

### 7.1 개발 모드 실행

```bash
# 가상환경 활성화 상태에서
cd /path/to/si-data/services/llm-search

# uvicorn으로 실행 (자동 리로드)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 7.2 프로덕션 모드 실행

```bash
# 워커 수 지정 (CPU 코어 수 기준)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 7.3 서비스 확인

```bash
# 헬스체크
curl http://localhost:8000/health

# API 문서 (브라우저)
open http://localhost:8000/docs
```

---

## 8. 서비스 포트 요약

| 서비스 | 포트 | 용도 |
|--------|------|------|
| Drupal (DDEV) | 443/80 | 웹 애플리케이션 |
| Ollama | 11434 | LLM API |
| FastAPI | 8000 | 키워드 확장 API |
| Elasticsearch | 9200 | 검색 엔진 |

---

## 9. 문제 해결

### 9.1 Ollama 서비스 시작 실패

```bash
# 포트 충돌 확인
lsof -i :11434

# 기존 프로세스 종료
pkill ollama

# 재시작
ollama serve
```

### 9.2 모델 다운로드 실패

```bash
# 네트워크 확인
curl -I https://ollama.ai

# 모델 삭제 후 재다운로드
ollama rm qwen3:8b
ollama pull qwen3:8b
```

### 9.3 메모리 부족

```bash
# 현재 메모리 사용량 확인
top -l 1 | grep PhysMem

# 더 작은 모델 사용
ollama pull qwen3:4b
```

### 9.4 GPU 가속 확인 (Apple Silicon)

```bash
# Metal 지원 확인
system_profiler SPDisplaysDataType | grep Metal

# Ollama는 자동으로 Metal GPU 가속 사용
```

---

## 10. 운영 배포 체크리스트

### 10.1 설치 전 확인

- [ ] 서버 사양 확인 (RAM 32GB 이상 권장)
- [ ] 디스크 공간 확인 (50GB 이상)
- [ ] 네트워크 포트 개방 (8000, 11434)

### 10.2 설치 단계

- [ ] Ollama 설치
- [ ] Qwen3 8B 모델 다운로드
- [ ] Python 환경 설정
- [ ] FastAPI 서비스 설치
- [ ] 서비스 자동 시작 설정

### 10.3 설치 후 확인

- [ ] Ollama API 응답 확인
- [ ] LLM 모델 응답 테스트
- [ ] FastAPI 헬스체크
- [ ] Drupal 연동 테스트

---

## 11. 서비스 자동 시작 (운영용)

### 11.1 Ollama LaunchAgent (macOS)

```bash
# LaunchAgent 파일 생성
cat > ~/Library/LaunchAgents/com.ollama.server.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ollama.server</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/ollama</string>
        <string>serve</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

# 서비스 로드
launchctl load ~/Library/LaunchAgents/com.ollama.server.plist
```

### 11.2 FastAPI systemd (Linux 서버용)

```ini
# /etc/systemd/system/llm-search.service
[Unit]
Description=LLM Search FastAPI Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/si-data/services/llm-search
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2026-01-14 | 초안 작성 |
| 1.1 | 2026-01-14 | EEVE → Qwen3 8B 모델 변경 (Ollama 라이브러리 가용성) |
