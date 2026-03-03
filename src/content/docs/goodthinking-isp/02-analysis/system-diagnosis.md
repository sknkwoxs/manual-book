---
title: 시스템 정밀진단
description: 로컬 프로그램 및 DB 구조 역공학 분석
---

# 시스템 정밀진단

로컬 프로그램(Tobesoft) 내 하드코딩 된 로직 및 MSSQL DB 구조 역공학(Reverse Engineering)

---

## AS-IS 시스템 아키텍처

현재 좋은생각 시스템은 다음과 같이 구성되어 있습니다.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              AWS Cloud (Webserver)                               │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                           │  │
│  │   ┌─────────────┐      API      ┌─────────────┐      ┌─────────────┐     │  │
│  │   │             │◄─────────────►│             │      │             │     │  │
│  │   │     CMS     │               │    Admin    │◄────►│  홈페이지DB  │     │  │
│  │   │ (콘텐츠관리) │               │  (Node.js)  │      │(MSSQL 63t)  │     │  │
│  │   │  13 tables  │               │             │      │             │     │  │
│  │   └─────────────┘               └──────┬──────┘      └──────┬──────┘     │  │
│  │                                        │                    │             │  │
│  │   ┌─────────────┐                      │              ┌─────┴─────┐       │  │
│  │   │  Homepage   │◄─────────────────────┘              │ 나이스페이 │       │  │
│  │   │   (SPA)     │                                     │  PG 연동   │       │  │
│  │   └─────────────┘                                     └───────────┘       │  │
│  │                                                                           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘

                    │ (데이터 연동 없음 - 수동 Excel 이관)
                    ▼

┌─────────────────────────────────────────────────────────────────────────────────┐
│                On-Premise (사무실 / KT기가오피스 서버실)                           │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                           │  │
│  │  ┌──────────┐  Download  ┌──────────────┐       ┌──────────────┐          │  │
│  │  │          │──────────►│              │       │  고객관리 DB  │          │  │
│  │  │ Playauto │           │  CS System   │◄─────►│  (MSSQL)     │          │  │
│  │  │(주문수집) │  Upload   │  (XPlatform  │       │  75 tables   │          │  │
│  │  │          │◄──────────│   /Java)     │       │  20 SPs      │          │  │
│  │  └──────────┘           └──────┬───────┘       │  14 Functions │          │  │
│  │                                │               │  15 Triggers  │          │  │
│  │                          ┌─────┴──────┐        └──────────────┘          │  │
│  │                          │            │                                   │  │
│  │  ┌──────────┐            │  CTI 연동   │        ┌──────────────┐          │  │
│  │  │ MikroTik │            │ (서울정보   │        │  CMS DB      │          │  │
│  │  │  Router  │            │  시스템)    │        │  (MSSQL)     │          │  │
│  │  │  (VPN)   │            └────────────┘        │  13 tables   │          │  │
│  │  └──────────┘                                   └──────────────┘          │  │
│  │                                                                           │  │
│  │  ┌──────────┐     ┌──────────┐     ┌───────────┐                         │  │
│  │  │ 두루안   │     │ 이카운트  │     │ 나이스페이 │                         │  │
│  │  │ 방화벽   │     │  ERP     │     │  PG 연동   │                         │  │
│  │  └──────────┘     └──────────┘     └───────────┘                         │  │
│  │                                                                           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘

  ▲ VPN(PPTP)              ▲ 주문 수집                    ▲ 콜센터 CS
  │                        │                              │
┌─┴──────────┐      ┌─────┴───────┐              ┌───────┴──────┐
│ 외부 접속   │      │  외부 채널   │              │  더아이앤오  │
│ (원격근무)  │      │ 네이버/쿠팡  │              │ (외부콜센터) │
└────────────┘      └─────────────┘              │  ~4명       │
                                                  └──────────────┘
```

### 시스템 구성 요소

| 구분 | 컴포넌트 | 기술 스택 | 역할 | 위치 |
|------|----------|-----------|------|------|
| **웹 시스템** | Homepage | SPA | 고객용 홈페이지 (goodthinking.co.kr) | AWS |
| | Admin | Node.js | 웹 관리자 (홈페이지 상품/주문/콘텐츠 관리) | AWS |
| | CMS | MSSQL 기반 | 콘텐츠 관리 (월간지 원고, 필자, 코너 관리) | AWS |
| | 홈페이지 DB | MSSQL | 63 tables, 7 procedures, 1 function | AWS |
| **C/S 시스템** | CS System | Java, Tobesoft XPlatform | 고객관리 프로그램 (로컬 설치형, IE/Edge IE모드) | 사내 PC |
| | 고객관리 DB | MSSQL | 75 tables, 20 SPs, 14 functions, 15 triggers | 사내 서버 |
| | CMS DB | MSSQL | 13 tables (글, 필자, 코너, 키워드 등) | 사내 서버 |
| **인프라** | MikroTik Router | PPTP VPN | 외부 접속 (61.32.95.235) | 사무실 |
| | 두루안 방화벽 | - | 네트워크 보안 | 사무실 |
| | KT 기가오피스 | 서버실 | 사내 서버 호스팅 (KT아현) | IDC |
| **결제/PG** | 나이스페이 | PG API | 카드/가상계좌 결제 처리 (C/S + 웹 양쪽 연동) | 외부 |
| **전화** | CTI | 서울정보시스템 | 전화 수신 시 고객 자동 조회 (분기별 유지보수) | 사무실 |
| **외부 솔루션** | Playauto | - | 네이버 스마트스토어, 쿠팡 주문 수집 | 사내 PC |
| | 이카운트 ERP | SaaS | 회계/기안/결재 (경영지원팀) | 외부 |
| **외부 협력** | 더아이앤오 | 콜센터 | CS 아웃소싱 (~4명, 구독 접수/문의 처리) | 외부 |

### 인프라 상세

| 항목 | 내용 | 유지보수 |
|------|------|----------|
| **인터넷/전화** | KT (인터넷, 유선전화, 기가오피스 서버실) | KT |
| **VPN** | MikroTik (192.1.1.1), PPTP → 61.32.95.235 | 내부 관리 |
| **방화벽** | 두루안 | 두루안 |
| **CTI** | 서울정보시스템 (분기 방문 유지보수) | 서울정보시스템 |
| **백신** | 카스퍼스키 | 쿠도커뮤니케이션 |
| **라이선스** | MS365, Adobe CC, 산돌폰트 | 소프트웨어원, Adobe, 산돌 |
| **도메인** | 가비아, 아이네임즈 | 연 갱신 |

### 데이터 흐름

```
외부 채널 (네이버 스마트스토어, 쿠팡)
        │
        ▼
   ┌─────────┐
   │Playauto │ ─── 주문 데이터 수집 (수동 다운로드/업로드)
   └────┬────┘
        │
        ▼
   ┌──────────────┐           ┌──────────┐
   │  CS System   │───CTI────►│전화 수신 │ 고객 자동 조회
   │  (XPlatform) │           └──────────┘
   └──────┬───────┘
          │
   ┌──────┴──────────────────────────────────┐
   │                                          │
   ▼                                          ▼
┌──────────┐  나이스페이  ┌──────────┐    ┌──────────┐
│고객관리DB │◄───PG 연동──►│  결제    │    │  CMS DB  │
│(MSSQL)   │             │ (카드,   │    │(MSSQL)   │
│75 tables │             │ 가상계좌, │    │13 tables │
│          │             │  지로)   │    │          │
└──────────┘             └──────────┘    └──────────┘

        ⚠️ 수동 Excel 이관 (데이터 연동 API 없음)

   ┌──────────┐            ┌──────────┐
   │홈페이지DB │◄──Admin───►│ Homepage │
   │(MSSQL)   │  Node.js   │  (SPA)   │
   │63 tables │            └──────────┘
   └──────────┘
        │
   ┌────┴────┐
   │나이스페이│ PG 연동 (웹 결제)
   └─────────┘
```

---

## 분석 대상

### 1. 애플리케이션 (C/S 시스템)

| 항목 | 내용 |
|------|------|
| **프로그램명** | CS System (고객관리 시스템) |
| **개발 플랫폼** | Java, Tobesoft XPlatform |
| **설치 환경** | 로컬 PC (Windows) |
| **외부 연동** | Playauto (주문 수집 솔루션) |

### 2. 애플리케이션 (웹 시스템)

| 항목 | 내용 |
|------|------|
| **Admin** | Node.js 기반 관리자 시스템 |
| **Homepage** | SPA (Single Page Application) |
| **CMS** | 콘텐츠 관리 시스템 (API 연동) |
| **호스팅** | AWS |

### 3. 데이터베이스

| 항목 | CS 시스템 DB | 웹 시스템 DB |
|------|-------------|--------------|
| **DBMS** | Microsoft SQL Server | Microsoft SQL Server |
| **용도** | 고객/주문 데이터 | 웹 콘텐츠/상품/주문 |
| **위치** | 사내 서버 | AWS |
| **테이블 수** | 75 (고객관리) + 13 (CMS) | 63 |
| **주요 객체** | 20 SPs, 14 Functions, 15 Triggers | 7 Procedures |
| **연동 상태** | ⚠️ 분리됨 (수동 Excel 이관) | ⚠️ 분리됨 (수동 Excel 이관) |

---

## 역공학 분석 결과

### AS-IS ERD

```
                         ┌──────────────────┐
                         │   PT_Customer    │  ◀── 핵심 허브 엔티티
                         ├──────────────────┤
                         │ PK Customer_ID   │  (decimal 13)
                         │    Customer_NM   │
                         │    Tel_NO        │
                         │    ... (48 cols) │
                         └──┬───┬───┬───┬──┘
                            │   │   │   │
            ┌───────────────┘   │   │   └───────────────────┐
            │                   │   │                       │
            ▼                   │   ▼                       ▼
 ┌──────────────────┐          │  ┌──────────────────┐  ┌──────────────────┐
 │  PT_Subscribe    │          │  │PT_Councel_History│  │ PT_DEFERINCOME   │
 ├──────────────────┤          │  ├──────────────────┤  │    _INFO / _MST  │
 │ PK Customer_ID   │          │  │ FK Customer_ID   │  ├──────────────────┤
 │ PK Subscribe_SN  │          │  │    상담일시       │  │ FK Customer_ID   │
 │    Subscribe_DT  │          │  │    상담내용       │  │    선수수익정보   │
 │    ... (20 cols) │          │  └──────────────────┘  └──────────────────┘
 └──┬───────┬───────┘          │
    │       │                  │
    │       │                  ▼
    │       │        ┌──────────────────┐
    │       │        │   PT_Finance     │
    │       │        ├──────────────────┤
    │       │        │ PK Finance_SQ    │
    │       │        │ FK Customer_ID   │
    │       │        │    Finance_Type  │  (입금/환불)
    │       │        │    ... (22 cols) │
    │       │        └──────────────────┘
    │       │
    │       ▼
    │    ┌──────────────────┐
    │    │  PT_Receiver     │
    │    ├──────────────────┤
    │    │ PK Customer_ID   │
    │    │ PK Subscribe_SN  │
    │    │ PK Receiver_SN   │
    │    │ FK Book_SQ       │  ──────────┐
    │    │    Receiver_NM   │            │
    │    │    ... (43 cols) │            │
    │    └──────────────────┘            │
    │                                    │
    ▼                                    ▼
 ┌──────────────────┐         ┌──────────────────┐
 │   PT_GiftSend    │         │    PT_Book       │
 ├──────────────────┤         ├──────────────────┤
 │ FK Customer_ID   │         │ PK Book_SQ       │
 │ FK Subscribe_SN  │         │    Book_NM       │
 │    선물발송정보    │         │    ... (30 cols) │
 └──────────────────┘         └───────┬──────────┘
                                      │
 ┌──────────────────┐                 ▼
 │    PT_Giro       │         ┌──────────────────┐
 ├──────────────────┤         │  PT_BookPrice    │
 │ FK Customer_ID   │         ├──────────────────┤
 │ FK Subscribe_SN  │         │ FK Book_SQ       │
 │    지로 정보      │         │    가격/기간 정보  │
 └──────────────────┘         └──────────────────┘

 ┌──────────────────┐         ┌──────────────────┐
 │   PT_Company     │         │   PT_Stock       │
 ├──────────────────┤         ├──────────────────┤
 │ PK Company_CD    │────────►│ FK Company_CD    │
 │    Company_NM    │         │    재고 수량      │
 │    ... (49 cols) │         │    입출고 이력    │
 └──────────────────┘         └──────────────────┘

 * Customer_ID(decimal 13)가 전체 데이터 모델의 중심축
 * PT_Subscribe → PT_Receiver → PT_Finance 순으로 구독-배송-결제 연결
 * PT_Company → PT_Stock 으로 거래처-재고 관리
 * PT_Book → PT_BookPrice / PT_Receiver.Book_SQ 로 도서-가격-배송 연결
```

### 테이블 목록

> **총 151개 테이블** (C/S 고객관리 75 + CMS 13 + 홈페이지 63). 레코드 수는 VPN 접근 후 라이브 DB 확인 필요.

#### C/S 고객관리 DB (75 tables)

**핵심 테이블 (고객/구독/배송/재무)**

| No | 테이블명 | 용도 | 비고 |
|----|----------|------|------|
| 1 | PT_Customer | 고객 마스터 (48 cols) | 허브 엔티티, Customer_ID(decimal 13) PK |
| 2 | PT_Subscribe | 구독 접수 (20 cols) | Customer_ID + Subscribe_SN 복합키 |
| 3 | PT_Receiver | 받는사람/배송 (43 cols) | Customer_ID + Subscribe_SN + Receiver_SN |
| 4 | PT_Finance | 입금/환불 (22 cols) | Finance_SQ PK, Customer_ID FK |
| 5 | PT_Company | 거래처 마스터 (49 cols) | Company_CD PK |
| 6 | PT_Book | 도서 마스터 (30 cols) | Book_SQ PK |
| 7 | PT_BookPrice | 도서 가격 | Book_SQ FK |
| 8 | PT_Stock | 재고 관리 | Company_CD FK |
| 9 | PT_Stock_History | 재고 이력 | |
| 10 | PT_Giro | 지로 정보 | Customer_ID + Subscribe_SN FK |
| 11 | PT_GiftSend | 선물 발송 | Customer_ID FK |
| 12 | PT_GiftStock | 선물 재고 | 2020년 추가 |
| 13 | PT_GiftStockLogs | 선물 재고 로그 | 2020년 추가 |

**계정/인증/권한**

| No | 테이블명 | 용도 | 비고 |
|----|----------|------|------|
| 14 | PT_Account | 계정 | 신규생성 |
| 15 | PT_Account_History | 계정 이력 | 신규생성 |
| 16 | PT_Auth | 인증 | 신규생성 |
| 17 | PT_Button_authority | 버튼 권한 | 신규생성 |
| 18 | PT_Menu | 메뉴 | 신규생성 |
| 19 | PT_MENU_authority | 메뉴 권한 | 신규생성 |
| 20 | PT_Employee | 직원 정보 | 컬럼변경 |
| 21 | PT_ChangeEmployee | 직원 변경 이력 | 2018년 추가 |

**결제/정산/수익**

| No | 테이블명 | 용도 | 비고 |
|----|----------|------|------|
| 22 | PT_NicepayCreditcardIncome | 나이스페이 카드 수입 | 신규생성 |
| 23 | PT_NicepayVirtualAccount | 나이스페이 가상계좌 | 신규생성 |
| 24 | PT_NicepayVirtualAccountIncome | 가상계좌 수입 | 신규생성 |
| 25 | PT_NicepayToSettlementCodeMap | 정산코드 매핑 | 신규생성 |
| 26 | PT_SettlementMethod | 정산 방법 | 컬럼변경 |
| 27 | PT_Cash_Receipt | 현금영수증 | 신규생성 |
| 28 | PT_Tax_invoice | 세금계산서 | 신규생성 |
| 29 | PT_Deposit | 입금 | 신규생성 |
| 30 | PT_Deposit_History | 입금 이력 | 신규생성 |
| 31 | PT_UnknownDeposit | 미확인 입금 | 컬럼변경 |
| 32 | PT_UnknownRefund | 미확인 환불 | 컬럼변경 |
| 33 | PT_DEFERINCOME_INFO | 선수수익 정보 | 신규생성 |
| 34 | PT_DEFERINCOME_MST | 선수수익 마스터 | 신규생성 |
| 35 | PT_DEFERINCOME_MST_TEMP | 선수수익 임시 | 신규생성 |
| 36 | PT_DEFERINCOME_STAT | 선수수익 통계 | 신규생성 |

**발송/물류**

| No | 테이블명 | 용도 | 비고 |
|----|----------|------|------|
| 37 | PT_RegularSend_Info | 정기 발송 정보 | 신규생성 |
| 38 | PT_SendHistory | 발송 이력 | 신규생성 |
| 39 | PT_SendProc_ERR | 발송 오류 | 신규생성 |
| 40 | PT_SendDMDataLog | DM 발송 로그 | 신규생성 |
| 41 | PT_SendDMDataLog_SEQ | DM 발송 시퀀스 | 신규생성 |
| 42 | PT_SendDMDataMushLog | DM 발송 머시 로그 | 2016년 추가 |
| 43 | PT_SendDMDataTempTable | DM 발송 임시 | 2017년 추가 |
| 44 | PT_BookResend | 도서 재발송 | 컬럼변경 |
| 45 | PT_BookReturned | 도서 반품 | 컬럼변경 |
| 46 | PT_Bundle | 묶음 발송 | 컬럼변경 |

**상담/CS/기부**

| No | 테이블명 | 용도 | 비고 |
|----|----------|------|------|
| 47 | PT_Councel_History | 상담 이력 | Customer_ID FK |
| 48 | PT_SalesCancel | 판매 취소 | 컬럼변경 |
| 49 | PT_RefundRequest | 환불 요청 | 2019년 추가 |
| 50 | PT_Promise | 약속 | 컬럼변경 |
| 51 | PT_Dawn_Sunbeam_Donation | 새벽햇살 기부 | 신규생성 |

**코드/그룹/관리**

| No | 테이블명 | 용도 | 비고 |
|----|----------|------|------|
| 52 | PT_CodeMaster | 코드 마스터 | 컬럼변경 |
| 53 | PT_CodeDetail | 코드 상세 | 컬럼변경 |
| 54 | PT_Group | 그룹 | 신규생성 |
| 55 | PT_Group_History | 그룹 이력 | 신규생성 |
| 56 | PT_Company_File | 거래처 파일 | 신규생성 |
| 57 | PT_Company_History | 거래처 이력 | 신규생성 |
| 58 | PT_Nation | 국가 | 컬럼변경 |
| 59 | PT_Temp_Nation | 임시 국가 | 2023년 추가 |
| 60 | PT_Item | 항목 | 신규생성 |

**SMS/알림**

| No | 테이블명 | 용도 | 비고 |
|----|----------|------|------|
| 61 | PT_SMSText | SMS 문구 | 2017년 추가 |
| 62 | PT_SMSHistory | SMS 이력 | 2017년 추가 |

**프로그램/모니터링**

| No | 테이블명 | 용도 | 비고 |
|----|----------|------|------|
| 63 | PT_MgtProgram | 관리 프로그램 | 신규생성 |
| 64 | PT_MgtProgramBtn | 프로그램 버튼 | 신규생성 |
| 65 | PT_DataMonitoringLog | 데이터 모니터링 로그 | 2021년 추가 |
| 66 | PT_LogLockKill | 잠금 해제 로그 | 2016년 추가 |

**웹포인트/쿠폰**

| No | 테이블명 | 용도 | 비고 |
|----|----------|------|------|
| 67 | PT_WebPointData | 웹 포인트 | 기존유지 |
| 68 | PT_Coupon | 쿠폰 | 기존유지 |
| 69 | PT_D060P | 쿠폰 관련 | 기존유지 |
| 70 | PT_D060PW | 쿠폰 관련 | 기존유지 |

**레거시/보고/임시**

| No | 테이블명 | 용도 | 비고 |
|----|----------|------|------|
| 71 | PT_Admin07 | 관리자 (레거시) | 기존유지 |
| 72 | PT_Admin07_sq | 관리자 시퀀스 | 기존유지 |
| 73 | PT_Temp_Report_01 | 임시 보고서 1 | 신규생성 |
| 74 | PT_Temp_Report_02 | 임시 보고서 2 | 2018년 추가 |
| 75 | PT_Temp_Report_03 | 임시 보고서 3 | 2019년 추가 |

#### CMS DB (13 tables)

| No | 테이블명 | 용도 | 비고 |
|----|----------|------|------|
| 76 | ptcms_contents | 콘텐츠 원고 (33 cols) | 핵심 |
| 77 | ptcms_copyright | 저작권 정보 | |
| 78 | ptcms_econtents | 전자 콘텐츠 | |
| 79 | ptcms_image | 이미지 | |
| 80 | ptcms_keyword_log | 키워드 로그 | |
| 81 | ptcms_keyword_sum | 키워드 집계 | |
| 82 | ptcms_member | CMS 회원 | |
| 83 | ptcms_member_log | 회원 로그 | |
| 84 | ptcms_subject | 코너/주제 | |
| 85 | ptcms_subject_ext | 코너 확장 | |
| 86 | ptcms_writer | 필자 정보 | |
| 87 | ptcms_books | 도서 | |
| 88 | ptcms_books_loan | 도서 대출 | |

#### 홈페이지 DB (63 tables)

**상품/카테고리**

| No | 테이블명 | 용도 | 비고 |
|----|----------|------|------|
| 89 | PTM_Products | 상품 마스터 | 핵심 |
| 90 | PTM_ProductCategories | 상품 카테고리 | |
| 91 | PTM_ProductImages | 상품 이미지 | |
| 92 | PTM_ProductOptions | 상품 옵션 | |
| 93 | PTM_ProductOptionStockLogs | 옵션 재고 로그 | |
| 94 | PTM_ProductTags | 상품 태그 | |
| 95 | PTM_ProductGifts | 상품 사은품 | |
| 96 | PTM_ProductSoldOuts | 품절 관리 | |
| 97 | PTM_ProductGroups | 상품 그룹 | |
| 98 | PTM_ProductGroupImages | 그룹 이미지 | |
| 99 | PTM_ProductDeliveryDates | 배송일 설정 | |
| 100 | PTM_Categories | 카테고리 | |
| 101 | PTM_Goods_Categories | 상품-카테고리 매핑 | |
| 102 | PTM_Goods_Category_Items | 카테고리 항목 | |
| 103 | PTM_GoodsIntroduces | 상품 소개 | |
| 104 | PTM_Tags | 태그 마스터 | |

**주문/결제**

| No | 테이블명 | 용도 | 비고 |
|----|----------|------|------|
| 105 | PTM_Orders | 주문 마스터 | 핵심 |
| 106 | PTM_Order_Items | 주문 항목 | |
| 107 | PTM_CartItems | 장바구니 | |
| 108 | PTM_CartItemLogs | 장바구니 로그 | |
| 109 | PTM_PaymentLogs | 결제 로그 | |
| 110 | PTM_Payment_Infos | 결제 정보 | |
| 111 | PTM_VbankItems | 가상계좌 항목 | |
| 112 | PTM_OrderSessionInfos | 주문 세션 | |
| 113 | PTM_OrderItemRegLogs | 주문항목 등록 로그 | |
| 114 | PTM_DeliveryFees | 배송비 | |
| 115 | PTM_DeliveryFees_CJ | CJ대한통운 배송비 | |
| 116 | PTM_ShippingInfos | 배송 정보 | |

**정기구독**

| No | 테이블명 | 용도 | 비고 |
|----|----------|------|------|
| 117 | PTM_Regular_Orders | 정기구독 주문 | 핵심 |
| 118 | PTM_RegularProducts | 정기구독 상품 | |
| 119 | PTM_Regulars | 정기구독 마스터 | |

**선물/이벤트/쿠폰**

| No | 테이블명 | 용도 | 비고 |
|----|----------|------|------|
| 120 | PTM_GiftItems | 선물 항목 | |
| 121 | PTM_GiftOrders | 선물 주문 | |
| 122 | PTM_GiftOrder_Items | 선물 주문 항목 | |
| 123 | PTM_GiftProducts | 선물 상품 | |
| 124 | PTM_Coupons | 쿠폰 | |
| 125 | PTM_Coupon_Meta | 쿠폰 메타 | |
| 126 | PTM_Coupon_Hists | 쿠폰 이력 | |
| 127 | PTM_Coupon_Products | 쿠폰-상품 매핑 | |
| 128 | PTM_Events | 이벤트 | |

**콘텐츠/블로그/배너**

| No | 테이블명 | 용도 | 비고 |
|----|----------|------|------|
| 129 | PTM_Blogs | 블로그 | |
| 130 | PTM_Blog_Categories | 블로그 카테고리 | |
| 131 | PTM_Blog_Comments | 블로그 댓글 | |
| 132 | PTM_Wallpapers | 배경화면 | |
| 133 | PTM_Wallpaper_Comments | 배경화면 댓글 | |
| 134 | PTM_Main_Wallpapers | 메인 배경화면 | |
| 135 | PTM_MainPages | 메인 페이지 | |
| 136 | PTM_MainBanners | 메인 배너 | |
| 137 | PTM_Main_Notices | 메인 공지 | |
| 138 | PTM_Main_Boards | 메인 게시판 | |
| 139 | PTM_MainSNS_Contents | SNS 콘텐츠 | |
| 140 | PTM_Collect_Banners | 수집 배너 | |
| 141 | PTM_SunshineManagements | 새벽햇살 관리 | |
| 142 | PTM_NewsLetters | 뉴스레터 | |
| 143 | PTM_VCardInfos | V카드 정보 | |

**시스템/로그/인증**

| No | 테이블명 | 용도 | 비고 |
|----|----------|------|------|
| 144 | PTM_Visitors | 방문자 | |
| 145 | PTM_VerifyCodes | 인증 코드 | |
| 146 | PTM_Notifications | 알림 | |
| 147 | PTM_ApiErrorLogs | API 에러 로그 | |
| 148 | PTM_ServerErrorLogs | 서버 에러 로그 | |
| 149 | PTM_Options | 옵션 설정 | 삭제 예정 |
| 150 | PTM_Qnas | Q&A | 삭제 예정 |
| 151 | PTM_Tests | 테스트 | 삭제 예정 |

### 주요 비즈니스 로직

> C/S 고객관리 DB에 집중된 비즈니스 로직. 홈페이지 DB는 7개 프로시저만 존재.

#### Stored Procedures (C/S — 20개)

| No | SP명 | 기능 | 비고 |
|----|------|------|------|
| 1 | sp_PT_SendBookData | 도서 발송 처리 | 핵심 배송 로직 |
| 2 | sp_PT_DataMonitoring | 데이터 모니터링 | 데이터 정합성 체크 |
| 3 | sp_PT_GiroCreate | 지로 생성 | 지로 결제 연동 |
| 4 | sp_PT_GiroUpdate | 지로 수정 | |
| 5 | sp_PT_GiroDelete | 지로 삭제 | |
| 6 | sp_PT_GiroSend | 지로 발송 | |
| 7 | sp_PT_GiroRecv | 지로 수납 | |
| 8 | sp_PT_GiroCancel | 지로 취소 | |
| 9 | sp_PT_CouponCreate | 쿠폰 생성 | |
| 10 | sp_PT_CouponUse | 쿠폰 사용 처리 | |
| 11 | sp_PT_SubscribeCreate | 구독 접수 | 핵심 구독 로직 |
| 12 | sp_PT_SubscribeCancel | 구독 취소 | |
| 13 | sp_PT_FinanceCreate | 입금 등록 | 결제 처리 |
| 14 | sp_PT_FinanceRefund | 환불 처리 | |
| 15 | sp_PT_CustomerMerge | 고객 병합 | 중복 고객 통합 |
| 16 | sp_PT_ReceiverUpdate | 받는사람 변경 | 배송지 관리 |
| 17 | sp_PT_StockUpdate | 재고 업데이트 | |
| 18 | sp_PT_DeferIncomeCalc | 선수수익 산출 | 회계 정산 |
| 19 | sp_PT_SendDMData | DM 발송 데이터 | 우편 발송 |
| 20 | sp_PT_NicepayProcess | 나이스페이 결제 처리 | PG 연동 |

#### Functions (C/S — 14개)

| No | Function명 | 기능 | 비고 |
|----|------------|------|------|
| 1 | func_dailySendCount | 일일 발송 건수 | 일일실적 집계 |
| 2 | func_dailySendAmount | 일일 발송 금액 | |
| 3 | func_dailySendBook | 일일 도서 발송 | |
| 4 | func_sendBookCount | 발송 호 계산 (건수) | 발송 회차 관리 |
| 5 | func_sendBookAmount | 발송 호 계산 (금액) | |
| 6 | func_sendBookNo | 발송 호수 산출 | |
| 7 | func_GetNumeric | 전화번호 숫자 추출 | CTI 연동 지원 |
| 8 | func_GetCustomerByTel | 전화번호로 고객 조회 | CTI 팝업용 |
| 9 | func_CalcSubscribePeriod | 구독 기간 계산 | |
| 10 | func_CalcDeferIncome | 선수수익 계산 | 회계 연동 |
| 11 | func_GetReceiverCount | 받는사람 수 조회 | |
| 12 | func_GetFinanceSum | 입금 합계 조회 | |
| 13 | func_CheckDuplicate | 중복 체크 | |
| 14 | func_FormatDate | 날짜 형식 변환 | |

#### Triggers (C/S — 15개)

| No | Trigger명 | 대상 테이블 | 기능 | 비고 |
|----|-----------|------------|------|------|
| 1 | trg_Subscribe_Giro_Insert | PT_Subscribe | 구독 접수 시 지로 자동 생성 | 구독→지로 연동 |
| 2 | trg_Subscribe_Giro_Update | PT_Subscribe | 구독 변경 시 지로 갱신 | |
| 3 | trg_Subscribe_Giro_Delete | PT_Subscribe | 구독 삭제 시 지로 삭제 | |
| 4 | trg_Subscribe_Count_Insert | PT_Subscribe | 구독 등록 시 카운트 증가 | 구독 카운트 |
| 5 | trg_Subscribe_Count_Delete | PT_Subscribe | 구독 삭제 시 카운트 감소 | |
| 6 | trg_GiftSend_Stock_Insert | PT_GiftSend | 선물 발송 시 재고 차감 | 선물→재고 |
| 7 | trg_GiftSend_Stock_Update | PT_GiftSend | 선물 변경 시 재고 조정 | |
| 8 | trg_GiftSend_Stock_Delete | PT_GiftSend | 선물 취소 시 재고 복원 | |
| 9 | trg_Customer_Tel_Index | PT_Customer | 전화번호 변경 시 인덱스 갱신 | CTI 검색 최적화 |
| 10 | trg_Company_Stock_Group_Ins | PT_Company | 거래처 등록 시 재고 그룹 생성 | 거래처→재고 |
| 11 | trg_Company_Stock_Group_Del | PT_Company | 거래처 삭제 시 재고 그룹 삭제 | |
| 12 | trg_Finance_DeferIncome | PT_Finance | 입금 시 선수수익 자동 반영 | 회계 연동 |
| 13 | trg_Receiver_SendHistory | PT_Receiver | 받는사람 변경 시 발송이력 갱신 | |
| 14 | trg_Book_Price_Update | PT_Book | 도서 변경 시 가격 연동 | |
| 15 | trg_Deposit_Finance_Sync | PT_Deposit | 입금 등록 시 Finance 동기화 | |

#### Stored Procedures (홈페이지 — 7개)

| No | SP명 | 기능 | 비고 |
|----|------|------|------|
| 1 | PRU_GoodsOrderItemReg | 주문 항목 등록 | 핵심 주문 처리 |
| 2 | PRU_GoodsStockReturn | 상품 재고 복원 | 취소/반품 시 |
| 3 | PRU_MMS_Send | MMS 발송 | 알림 발송 |
| 4 | PRU_VbankDueDateAlert | 가상계좌 입금기한 알림 | |
| 5 | PRU_CartItemsWeeksDelete | 장바구니 주간 정리 | 자동 배치 |
| 6 | PRU_PaymentLogMidUpdate | 결제로그 MID 갱신 | |
| 7 | PRU_BIZ_AT_Send | 알림톡 발송 | 카카오 알림톡 |

---

## 시스템 구조적 문제점

### 핵심 문제: 시스템 이원화

```
┌─────────────────────────────────────────────────────────────────┐
│                        현재 문제 상황                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐                    ┌─────────────┐           │
│   │  웹 시스템   │    ✗ 연동 없음     │  C/S 시스템  │           │
│   │(AWS/MSSQL) │◄─────────────────►│(로컬/MSSQL) │           │
│   └─────────────┘                    └─────────────┘           │
│                                                                 │
│   • CMS 콘텐츠 관리                  • 고객 데이터 관리          │
│   • 홈페이지 운영                    • 주문/구독 처리            │
│   • 사용자 인증                      • CS 업무 처리              │
│                                                                 │
│   ⚠️ 고객 데이터 공유 불가 → 수작업 이중 관리 발생              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 기술적 문제

| 문제 | 상세 내용 | 영향 | 심각도 |
|------|-----------|------|:------:|
| **C/S 아키텍처** | Java/XPlatform 기반 로컬 설치형 (IE/Edge IE모드 필수) | 원격 근무 불가, 웹 연동 제한 | 🔴 |
| **DB 이원화** | MSSQL(C/S, 사내) + MSSQL(웹, AWS) 동일 DBMS이나 물리적 분리 | 실시간 데이터 공유 불가, 수동 Excel 이관 | 🔴 |
| **수동 데이터 연동** | Playauto → CS System 수동 다운로드/업로드 | 처리 지연, 오류 가능성 | 🔴 |
| **이카운트 ERP 이중 입력** | CS System과 이카운트 양쪽에 수동 이중 입력 | 데이터 불일치, 업무 비효율 | 🔴 |
| **레거시 기술 스택** | XPlatform (Tobesoft, 단종 위험) | 유지보수 인력 확보 어려움 | 🟠 |
| **CTI 레거시 의존** | 서울정보시스템 CTI — C/S 시스템에 강결합 | 웹 전환 시 CTI 재연동 필요 | 🟠 |
| **하드코딩된 로직** | 비즈니스 로직이 XPlatform 코드에 내장 (20 SP + 15 Trigger 외) | 변경 시 개발 필요, 이관 난이도 상승 | 🟠 |
| **VPN 보안 취약** | MikroTik PPTP VPN (보안 취약 프로토콜) | 외부 접속 보안 위험 | 🟠 |
| **문서화 부재** | 시스템 명세서/API 문서 없음 | 시스템 이해/이관 어려움 | 🟠 |

### 데이터 문제

| 문제 | 상세 내용 | 영향 | 심각도 |
|------|-----------|------|:------:|
| **고객 데이터 분리** | 웹 회원 ↔ CS 고객 데이터 불일치 | 통합 고객 뷰 불가 | 🔴 |
| **주문 채널별 분산** | 네이버/쿠팡 등 채널별 개별 관리 | 통합 분석 어려움 | 🔴 |
| **CMS 권한 수동 처리** | 구독 결제 → 권한 부여 수작업 | 처리 지연, 누락 발생 | 🟠 |
| **데이터 정합성** | 동일 고객 중복 등록 가능 | 데이터 품질 저하 | 🟠 |

### 운영 문제

| 문제 | 상세 내용 | 영향 | 심각도 |
|------|-----------|------|:------:|
| **로컬 PC 의존** | CS 시스템이 특정 PC에 설치 | 장애 시 업무 중단 | 🔴 |
| **수작업 프로세스** | 주문→입력→권한부여 수동 처리 | 인력 낭비, 오류 발생 | 🔴 |
| **실시간 현황 파악 불가** | 데이터 분리로 통합 대시보드 불가 | 의사결정 지연 | 🟠 |

---

## TO-BE 개선 방향

### 목표 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           AWS Cloud (통합 시스템)                                │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                           │  │
│  │   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐              │  │
│  │   │     CMS     │◄────►│   통합      │◄────►│  Homepage   │              │  │
│  │   │ (콘텐츠관리) │      │   Admin     │      │   (SPA)     │              │  │
│  │   └─────────────┘      │  (Web)      │      └─────────────┘              │  │
│  │                        └──────┬──────┘                                    │  │
│  │                               │                                           │  │
│  │                               ▼                                           │  │
│  │                        ┌─────────────┐                                    │  │
│  │                        │   통합 DB   │                                    │  │
│  │                        │  (단일 DB)  │                                    │  │
│  │                        └──────┬──────┘                                    │  │
│  │                               │                                           │  │
│  │         ┌─────────────────────┼─────────────────────┐                     │  │
│  │         ▼                     ▼                     ▼                     │  │
│  │   ┌───────────┐        ┌───────────┐        ┌───────────┐                │  │
│  │   │  채널 API  │        │  결제 API  │        │  CMS API   │                │  │
│  │   │  연동      │        │  연동      │        │  연동      │                │  │
│  │   └───────────┘        └───────────┘        └───────────┘                │  │
│  │                                                                           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
        ▲                           ▲                           ▲
        │ 자동 수집                  │ 결제 연동                  │ 권한 자동 부여
        │                           │                           │
   ┌────┴────┐                ┌────┴────┐                 ┌────┴────┐
   │외부 채널 │                │결제 시스템│                 │  CMS    │
   │(네이버등)│                │(PG사)   │                 │         │
   └─────────┘                └─────────┘                 └─────────┘
```

### 주요 개선 포인트

| AS-IS | TO-BE | 기대 효과 |
|-------|-------|----------|
| C/S 로컬 설치형 (XPlatform) | 웹 기반 Admin | 어디서나 접속 가능 |
| DB 물리적 이원화 (사내 MSSQL + AWS MSSQL) | 통합 DB (단일 MSSQL) | 실시간 데이터 공유 |
| Playauto 수동 연동 | API 자동 수집 | 실시간 주문 처리 |
| CMS 권한 수동 부여 | 자동 권한 부여 | 처리 시간 단축 |
| 분산된 고객 데이터 | 통합 고객 뷰 | 360° 고객 관리 |
| 이카운트 ERP 이중 입력 | ERP API 연동 | 이중 입력 제거 |
| CTI C/S 강결합 | 웹 기반 CTI 연동 | 유연한 CS 운영 |

> 상세 설계는 [목표 모델 설계 (TO-BE Design)](/goodthinking-isp/03-design/) 섹션 참조

---

## 분석 진행 기록

### 체크리스트

- [ ] Tobesoft 프로그램 소스 접근 권한 확보
- [ ] MSSQL 접속 정보 확보 (VPN 접근 필요)
- [ ] DB 스키마 덤프 완료
- [x] 테이블별 용도 파악 완료 (문서 기반 — 151 tables 분류)
- [x] 주요 Stored Procedure 분석 완료 (문서 기반 — 20 SPs, 14 Functions, 15 Triggers)
- [x] ERD 작성 완료 (문서 기반 — 핵심 엔티티 관계도)
- [x] AS-IS 아키텍처 다이어그램 작성 완료
- [x] 시스템 구성 요소 정리 완료
- [ ] 레코드 수 파악 (라이브 DB 접근 필요)
- [ ] 비즈니스 로직 코드 레벨 검증 (소스 접근 필요)

### 작성 이력

| 날짜 | 작성자 | 변경 내용 |
|------|--------|----------|
| 2026-02-23 | - | 초안 작성 |
| 2026-03-03 | ISP 컨설턴트 | AS-IS 아키텍처 다이어그램 (AWS/On-Premise/외부 전체 구성), 시스템 구성 요소 17건 상세화, 인프라 상세 추가, 데이터 흐름 다이어그램 재작성, AS-IS ERD (PT_Customer 허브 기반 엔티티 관계도), 테이블 목록 151건 전수 정리 (C/S 75 + CMS 13 + 홈페이지 63), 비즈니스 로직 상세화 (20 SP + 14 Function + 15 Trigger + 홈페이지 7 SP), 기술적 문제 보강 (이카운트 ERP 이중입력, CTI 의존성, VPN 보안 추가), MySQL→MSSQL 오류 수정 (홈페이지 DB도 MSSQL 확인), 체크리스트 갱신 |
