---
title: 4.8. 웹 시스템 아키텍처
description: 클라우드 기반 웹 시스템 아키텍처 설계
---

# Web 시스템 아키텍처

클라우드 기반의 웹 관리자(Admin) 시스템 구조 및 보안 정책 수립

---

## 아키텍처 개요

### TO-BE 시스템 구성도

![TO-BE 시스템 구성도](/diagrams/goodthinking-isp/04-design/web-architecture-L16.svg)

---

## 기술 스택

### Frontend

| 구분 | 기술 | 비고 |
|------|------|------|
| Framework | React 18 | SPA 기반 관리자 시스템 |
| UI Library | Ant Design 5 | 관리자 UI에 최적화된 컴포넌트 |
| State Management | React Query + Zustand | 서버 상태 + 클라이언트 상태 분리 |
| Build Tool | Vite | |

### Backend

| 구분 | 기술 | 비고 |
|------|------|------|
| Framework | NestJS | 모듈 기반 모놀리식 아키텍처 |
| API | RESTful API | OpenAPI(Swagger) 문서화 |
| Authentication | JWT + RBAC | 역할 기반 접근 제어 |
| ORM | TypeORM | MSSQL 네이티브 지원 |
| Queue | BullMQ | 비동기 배치 처리 (주문 수집, 배송 추적) |

### Database

| 구분 | 기술 | 비고 |
|------|------|------|
| Primary DB | MSSQL (AWS RDS for SQL Server) | 현행 MSSQL 유지, 이관 리스크 최소화 |
| Cache | Redis (ElastiCache) | 세션, 캐시, 큐 |
| Search | Elasticsearch | 검색 기능 (선택, 2단계) |

### Infrastructure

| 구분 | 기술 | 비고 |
|------|------|------|
| Cloud | AWS | 현행 AWS 인프라 활용 |
| Container | Docker | |
| Orchestration | ECS Fargate 또는 EC2 | K8s 대비 운영 비용/복잡도 절감 |
| CI/CD | GitHub Actions | |
| Monitoring | CloudWatch + Sentry | 인프라 + 애플리케이션 모니터링 |

---

## 보안 정책

### 1. 인증 (Authentication)

![1. 인증 (Authentication)](/diagrams/goodthinking-isp/04-design/web-architecture-L161.svg)

| 항목 | 정책 |
|------|------|
| 인증 방식 | ID/Password + JWT |
| 토큰 만료 | Access: 1시간, Refresh: 7일 |
| 2FA | 관리자 계정 필수 (선택) |
| 비밀번호 | 8자 이상, 복잡도 규칙 적용 |

### 2. 인가 (Authorization)

| 역할 | 권한 |
|------|------|
| 최고관리자 | 전체 기능 |
| 관리자 | 설정 외 전체 |
| CS담당자 | CS, 고객 조회 |
| 운영담당자 | 주문, 배송 관리 |

### 3. 데이터 보안

| 항목 | 정책 |
|------|------|
| 전송 암호화 | HTTPS (TLS 1.3) |
| 저장 암호화 | 개인정보 필드 AES 암호화 |
| 접근 통제 | IP 화이트리스트 (선택) |
| 로그 | 모든 접근/변경 기록 |

### 4. 감사 로그

```sql
-- 감사 로그 예시 구조
audit_log (
  id,
  user_id,
  action,        -- CREATE, READ, UPDATE, DELETE
  resource,      -- 대상 테이블/기능
  resource_id,   -- 대상 레코드 ID
  old_value,     -- 변경 전 (JSON)
  new_value,     -- 변경 후 (JSON)
  ip_address,
  user_agent,
  created_at
)
```

---

## 화면 설계 (Wireframe)

### 주요 화면 목록

| No | 화면 | 설명 | 관련 요건 | 상태 |
|----|------|------|-----------|:----:|
| 1 | 대시보드 | 핵심 지표 요약 (매출, 구독, CS, 배송) | DB-01~05 | ISP 정의 완료 |
| 2 | 고객 목록 | 통합 고객 조회 (채널별 필터) | CM-01~09 | ISP 정의 완료 |
| 3 | 고객 상세 | 고객 정보 + 구독/결제/CS/배송 이력 (탭) | CM-01, CM-02, CM-05 | ISP 정의 완료 |
| 4 | 구독 관리 | 구독 접수/갱신/해지/CMS 권한 | SB-01~11 | ISP 정의 완료 |
| 5 | 주문 목록 | 다채널 주문 통합 조회 | OM-01~05 | ISP 정의 완료 |
| 6 | 주문 상세 | 주문 처리, 결제, 배송 연동 | OM-02, OM-03 | ISP 정의 완료 |
| 7 | 배송 관리 | 송장 등록, 배송 추적, 정기발송 | DL-01~09 | ISP 정의 완료 |
| 8 | 결제/정산 | 결제 확인, 환불, 정산 리포트, 이연수익 | FN-01~16 | ISP 정의 완료 |
| 9 | CS/상담 | 문의 접수, 처리, CTI 연동, 상담 이력 | CS-01~10 | ISP 정의 완료 |
| 10 | 선물 관리 | 선물 주문, 발송, 재고 | GF-01~04 | ISP 정의 완료 |
| 11 | 재고/도서 | 도서 관리, 재고 현황, 입출고 | BK-01~03 | ISP 정의 완료 |
| 12 | 통계/리포트 | 매출, 구독, CS 분석 리포트 | DB-01~05, FN-15~16 | ISP 정의 완료 |
| 13 | 시스템 설정 | 사용자, 권한, 코드 관리, 감사로그 | AD-01~07 | ISP 정의 완료 |

> **주**: 화면별 항목/요건 매핑은 ISP 단계에서 정의 완료. 상세 wireframe·UI/UX 설계는 [구축 단계 RFP](/goodthinking-isp/05-implementation/rfp-preparation/)의 "화면 설계서(D-06)" 산출물로 이관됩니다.

---

## 작성 이력

| 날짜 | 작성자 | 변경 내용 |
|------|--------|----------|
| YYYY-MM-DD | - | 초안 작성 |
| 2026-04-20 | ISP팀 | 3장 기능요건 정합성 반영: 기술스택 확정 (React/Ant Design + NestJS + MSSQL/AWS RDS + ECS Fargate), DB엔진 PostgreSQL→MSSQL 전면 수정, 서비스 레이어 5개→11개 모듈 확장, 화면 목록 7개→13개 확장 및 3장 요건번호 연결, 시스템 구성도 외부 연동 보강 (ERP/CTI 추가) |
| 2026-04-20 | ISP팀 | 외부 연동 현실성 반영: ERP API→Excel 템플릿 연동, CMS API→Excel 기반 처리, CTI 조건부 연동으로 수정 |
| 2026-04-20 | ISP팀 | CMS 개념 보정: CMSAPI 모듈명을 '구독권한 Excel관리'로 변경 — CS 시스템 내 CMS 모듈이 아닌 구독자 열람 권한 Excel 내보내기 기능임을 명확화 |
