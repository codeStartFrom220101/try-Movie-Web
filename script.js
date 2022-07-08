const TMBDUrl = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=d0971917ed87f0e2070a34523ce6a2fc'
const IMGPATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCHAPI = 'https://api.themoviedb.org/3/search/movie?api_key=d0971917ed87f0e2070a34523ce6a2fc&query=';

const movieList = document.querySelector('.movie-list');
const search = document.querySelector('.search');
const searchBtn = document.querySelector('.searchBtn');
const searchTerm = document.querySelector('.searchTerm');
const sidebarBtn = document.querySelector('.sidebarBtn');
const sidebar = document.querySelector('.sidebar');
const getMoreBtn = movieList.querySelector('.get-more-btn');
const popupClose = document.querySelector('.popup-close');
const popupContainer = document.querySelector('.popup-container');
const popup = document.querySelector('.popup');
const movieDetails = document.querySelector('.movie-details-container');
const trailerBtn = document.querySelector('.trailer-btn');
const trailerContainer = document.querySelector('.trailer-container');



let sidebarMove = 'off';
let searchBy = 'popular';
let page = 1;

async function getTMDBData(url) {
    const resp = await fetch(url)
    const respData = await resp.json();
    showMovies(respData.results);
}

async function getTMDBDataById(url) {
    const resp = await fetch(url)
    const respData = await resp.json();
    return respData;
}

getTMDBData(TMBDUrl);

function showMovies(movies) {

    // clear list
    movies.forEach(movie => {
        const {
            poster_path,
            title,
            vote_average,
            id
        } = movie;
        const movieEl = document.createElement('li')
        movieEl.dataset.id = id;
        movieEl.innerHTML = `
                <img src="${IMGPATH + `${poster_path? poster_path : '/vQs0SFbMAZsvDF3aGtrVtDRmrl2.jpg'}`}" alt="${title}">
                <div class="movie-info">
                    <h3>${title}</h3>
                    <span class="${getClassByRate(vote_average)}">${vote_average}</span>
                </div>
        `
        movieList.appendChild(movieEl);
    });
    if (searchBy !== 'search') {
        movieList.appendChild(getMoreBtn);
    }
}

getMoreBtn.addEventListener('click', () => {
    page++;
    const url = `https://api.themoviedb.org/3/movie/${searchBy}?api_key=d0971917ed87f0e2070a34523ce6a2fc&language=en-US&page=${page}`
    getTMDBData(url);
})


// rate point color
function getClassByRate(point) {
    if (point >= 8) {
        return 'green'
    } else if (point >= 6) {
        return 'blue'
    } else {
        return 'red'
    }
}

search.addEventListener('submit', searchMovies);

function searchMovies(e) {
    searchBy = 'search';
    movieList.innerHTML = '';
    e.preventDefault();
    const term = searchTerm.value;
    console.log(term);
    if (term) {
        const url = SEARCHAPI + term;
        searchTerm.value = '';
        getTMDBData(url);
    }
}

// https://image.tmdb.org/t/p/w1280/nDP33LmQwNsnPv29GQazz59HjJI.jpg
// const photo = 'https://image.tmdb.org/t/p/w1280/lQExfQ6jplru1AtCp9eUrSvwLxS.jpg'

// const popup = document.querySelector('.popup');
// popup.addEventListener('click', () => {
//     const img = popup.querySelector('.img')
//     img.style = `background-image:linear-gradient(to bottom, transparent, rgb(39, 37, 50)), url(${photo});`
// })

// sidebar slide 
sidebarBtn.addEventListener('click', () => {
    if (sidebarMove === 'off') {
        sidebar.classList.add('active');
        sidebarBtn.classList.add('active');
        sidebarMove = 'on';
    } else {
        sidebar.classList.remove('active');
        sidebarBtn.classList.remove('active');
        sidebarMove = 'off'
    }
})

document.addEventListener('scroll', function () {
    if (sidebarMove === 'on') {
        sidebar.classList.remove('active');
        sidebarBtn.classList.remove('active');
    }
})

// sidebar searchBy
sidebar.addEventListener('click', async (e) => {
    if(e.target.nodeName !== 'LI'){
        return;
    }
    page = 1;
    movieList.innerHTML = '';
    searchBy = e.target.closest('li').dataset.search;
    const url = `https://api.themoviedb.org/3/movie/${searchBy}?api_key=d0971917ed87f0e2070a34523ce6a2fc&language=en-US&page=1`
    getTMDBData(url);
})

// click to close popup
popupClose.addEventListener('click', () => {
    popupContainer.classList.add('hidden');
    movieDetails.innerHTML = '';
})

// get movie id by click
movieList.addEventListener('click', (e) => {
    if (e.target.nodeName !== "IMG") {
        return;
    }
    const id = e.target.closest('li').dataset.id
    showPopup(id);
})

// movie info
async function showPopup(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=d0971917ed87f0e2070a34523ce6a2fc&append_to_response=credits`;
    const movie = await getTMDBDataById(url);
    const {
        poster_path,
        backdrop_path,
        title,
        overview,
        genres,
        credits,
        vote_average,
        vote_count
    } = movie;

    // render movie info
    popupContainer.classList.remove('hidden');
    movieDetails.innerHTML = `
        <div class="img" style="background-image:linear-gradient(to bottom, rgba(0,0,0,0), #22254b), url('${IMGPATH + backdrop_path}');">
        </div>
        <div class="movie-details">
            <div class="movie-details-header">
                <img src="${IMGPATH + poster_path}" alt="${title}">
                <div class="movie-title">
                    <div class="movie-point">
                        <div class="point">${vote_average}</div>
                        <div>
                            <div class="star">
                                <i class="${getStar(vote_average)}"></i>
                            </div>
                            <div class="vote-count">
                                ${vote_count}
                            </div>
                        </div>
                    </div>
                    <div class="name-genres">
                        <h3>${title}</h3>
                        <div class="genres">
                            ${getGenre(genres)}
                        </div>
                    </div>
                </div>
            </div>
            <div class="movie-details-body">
                <div class="overview">
                    <p>${overview}</p>
                </div>
                <div class="cast">
                    <h4>CAST</h4>
                    <ul class="actor">
                        ${getCast(credits.cast)}
                    </ul>
                </div>
                <div class="recommendations">
                    <h4>You Might Also Like</h4>
                    <ul class="recommendations-movie">
                        ${await getRecommendations(id)}
                    </ul>
                </div>
            </div>
        </div>
    `
    https://api.themoviedb.org/3/movie/278/recommendations?api_key=d0971917ed87f0e2070a34523ce6a2fc&language=en-US&page=1
    // get trailer
    trailerBtn.addEventListener('click', async () => {
        const id = movie.id;
        const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=d0971917ed87f0e2070a34523ce6a2fc`;
        const allVideo = await getTMDBDataById(url);
        let trailer = allVideo.results.filter(video => video.type === "Trailer");
        trailer = trailer[0];
        popup.style.opacity = '.5'
        trailerContainer.classList.remove('hidden');
        trailerContainer.innerHTML = `
            <button class="trailer-close"><i class="fa-solid fa-xmark"></i></button>
            <iframe class="" width="1280" height="720" src="https://www.youtube.com/embed/${trailer.key}"
                title="${title} | Final Trailer" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
        `

        const trailerClose = trailerContainer.querySelector('.trailer-close');
        trailerClose.addEventListener('click', () => {
            popup.style.opacity = '1'
            trailerContainer.innerHTML = "";
            trailerContainer.classList.add('hidden');
        })

    });

    const recommendationsMovie = movieDetails.querySelector('.recommendations-movie');
    recommendationsMovie.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        console.log(id);
        if (id) {
            showPopup(id);
        }
    })
}

// u might also like
async function getRecommendations(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=d0971917ed87f0e2070a34523ce6a2fc&language=en-US&page=1`
    const respData = await getTMDBDataById(url);
    console.log(respData);
    const movies = respData.results;



    let str = '';
    movies.forEach((movie) => {
        const {
            poster_path,
            title,
            id,
            vote_average
        } = movie
        str += `
            <li>
                <img src="${IMGPATH + `${poster_path? poster_path : '/vQs0SFbMAZsvDF3aGtrVtDRmrl2.jpg'}`}" alt="${title}" data-id="${id}">
                <div class="movie-info">
                    <h3>${title}</h3>
                    <span class="${getClassByRate(vote_average)}">${vote_average}</span>
                </div>
            </li>
    `
    });

    return str;
}

// render genres
function getGenre(genres) {
    let str = "";
    genres.forEach(genre => {
        str += `<span>${genre.name}</span>`
    })
    return str;
}

// render cast
function getCast(cast) {
    let str = "";
    cast.forEach(actor => {
        console.log(actor);
        str += `
            <li>
                <img src="${IMGPATH +`${actor.profile_path? actor.profile_path : '/vQs0SFbMAZsvDF3aGtrVtDRmrl2.jpg'}`}"
                    alt="${actor.name}">
                <h5>
                    ${actor.name.split(/\s+/)[0]} <br>
                    ${actor.name.split(/\s+/)[1]}
                </h5>
            </li>
        `
    });
    return str
}



// star rated
function getStar(point) {
    if (point == 10) {
        return "show_rated_5"
    } else if (point >= 9) {
        return "show_rated_4_5"
    } else if (point >= 8) {
        return "show_rated_4"
    } else if (point >= 7) {
        return "show_rated_3_5"
    } else if (point >= 6) {
        return "show_rated_3"
    } else if (point >= 5) {
        return "show_rated_2_5"
    } else if (point >= 4) {
        return "show_rated_2"
    } else if (point >= 3) {
        return "show_rated_1_5"
    } else if (point >= 2) {
        return "show_rated_1"
    } else if (point >= 1) {
        return "show_rated_0_5"
    } else {
        return "show_rated_0"
    }
}