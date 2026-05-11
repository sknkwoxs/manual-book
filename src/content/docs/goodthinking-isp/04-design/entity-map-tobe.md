---
title: TO-BE 엔티티 조감도
description: 기능요건을 반영한 목표 시스템의 조직·시스템·업무 전체 연계 관계
sidebar:
  order: 7
---

# TO-BE 엔티티 조감도

[AS-IS 엔티티 관계도](/goodthinking-isp/02-analysis/entity-map/)에서 식별된 **병목 업무**와 [기능요건](/goodthinking-isp/03-requirements/)을 반영하여, 목표 시스템에서 각 팀의 업무 흐름이 어떻게 변화하는지를 조망합니다.

---

## 1. 전체 조감도 (TO-BE)

C/S 로컬 시스템이 **웹 기반 웹 CS 시스템**으로 전환되고, 분산된 외부 시스템 연동이 **Excel 템플릿 자동 생성/파싱 기반 자동화**로 일원화됩니다.

![1. 전체 조감도 (TO-BE)](/diagrams/goodthinking-isp/04-design/entity-map-tobe-L18.svg)

---

## 2. 팀별 조감도 (TO-BE)

각 팀의 AS-IS 병목이 TO-BE에서 어떻게 해소되는지를 **Before → After** 형식으로 표시합니다.

### 2-1. 정기구독팀

![2-1. 정기구독팀](/diagrams/goodthinking-isp/04-design/entity-map-tobe-L136.svg)

| 업무 | AS-IS 병목 | TO-BE 개선 | 관련 요건 |
|:---:|:---|:---|:---:|
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">①</span> | 🔴 Playauto Excel → CS **수기입력** | 🟢 Playauto Excel → **자동 파싱·변환** → 자동 등록 | OM-01, SB-09 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">②</span> | 🔴 구독 해지 → CS **수기삭제** | 🟢 웹 CS 시스템에서 **온라인 등록/해지/변경** | SB-01 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">③</span> | 🔴 우체국·CJ ↔ **엑셀 수기 매칭** → ERP | 🟢 택배사 양식 Excel **자동 생성** + 송장 Excel **자동 파싱** | DL-03, DL-05 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">④</span> | 🟢 나이스페이 승인 → ERP 매출 | 🟢 나이스페이 정산 Excel **자동 파싱** → ERP Excel **자동 생성** | FN-01, FN-06 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">⑤</span> | 🟢 선물·재발송 (3~4단계 우회) | 🟢 **원클릭 선발송** 처리 | SB-06 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">⑥</span> | ❌ 만료 확인 수동 조회 / CMS 권한 수동 복사 | 🟢 **만료 예정 자동 알림** + CMS **권한 자동 연동** | SB-04, SB-05 |

### 2-2. 영업추진팀

![2-2. 영업추진팀](/diagrams/goodthinking-isp/04-design/entity-map-tobe-L197.svg)

| 업무 | AS-IS 병목 | TO-BE 개선 | 관련 요건 |
|:---:|:---|:---|:---:|
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">①</span> | 🔴 고려출판물류 → ERP **이중입력** | 🟢 재고 템플릿 업로드 → 웹 CS 시스템 **자동 반영** + ERP Excel 자동생성 | BK-03 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">②</span> | 🔴 엑셀 → 관리 → 위하고 **삼중입력** | 🟢 은행 데이터 업로드 → **자동 대조** + 미수금 현황 즉시 파악 | FN-10 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">③</span> | 🔴 통장내역 **수작업 대조** | 🟢 **재고 공유 대시보드** + 보고서 자동 생성 | DB-04, DB-03 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">④</span> | 🟡 개인엑셀 관리 → CS 카드결제 | 🟢 **거래처 통합 관리** + 위하고 코드 매핑 | CM-07 |

### 2-3. 경영지원팀

![2-3. 경영지원팀](/diagrams/goodthinking-isp/04-design/entity-map-tobe-L246.svg)

| 업무 | AS-IS 병목 | TO-BE 개선 | 관련 요건 |
|:---:|:---|:---|:---:|
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">①</span> | 🔴 CS ↔ ERP **수기 대사** | 🟢 매출 데이터 → ERP용 **Excel 자동생성** + 자동 대사 | FN-04 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">②</span> | 🔴 신한뱅크 → 엑셀 → CS **수기입력** | 🟢 입금 데이터 업로드 → PG/무통장/지로 **자동 매칭** | FN-02 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">③</span> | 🟡 급여·인세 **수기 산출** | 🟢 출고 수량 기반 **인세 자동 계산** + 원가 관리 | FN-08 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">④</span> | 🟢 선수수익 관리 | 🟢 구독 기간 기반 **이연수익 자동 계산** | FN-03 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">⑤</span> | ❌ 매출 통계 미지원 | 🟢 채널 통합 **매출 리포트 자동 생성** | FN-05 |

### 2-4. 편집실 (월간지 + 단행본)

![2-4. 편집실 (월간지 + 단행본)](/diagrams/goodthinking-isp/04-design/entity-map-tobe-L295.svg)

| 업무 | AS-IS | TO-BE 개선 | 관련 요건 |
|:---:|:---|:---|:---:|
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#fef9c3;border:2px solid #ca8a04;border-radius:50%;font-weight:700;color:#854d0e;">①</span> | 🟡 원고 수집: 다양한 채널 → Admin | 🟡 현행 유지 (Admin 원고 수집·배분) | — |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#fef9c3;border:2px solid #ca8a04;border-radius:50%;font-weight:700;color:#854d0e;">②</span> | 🟡 편집·교정: Admin → NAS 작업 | 🟡 현행 유지 (NAS 기반 편집 작업) | — |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">③</span> | 🟢 발행·아카이브 → CMS | 🟢 현행 유지 (CMS 아카이브) | — |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">④</span> | ❌ CMS 열람 권한 **수동 복사·붙여넣기** | 🟢 구독 상태 → CMS 열람 권한 **자동 연동** | SB-05 |

> **편집실 핵심 변화**: 기존 원고 수집·편집 워크플로우는 현행 유지하되, **병목 ⑰**(Admin→CMS 수동 복사·붙여넣기)이 웹 CS 시스템의 API를 통해 자동화됩니다.

### 2-5. 외주 콜센터 (더아이앤오)

![2-5. 외주 콜센터 (더아이앤오)](/diagrams/goodthinking-isp/04-design/entity-map-tobe-L346.svg)

| 업무 | AS-IS 병목 | TO-BE 개선 | 관련 요건 |
|:---:|:---|:---|:---:|
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">①</span> | 🔴 CTI 중단 → CS **수기 번호 검색** | 🟡 **웹 CTI 복구** → 전화 인입 시 고객 정보 자동 팝업 **(⚠️ 별도 과업)** | CS-03 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">②</span> | 🟢 아웃바운드 콜 (오토콜) | 🟢 현행 유지 + 만료 명단 자동 추출 연동 | SB-08 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">③</span> | 🟡 CS + 엑셀 **이중기록** | 🟢 웹 CS 시스템 **단일 기록** + 메모 일괄 업로드 | CS-02, CS-07 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">④</span> | 🟢 리포트 (외부 엑셀 집계) | 🟢 **내장 OB/IB 실적 통계** + 정산 자동화 | CS-08 |
| <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#dcfce7;border:2px solid #16a34a;border-radius:50%;font-weight:700;color:#166534;">⑤</span> | ❌ 카드 결제 URL 발송 미지원 | 🟢 **결제 링크 즉시 발송** (알림톡/SMS) + 당일 취소 | FN-09 |

> **콜센터 핵심 변화**: VPN 접속 → 웹 브라우저 접속으로 전환되며, **권한 세분화**(CS-05)로 실적 데이터 수정이 불가능해져 정산 투명성이 확보됩니다.

---

## 3. 시스템 간 연동 관계 (TO-BE)

AS-IS의 분산된 시스템 연동이 **고객 정보 템플릿 매핑** 중심으로 일원화됩니다.

![3. 시스템 간 연동 관계 (TO-BE)](/diagrams/goodthinking-isp/04-design/entity-map-tobe-L399.svg)

---

## 4. AS-IS → TO-BE 변화 요약

### 병목 해소 매핑

| # | AS-IS 병목 | TO-BE 해소 방안 | 핵심 요건 |
|:---:|:---|:---|:---|
| 1 | Playauto Excel 수기입력 | 주문 자동 수집 + 일괄등록 | OM-01, SB-09 |
| 2 | 구독 해지 수기삭제 | 통합 구독 관리 (등록/해지/변경) | SB-01 |
| 3 | 배송 엑셀 수기 매칭 | 택배사 양식 Excel 자동 생성 + 송장 Excel 자동 파싱 | DL-03, DL-05 |
| 4 | CS ↔ ERP 수기 대사 | ERP용 Excel 자동생성 | FN-04 |
| 5 | 신한뱅크 → 엑셀 → CS 수기입력 | 입금 데이터 업로드 → 자동 매칭 | FN-02 |
| 6 | 고려출판물류 → ERP 이중입력 | 재고 템플릿 + Excel 자동생성 | BK-03 |
| 7 | 입금 삼중입력 (엑셀→관리→위하고) | 일일 입금 자동 대조 + 미수금 현황 | FN-10 |
| 8 | CTI 중단 → 수기 번호 검색 | 웹 CTI 복구 → 자동 팝업 **(⚠️ 별도 과업 — 서울정보시스템 담당)** | CS-03 |
| 9 | Admin → CMS 수동 복사·붙여넣기 | 구독 상태 → CMS 권한 자동 연동 | SB-05 |
| 10 | 상담 이력 이중기록 (CS+엑셀) | 통합 상담 이력 + 메모 일괄 업로드 | CS-02, CS-07 |

### 시스템 전환 요약

| 구분 | AS-IS | TO-BE |
|:---:|:---|:---|
| **핵심 시스템** | C/S 로컬 설치형 (XPlatform) | 웹 기반 통합 관리 시스템 (Headless CMS + SSR 프론트엔드) |
| **데이터베이스** | MSSQL + MySQL 분리 운영 | MariaDB 통합 DB (AWS Lightsail Managed) |
| **외부 연동** | 수동 Excel ↔ 개별 시스템 | Excel 템플릿 자동 생성/파싱 기반 연동 자동화 |
| **ERP 연동** | 수기 대사 + 이중입력 | Excel 자동생성 (API 미제공으로 현실적 대안) |
| **CMS 연동** | 수동 복사·붙여넣기 | 내부 시스템 간 권한 자동 연동 |
| **CTI** | ⚠️ 중단 (KT→LG 전환 후) | ⚠️ 별도 과업 (서울정보시스템 담당, 고객 결정사항) |
| **대시보드** | 없음 | 준실시간 KPI + 알림 + 보고서 |
| **보안** | 로컬 네트워크 제한 | VPN + 2차 인증 + 권한 세분화 |

---

## 범례

| 기호 | 의미 |
|:---:|:---|
| 🟢 | 개선 완료 (자동화·통합) |
| 🟡 | 현행 유지 (안정 운영 중) |
| ❌ | AS-IS 미지원 → TO-BE 신규 |
| `→` | 데이터 흐름 (일방향) |
| `<-->` | 데이터 동기화 (쌍방향) |
| 🌐 웹 CS 시스템 | AS-IS C/S System을 대체하는 웹 기반 시스템 |
| 🏠 현행 유지 | 변경 없이 유지되는 기존 시스템 |
