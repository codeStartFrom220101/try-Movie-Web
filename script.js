$(document).ready(function () {
    const apiKey = "d0971917ed87f0e2070a34523ce6a2fc";
    const $movieRow = $('.movie-row');
    const $searchForm = $('.search');
    const $searchBtn = $('.searchBtn');
    const $searchInput = $('.searchTerm');
    let currentIndex = 0;

    // 监听 searchBtn 的点击事件，切换 active 类
    $searchBtn.on('click', function () {
        $searchForm.toggleClass('active');
    });

    // 监听文档的点击事件
    $(document).on('click', function (event) {
        if (!$searchForm.is(event.target) && !$searchForm.has(event.target).length) {
            $searchForm.removeClass('active');
        }
    });

    // 防止点击 input 时触发移除 active 的操作
    $searchInput.on('click', function (event) {
        event.stopPropagation();
    });

    // 获取流行电影数据
    async function fetchTopMovies() {
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=1&per_page=30`);
        const data = await response.json();
        const movies = data.results;

        renderMovies(movies);
    }

    // 渲染电影信息到页面
    function renderMovies(movies) {
        $movieRow.empty(); // 清空当前内容

        movies.forEach((movie, index) => {
            const movieElement = $(`
                <div class="movie-item">
                    <div class="movie-rank-block">
                        <svg width="250" height="300" viewBox="0 0 250 300" xmlns="http://www.w3.org/2000/svg">
                            <text x="50%" y="50%" font-family="'Noto Sans TC', sans-serif" font-size="300"
                                font-weight="bold" fill="black" stroke="#595959" stroke-width="3" text-anchor="middle"
                                alignment-baseline="middle" dy="">${index + 1}</text>
                        </svg>
                    </div>
                    <div class="img-block">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                        <div class="movie-info">最新上映</div>
                    </div>
                </div>
            `);

            $movieRow.append(movieElement);
        });
    }

    // 初始化
    fetchTopMovies();

    // 第一个轮播区
    let currentIndex1 = 0;
    const $sliderTrack1 = $('.slider-track'); // 第一个轮播区的 track
    const $totalSlides1 = $('.slider-item').length; // 获取总的轮播项数

    // 切换到下一张
    $('.next-btn').on('click', function () {
        currentIndex1 = (currentIndex1 + 1) % $totalSlides1;
        updateSlider1();
    });

    // 切换到上一张
    $('.prev-btn').on('click', function () {
        currentIndex1 = (currentIndex1 - 1 + $totalSlides1) % $totalSlides1;
        updateSlider1();
    });

    // 更新第一个轮播的位置
    function updateSlider1() {
        const offset = -100 * currentIndex1; // 每个轮播项宽度为 100vw
        $sliderTrack1.css('transform', `translateX(${offset}vw)`);
    }

    // 第二个轮播区（Top 10 movies）
    let currentIndex2 = 0;
    const $sliderTrack2 = $('.top-movies .slider-track'); // 第二个轮播区的 track
    const $totalSlides2 = $('.top-movies .movie-item').length; // 获取第二个轮播区的总轮播项数

    // 切换到下一张（Top 10 movies）
    $('.top-movies .next-btn').on('click', function () {
        console.log($totalSlides2);
        
        currentIndex2 = (currentIndex2 + 1) % $totalSlides2;
        updateSlider2();
    });

    // 切换到上一张（Top 10 movies）
    $('.top-movies .prev-btn').on('click', function () {
        currentIndex2 = (currentIndex2 - 1 + $totalSlides2) % $totalSlides2;
        updateSlider2();
    });

    // 更新第二个轮播的位置（Top 10 movies）
    function updateSlider2() {
        const offset = -300 * currentIndex2; // 每次滚动 300px
        $sliderTrack2.css('transform', `translateX(${offset}px)`); // 滚动 300px
    }
    
});
