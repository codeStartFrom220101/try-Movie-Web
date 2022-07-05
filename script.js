const TMBDUrl = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=d0971917ed87f0e2070a34523ce6a2fc'
const IMGPATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCHAPI = 'https://api.themoviedb.org/3/search/movie?api_key=d0971917ed87f0e2070a34523ce6a2fc&query=';

const movieList = document.querySelector('.movie-list');
const search = document.querySelector('.search');
const searchTerm = document.querySelector('.searchTerm');
const popupClose = document.querySelector('.popup-close');
const popupContainer = document.querySelector('.popup-container')
const movieDetails = document.querySelector('.movie-details-container')

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
    movieList.innerHTML = '';

    movies.forEach(movie => {
        const {
            poster_path,
            title,
            vote_average,
            id
        } = movie
        const movieEl = document.createElement('li')
        movieEl.innerHTML = `
                <img src="${IMGPATH + `${poster_path? poster_path : '/vQs0SFbMAZsvDF3aGtrVtDRmrl2.jpg'}`}" alt="${title}" data-id="${id}">
                <div class="movie-info">
                    <h3>${title}</h3>
                    <span class="${getClassByRate(vote_average)}">${vote_average}</span>
                </div>
        `
        movieList.appendChild(movieEl);
    });
}

function getClassByRate(point) {
    if (point >= 8) {
        return 'green'
    } else if (point >= 6) {
        return 'blue'
    } else {
        return 'red'
    }
}

search.addEventListener('submit', searchMovies)

function searchMovies(e){
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

popupClose.addEventListener('click', () => {
    popupContainer.classList.add('hidden');
})

movieList.addEventListener('click', (e) => {
    if(e.target.nodeName !== "IMG"){
        return;
    }
    const id = e.target.closest('img').dataset.id
    showPopup(id);
})

async function showPopup(id){
    const SEARCHIDAPI = `https://api.themoviedb.org/3/movie/${id}?api_key=d0971917ed87f0e2070a34523ce6a2fc&append_to_response=credits`
    const movie = await getTMDBDataById(SEARCHIDAPI);
    const { poster_path, backdrop_path, title, overview, genres, credits, vote_average, vote_count } = movie
    console.log(movie);
    console.log(genres);
    popupContainer.classList.remove('hidden')
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
            </div>
        </div>
    `
}

// ${genres.forEach(genre => `<span>${genre.name}</span>`)}

function getGenre(genres) {
    let str = "";
    genres.forEach(genre => {
        str += `<span>${genre.name}</span>`
    })
    return str;
}

function getCast(cast) {
    let str = "";
    cast.forEach(actor => {
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