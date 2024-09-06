                /* Déclaration des variables d'URLs API */ 
const API_URL_BEST_MOVIE = "http://localhost:8000/api/v1/titles/7822474";
const API_URL_TOP_MOVIE = "http://localhost:8000/api/v1/titles/?imdb_score_min=9.4"
const API_URL_ACTION_MOVIE = "http://localhost:8000/api/v1/titles/?genre=action"


                /* Récupération des données du meilleur film */  
// Fonction pour faire la requête vers l'URL de API
async function fetchBestMovie() {
    const response = await fetch(API_URL_BEST_MOVIE);
    const movie = await response.json();
    displayBestMovie(movie);
}

// Fonction pour afficher des données du meilleur film
function displayBestMovie(movie) {
    const bestMovieDiv = document.querySelector('.best-movie');
    bestMovieDiv.innerHTML +=`
        <img src="${movie.image_url}" alt="${movie.title}" class="affiche-du-film">
        <div class="details-film">
            <h3>${movie.title}</h3>
            <p>${movie.description}</p>
            <button class="details-button">Détails</button>
        </div>
    `;
    // Ajouter un événement click pour afficher la fenêtre modale
    bestMovieDiv.querySelector('.details-button').addEventListener('click', () => {
        openModal(movie);
    });

    bestMovieDiv.querySelector('img').addEventListener('click', () => {
        openModal(movie);
    });
}

// Fonction pour formater des données d'ongler Modal
function openModal(movie) {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';

    document.querySelector('.modal-affiche').src = movie.image_url;
    document.querySelector('.modal-title').textContent = movie.title;
    document.querySelector('.modal-genres').textContent = movie.genres.join(', ');
    document.querySelector('.modal-date').textContent = movie.date_published;
    document.querySelector('.modal-rated').textContent = movie.rated;
    document.querySelector('.modal-imdb').textContent = movie.imdb_score;
    document.querySelector('.modal-directors').textContent = movie.directors.join(', ');
    document.querySelector('.modal-actors').textContent = movie.actors.join(', ');
    document.querySelector('.modal-duration').textContent = movie.duration;
    document.querySelector('.modal-country').textContent = movie.countries.join(', ');
    document.querySelector('.modal-box-office').textContent = movie.worldwide_gross_income ? movie.worldwide_gross_income : "N/A";
    document.querySelector('.modal-description').textContent = movie.long_description;

    // Fermer la modale lorsque l'utilisateur clique sur le bouton de fermeture
    document.querySelector('.close-button').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fermer la modale lorsque l'utilisateur clique en dehors du contenu
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

window.onload = fetchBestMovie;


            /* Récupérer les données des meilleurs films */
// Séléctionner l'élément à partir du DOM
const topMoviesContainer = document.getElementById('top-movies-container');

// Créer un tableau vide pour stocker les données des auteurs
let movieDataArr = [];

// Fonction pour faire les requêtes vers l'API 
async function fetchTopMovies() {
    try {
        let response = await fetch(API_URL_TOP_MOVIE);
        let data = await response.json();
        movieDataArr = data.results;

        // Si besoin, on récupère les films de la page suivante
        if (movieDataArr.length < 6 && data.next) {
            let responseNext = await fetch(data.next);
            let dataNext = await responseNext.json();
            movieDataArr = movieDataArr.concat(dataNext.results);
        }

        movieDataArr = movieDataArr.slice(0, 6);
        let movieDetailsPromises = movieDataArr.map(movie => fetch(movie.url).then(res => res.json()));
        let movieDetails = await Promise.all(movieDetailsPromises);

        displayActionMovies(movieDetails);
    } catch (error) {
        console.error("Erreur lors de la récupération des films : ", error);
    }
}

// Fonction pour afficher les films dans une section dédiée
function displayActionMovies(movieDataArr) {
    movieDataArr.forEach(movie => {
        topMoviesContainer.innerHTML += `
        <div class="movie-item">
            <img src="${movie.image_url}" alt="${movie.title}" class="movie-img" data-film-id="${movie.id}">
            <div class="overlay">
                <h3>${movie.title}</h3>
                <button class="details-button" data-film-id="${movie.id}">Détails</button>
            </div>
        </div> 
        `;
    });

    // Ajouter des écouteurs d'événements pour les images et les boutons de détails
    const images = document.querySelectorAll('.movie-img');
    const detailButtons = document.querySelectorAll('.details-button');

    images.forEach(image => {
        image.addEventListener('click', event => showActionMovieDetails(event.target.dataset.filmId));
    });

    detailButtons.forEach(button => {
        button.addEventListener('click', event => showActionMovieDetails(event.target.dataset.filmId));
    });
}

// Fonction pour afficher les détails du film dans la fenêtre modale existante
async function showActionMovieDetails(filmId) {
    try {
        let response = await fetch(`http://localhost:8000/api/v1/titles/${filmId}`);
        let movie = await response.json();

        // Mise à jour du contenu de la modale avec les détails du film
        document.querySelector('.modal-affiche').src = movie.image_url;
        document.querySelector('.modal-title').textContent = movie.title;
        document.querySelector('.modal-genres').textContent = movie.genres.join(', ');
        document.querySelector('.modal-date').textContent = movie.year;
        document.querySelector('.modal-rated').textContent = movie.rated || 'N/A';
        document.querySelector('.modal-imdb').textContent = movie.imdb_score;
        document.querySelector('.modal-directors').textContent = movie.directors.join(', ');
        document.querySelector('.modal-actors').textContent = movie.actors.join(', ');
        document.querySelector('.modal-duration').textContent = movie.duration || 'N/A';
        document.querySelector('.modal-country').textContent = movie.countries.join(', ');
        document.querySelector('.modal-box-office').textContent = movie.box_office || 'N/A';
        document.querySelector('.modal-description').textContent = movie.long_description || 'Pas de description disponible.';

        // Afficher la modale
        const modal = document.getElementById('modal');
        modal.style.display = "block";

        // Fermer la modale quand on clique sur le bouton de fermeture
        const closeButton = document.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            modal.style.display = "none";
        });

        // Fermer la modale quand on clique en dehors de la modale
        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des détails du film : ", error);
    }
}

// Charger les six premiers films à l'ouverture de la page
document.addEventListener('DOMContentLoaded', fetchTopMovies);


