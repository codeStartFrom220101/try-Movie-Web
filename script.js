const searchForm = document.querySelector('.search');
const searchBtn = document.querySelector('.searchBtn');
const searchInput = document.querySelector('.searchTerm');

// 监听 searchBtn 的点击事件，切换 active 类
searchBtn.addEventListener('click', () => {
    searchForm.classList.toggle('active'); // 切换 active 类
});

// 监听文档的点击事件
document.addEventListener('click', (event) => {
    // 如果点击的不是 .search 或其中的元素
    if (!searchForm.contains(event.target)) {
        searchForm.classList.remove('active'); // 移除 active 类
    }
});

// 防止点击 input 时触发移除 active 的操作
searchInput.addEventListener('click', (event) => {
    event.stopPropagation(); // 阻止事件冒泡
});


let currentIndex = 0;
const slides = document.querySelectorAll('.slider-item');
const totalSlides = slides.length;
const sliderTrack = document.querySelector('.slider-track');



// 切换到下一张
document.querySelector('.next-btn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
});

// 切换到上一张
document.querySelector('.prev-btn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
});

// 更新轮播位置
function updateSlider() {
    const offset = -100 * currentIndex; // 每个轮播项宽度为 100vw
    sliderTrack.style.transform = `translateX(${offset}vw)`;
}

const apiKey = "d0971917ed87f0e2070a34523ce6a2fc";
const movieRow = document.querySelector('.movie-row');
const nextBtn = document.querySelector('.next-btn');

// 获取流行电影数据
async function fetchTopMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=1&per_page=30`);
    const data = await response.json();
    const movies = data.results;
    console.log(movies);
    
    renderMovies(movies);
}

// 渲染电影信息到页面
function renderMovies(movies) {
    movieRow.innerHTML = ''; // 清空当前内容

    movies.forEach((movie, index) => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-item');

        movieElement.innerHTML = `
            <div class="movie-rank-block">
                <div class="movie-rank">${index + 1}</div>
            </div>
            <div class="img-block">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <div class="movie-info">最新上映</div>
            </div>
        `;

        movieRow.appendChild(movieElement);
    });
}

// 初始化
fetchTopMovies();

// 实现右侧滚动按钮功能
nextBtn.addEventListener('click', () => {
    movieRow.scrollBy({
        left: 300, // 每次点击向右滚动300px
        behavior: 'smooth'
    });
});
