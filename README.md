# Melon Top 100 FastAPI

`melon_top100.csv`의 순위, 곡명, 가수 정보를 JSON으로 제공하는 FastAPI 서버입니다.

## 실행

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

서버 실행 후 아래 주소를 사용할 수 있습니다.

- 전체 곡: <http://127.0.0.1:8000/songs>
- 상위 10곡: <http://127.0.0.1:8000/songs/top10>
- 가수별 곡 수: <http://127.0.0.1:8000/artists>
- 오늘의 차트 한 줄 평: <http://127.0.0.1:8000/insight>
- 자동 API 문서: <http://127.0.0.1:8000/docs>

`index.html`은 JavaScript `fetch`로 `/songs/top10`과 `/insight`를 불러옵니다.
API 서버가 실행 중인 상태에서 `index.html`을 브라우저로 열면 실시간 차트 영역을 확인할 수 있습니다.

별도 터미널에서 아래 명령을 실행하면 홈페이지도 로컬 주소로 열 수 있습니다.

```bash
python3 -m http.server 5500
```

홈페이지: <http://localhost:5500>
