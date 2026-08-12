# 한입안심 Next.js

기존 Streamlit MVP의 메뉴 데이터와 추천 기준을 재사용해 만든 Vercel용 웹 애플리케이션입니다.

## 포함 기능

- 알레르기, 브랜드, 칼로리, 단백질, 나트륨 필터
- 성별·나이·키·체중·목표를 반영한 추천 정렬
- PC·모바일을 분리한 반응형 브랜드 폴더
- 메뉴 검색 및 클릭 애니메이션
- 수량 조절과 영양 합산이 가능한 ‘나의 한 끼’
- 브랜드별 선택 가능 메뉴 차트
- 카카오 장소 자동완성, 현재 위치, 반경별 주변 매장 지도
- ‘나의 한 끼’ 브라우저 저장
- 비밀번호와 서명 세션으로 보호되는 관리자 페이지
- 가격 직접 등록·수정·삭제, CSV 일괄 업로드 및 내려받기
- 관리자 확인 가격의 메뉴·장바구니·브랜드 비교 반영

## 로컬 실행

```bash
cd vercel-app
cp .env.example .env.local
npm install
npm run dev
```

`.env.local`에 다음 값을 입력합니다.

```dotenv
KAKAO_REST_API_KEY=카카오_REST_API_키
NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY=카카오_JavaScript_키
ADMIN_PASSWORD=충분히_긴_관리자_비밀번호
ADMIN_SESSION_SECRET=32자_이상의_무작위_문자열
SUPABASE_URL=https://프로젝트.supabase.co
SUPABASE_SECRET_KEY=Supabase_sb_secret_키
```

카카오 개발자 콘솔의 JavaScript SDK 도메인에 로컬 주소와 실제 Vercel 주소를 등록해야 합니다.

- `http://localhost:3000`
- `https://배포주소.vercel.app`

## Vercel 배포

1. GitHub 저장소를 Vercel에 연결합니다.
2. 프로젝트의 **Root Directory**를 `vercel-app`으로 지정합니다.
3. Framework Preset은 `Next.js`를 선택합니다.
4. Environment Variables에 `KAKAO_REST_API_KEY`, `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY`를 등록합니다.
5. 배포 후 생성된 도메인을 카카오 JavaScript SDK 도메인에도 추가합니다.

카카오 REST 키는 서버 API에서만 사용하고, JavaScript 키만 브라우저에 공개됩니다. `.env.local`은 Git에서 제외됩니다.

## 관리자와 가격 DB 설정

가격은 메뉴 CSV를 직접 수정하지 않고 Supabase의 `menu_prices` 테이블에 별도로 저장합니다.

1. Supabase 무료 프로젝트를 생성합니다.
2. Supabase SQL Editor에서 `supabase/schema.sql`을 실행합니다.
3. Project Settings에서 Project URL과 서버용 `Secret key`를 확인합니다.
4. Vercel에 `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY` 환경변수를 등록합니다.
5. 재배포 후 서비스 오른쪽 아래의 **관리자** 버튼으로 접속합니다.

`SUPABASE_SECRET_KEY`는 관리자 권한을 가진 비밀키이므로 브라우저 코드나 Git 저장소에 넣지 않습니다. 레거시 `service_role` 키는 `SUPABASE_SERVICE_ROLE_KEY` 환경변수로도 지원합니다.
