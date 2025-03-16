const API_KEY = "d0971917ed87f0e2070a34523ce6a2fc";
const TMDB_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;


const movieList = document.querySelector(".movie-list");
const search = document.querySelector(".search");
const searchBtn = document.querySelector(".searchBtn");
const searchTerm = document.querySelector(".searchTerm");
const sidebarBtn = document.querySelector(".sidebarBtn");
const topbar = document.querySelector(".topbar");
const sidebar = document.querySelector(".sidebar");
const getMoreBtn = movieList.querySelector(".get-more-btn");
const popupClose = document.querySelector(".popup-close");
const popupContainer = document.querySelector(".popup-container");
const popup = document.querySelector(".popup");
const movieDetails = document.querySelector(".movie-details-container");
const trailerBtn = document.querySelector(".trailer-btn");
const trailerContainer = document.querySelector(".trailer-container");

let sidebarMove = "off";
let searchBy = "popular";
let page = 1;

// 取得 TMDB 資料
async function getTMDBData(url) {
    const resp = await fetch(url);
    const respData = await resp.json();
    console.log(respData.results);
    
    showMovies(respData.results);
}

// 透過 ID 取得 TMDB 資料
async function getTMDBDataById(url) {
    const resp = await fetch(url);
    return await resp.json();
}

// 取得電影翻譯
async function getTranslation(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}/translations?api_key=${API_KEY}`;
    const movie = await getTMDBDataById(url);
    const movieTW = movie.translations.filter((m) => {
        m.iso_3166_1 === "TW"
        console.log(m);
    });
    return movieTW.length ? movieTW[0].data.title : "";
}

// 顯示電影清單
function showMovies(movies) {
    movies.forEach(({ poster_path, title, vote_average, id }) => {
        const img = IMG_PATH + poster_path;
        const movieEl = document.createElement("li");
        movieEl.dataset.id = id;
        movieEl.innerHTML = `
            <img src="${img}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
        `;
        movieList.appendChild(movieEl);
    });

    if (searchBy !== "search") {
        movieList.appendChild(getMoreBtn);
    }
}

// 加載更多電影
getMoreBtn.addEventListener("click", () => {
    page++;
    const url = `https://api.themoviedb.org/3/movie/${searchBy}?api_key=${API_KEY}&language=en-US&page=${page}`;
    getTMDBData(url);
});

// 根據評分設置顏色
function getClassByRate(score) {
    return score >= 8 ? "green" : score >= 6 ? "blue" : "red";
}

// 搜索電影
search.addEventListener("submit", searchMovies);
searchBtn.addEventListener("click", searchMovies);

function searchMovies(e) {
    e.preventDefault();
    searchBy = "search";
    movieList.innerHTML = "";
    const term = searchTerm.value;
    if (term) {
        getTMDBData(SEARCH_API + term + "language=zh-TW");
        searchTerm.value = "";
    }
}

// 側邊欄切換
sidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    sidebarBtn.classList.toggle("active");
    sidebarMove = sidebarMove === "off" ? "on" : "off";
});

// 滾動時自動關閉側邊欄
document.addEventListener("scroll", () => {
    if (sidebarMove === "on") {
        sidebar.classList.remove("active");
        sidebarBtn.classList.remove("active");
    }
});

// 篩選電影類型
topbar.addEventListener("click", barSearchBy);
sidebar.addEventListener("click", barSearchBy);

async function barSearchBy(e) {
    if (e.target.nodeName !== "LI") return;
    page = 1;
    movieList.innerHTML = "";
    searchBy = e.target.closest("li").dataset.search;
    getTMDBData(`https://api.themoviedb.org/3/movie/${searchBy}?api_key=${API_KEY}&language=en-US&page=1`);
}

// 關閉彈出視窗
popupClose.addEventListener("click", () => {
    popupContainer.classList.add("hidden");
    movieDetails.innerHTML = "";
});

// 點擊電影顯示詳細資訊
movieList.addEventListener("click", (e) => {
    if (e.target.nodeName !== "IMG") return;
    showPopup(e.target.closest("li").dataset.id);
});

// 顯示電影詳細資訊
async function showPopup(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits`;
    const { poster_path, backdrop_path, title, overview, genres, credits, vote_average, vote_count } = await getTMDBDataById(url);

    popupContainer.classList.remove("hidden");
    movieDetails.innerHTML = `
        <div class="img" style="background-image:linear-gradient(to bottom, rgba(0,0,0,0), #22254b), url('${IMG_PATH + backdrop_path}');"></div>
        <div class="movie-details">
            <div class="movie-details-header">
                <img src="${IMG_PATH + poster_path}" alt="${title}">
                <div class="movie-title">
                    <div class="movie-point">
                        <div class="point">${vote_average}</div>
                        <div><div class="star"><i class="${getStar(vote_average)}"></i></div><div class="vote-count">${vote_count}</div></div>
                    </div>
                    <div class="name-genres"><h3>${title}</h3><div class="genres">${getGenre(genres)}</div></div>
                </div>
            </div>
            <div class="movie-details-body">
                <div class="overview"><p>${overview}</p></div>
                <div class="cast"><h4>CAST</h4><ul class="actor">${getCast(credits.cast)}</ul></div>
                <div class="recommendations"><h4>You Might Also Like</h4><ul class="recommendations-movie">${await getRecommendations(id)}</ul></div>
            </div>
        </div>
    `;
}

// 取得推薦電影
async function getRecommendations(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`;
    const { results } = await getTMDBDataById(url);

    return results.map(({ poster_path, title, id, vote_average }) => `
        <li>
            <img src="${IMG_PATH + (poster_path ? poster_path : "/vQs0SFbMAZsvDF3aGtrVtDRmrl2.jpg")}" alt="${title}" data-id="${id}">
            <div class="movie-info"><h3>${title}</h3><span class="${getClassByRate(vote_average)}">${vote_average}</span></div>
        </li>
    `).join("");
}

// 取得電影類型
function getGenre(genres) {
    return genres.map((genre) => `<span>${genre.name}</span>`).join("");
}

// 取得演員資訊
function getCast(cast) {
    return cast.map(({ profile_path, name }) => `
        <li>
            <img src="${IMG_PATH + (profile_path ? profile_path : "/vQs0SFbMAZsvDF3aGtrVtDRmrl2.jpg")}" alt="${name}">
            <h5>${name.split(" ")[0]}<br>${name.split(" ")[1] || ""}</h5>
        </li>
    `).join("");
}




// star rated
function getStar(point) {
    let star = Math.floor(point) / 2
    let firstNum = Math.floor(star);
    let secondNum = star * 10 % 10;
    
    return `show_rated_${firstNum}${secondNum == 0 ? "" : `_${secondNum}`}`;
}