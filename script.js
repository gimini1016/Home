const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".nav");

const closeMenu = () => {
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "메뉴 열기");
  document.body.style.overflow = "";
};

menuButton.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.setAttribute("aria-label", willOpen ? "메뉴 닫기" : "메뉴 열기");
  navigation.classList.toggle("open", willOpen);
  document.body.style.overflow = willOpen ? "hidden" : "";
});

navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
  observer.observe(element);
});

const API_BASE_URL = "http://localhost:8000";
const songsLoading = document.querySelector("#songs-loading");
const songsError = document.querySelector("#songs-error");
const topSongs = document.querySelector("#top-songs");
const insightLoading = document.querySelector("#insight-loading");
const insightError = document.querySelector("#insight-error");
const chartInsight = document.querySelector("#chart-insight");

const fetchJson = async (path) => {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  return response.json();
};

const loadTopSongs = async () => {
  try {
    const songs = await fetchJson("/songs/top10");

    if (!Array.isArray(songs) || songs.length === 0) {
      throw new Error("차트 데이터가 비어 있습니다.");
    }

    const songItems = document.createDocumentFragment();

    songs.forEach((song) => {
      const item = document.createElement("li");
      const rank = document.createElement("span");
      const songInfo = document.createElement("div");
      const title = document.createElement("strong");
      const artist = document.createElement("span");

      rank.className = "song-rank";
      songInfo.className = "song-info";
      rank.textContent = String(song["순위"]).padStart(2, "0");
      title.textContent = song["곡명"];
      artist.textContent = song["가수"];

      songInfo.append(title, artist);
      item.append(rank, songInfo);
      songItems.append(item);
    });

    topSongs.replaceChildren(songItems);
    topSongs.hidden = false;
  } catch (error) {
    console.error(error);
    songsError.hidden = false;
  } finally {
    songsLoading.hidden = true;
  }
};

const loadInsight = async () => {
  try {
    const data = await fetchJson("/insight");

    if (typeof data.insight !== "string" || data.insight.trim() === "") {
      throw new Error("인사이트 데이터가 비어 있습니다.");
    }

    chartInsight.textContent = data.insight;
    chartInsight.hidden = false;
  } catch (error) {
    console.error(error);
    insightError.hidden = false;
  } finally {
    insightLoading.hidden = true;
  }
};

Promise.allSettled([loadTopSongs(), loadInsight()]);
