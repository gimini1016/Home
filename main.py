import csv
from collections import Counter
from functools import lru_cache
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


CSV_PATH = Path(__file__).with_name("melon_top100.csv")
REQUIRED_COLUMNS = {"순위", "곡명", "가수"}


class Song(BaseModel):
    순위: int
    곡명: str
    가수: str


class ChartInsight(BaseModel):
    insight: str


app = FastAPI(
    title="Melon Top 100 API",
    description="melon_top100.csv의 곡 정보를 제공하는 API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@lru_cache(maxsize=1)
def load_songs() -> tuple[Song, ...]:
    """CSV 파일을 읽어 순위순으로 정렬한 뒤 메모리에 캐시한다."""
    try:
        with CSV_PATH.open(encoding="utf-8-sig", newline="") as csv_file:
            reader = csv.DictReader(csv_file)

            if reader.fieldnames is None or not REQUIRED_COLUMNS.issubset(reader.fieldnames):
                raise ValueError("CSV에 '순위', '곡명', '가수' 열이 필요합니다.")

            songs = [
                Song(
                    순위=int(row["순위"]),
                    곡명=row["곡명"].strip(),
                    가수=row["가수"].strip(),
                )
                for row in reader
            ]
    except FileNotFoundError as exc:
        raise RuntimeError(f"CSV 파일을 찾을 수 없습니다: {CSV_PATH}") from exc
    except (KeyError, TypeError, ValueError) as exc:
        raise RuntimeError(f"CSV 파일 형식이 올바르지 않습니다: {exc}") from exc

    return tuple(sorted(songs, key=lambda song: song.순위))


def get_songs_or_500() -> tuple[Song, ...]:
    try:
        return load_songs()
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/songs", response_model=list[Song], summary="전체 곡 조회")
def get_songs() -> list[Song]:
    return list(get_songs_or_500())


@app.get("/songs/top10", response_model=list[Song], summary="상위 10곡 조회")
def get_top10_songs() -> list[Song]:
    return list(get_songs_or_500()[:10])


@app.get("/artists", response_model=dict[str, int], summary="가수별 곡 수 조회")
def get_artist_counts() -> dict[str, int]:
    counts = Counter(song.가수 for song in get_songs_or_500())
    return dict(sorted(counts.items()))


@app.get("/insight", response_model=ChartInsight, summary="오늘의 차트 한 줄 평")
def get_chart_insight() -> ChartInsight:
    top10 = get_songs_or_500()[:10]

    if not top10:
        return ChartInsight(insight="아직 차트에 등록된 곡이 없습니다.")

    counts = Counter(song.가수 for song in top10)
    highest_count = max(counts.values())

    if highest_count == 1:
        message = "오늘 TOP 10은 모든 곡의 가수가 달라 다채로운 차트를 보여주고 있어요."
    else:
        leading_artists = [artist for artist, count in counts.items() if count == highest_count]
        artist_names = ", ".join(leading_artists)
        message = f"오늘 TOP 10에서는 {artist_names}가 각각 {highest_count}곡으로 강세를 보이고 있어요."

    return ChartInsight(insight=message)
