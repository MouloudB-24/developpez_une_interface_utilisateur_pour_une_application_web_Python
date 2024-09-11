// Déclaration des variables d'URLs API 
const API_URL_BEST_MOVIE = "http://localhost:8000/api/v1/titles/?page_size=1&sort_by=-imdb_score,title";
const API_URL_TOP_MOVIE = "http://localhost:8000/api/v1/titles/?page_size=6&sort_by=-imdb_score,-title";
const API_URL_BIOGRAPHY_MOVIE = "http://localhost:8000/api/v1/titles/?page_size=6&genre=Biography&sort_by=-imdb_score,title";
const API_URL_COMEDY_MOVIE = "http://localhost:8000/api/v1/titles/?page_size=6&genre=Comedy&sort_by=-imdb_score,title"
const API_URL_CATEGORIES = "http://localhost:8000/api/v1/genres/?page_size=25"


// Select the elements from the DOM
const topMoviesContainer = document.getElementById('top-movies-container');
const biographyMoviesContainer = document.getElementById('biography-movies-container');
const comedyMoviesContainer = document.getElementById('comedy-movies-container');


// 1) Récupération des données du meilleur film 
// Fonction pour faire la requête vers l'URL de API
async function fetchBestMovie() {
    const response = await fetch(API_URL_BEST_MOVIE);
    const data = await response.json();
    const dataResults = data.results[0];
    let movie = await fetch(dataResults.url);
    movie = await movie.json();

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

window.onload = fetchBestMovie;

// 2) Récupérer les données des meilleurs films 
// Fonction pour afficher les films dans une section dédiée
function displayTopMovies(movieDataArr) {
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
    setupEventListenersForMovies()
}



// 3) Retrieve data for the best Biography movies 
// Create an empty array to store movies data
let biographyMovieDataArr = [];

// Function to display movies in a dedicated section
function displayBiographyMovies(biographyMovieDataArr) {
    biographyMovieDataArr.forEach(movie => {
        biographyMoviesContainer.innerHTML += `
        <div class="movie-item">
            <img src="${movie.image_url}" alt="${movie.title}" class="movie-img" data-film-id="${movie.id}">
            <div class="overlay">
                <h3>${movie.title}</h3>
                <button class="details-button" data-film-id="${movie.id}">Détails</button>
            </div>
        </div> 
        `;
    });

    // Add event listeners for image and details button
   setupEventListenersForMovies()
}


// 4) Retrieve data for the best Comedy movies 
// Create an empty array to store movies data
let comedyMovieDataArr = [];

// Function to display movies in a dedicated section
function displayComedyMovies(comedyMovieDataArr) {
    comedyMovieDataArr.forEach(movie => {
        comedyMoviesContainer.innerHTML += `
        <div class="movie-item">
            <img src="${movie.image_url}" alt="${movie.title}" class="movie-img" data-film-id="${movie.id}">
            <div class="overlay">
                <h3>${movie.title}</h3>
                <button class="details-button" data-film-id="${movie.id}">Détails</button>
            </div>
        </div> 
        `;
    });

    // Add event listeners for image and details button
    setupEventListenersForMovies()
}

function setupEventListenersForMovies() {
    const images = document.querySelectorAll('.movie-img');
    const detailButtons = document.querySelectorAll('.details-button');

    images.forEach(image => {
        image.addEventListener('click', event => showMovieDetails(event.target.dataset.filmId));
    });

    detailButtons.forEach(button => {
        button.addEventListener('click', event => showMovieDetails(event.target.dataset.filmId));
    });
}

// Function for making requests to the API
async function fetchMovies(url, displayFunction){
    try {
        let response = await fetch(url);
        let data = await response.json();
        let movieDataArr = data.results;

        let movieDetailsPromises = movieDataArr.map(movie => fetch(movie.url).then(res => res.json()));
        let movieDetails = await Promise.all(movieDetailsPromises);

        displayFunction(movieDetails);
    } catch (error) {
        console.log("Error retrieving movie data; ", error)
    }  
}

// Fonction pour afficher les détails du film dans la fenêtre modale existante
async function showMovieDetails(filmId) {
    try {
        let response = await fetch(`http://localhost:8000/api/v1/titles/${filmId}`);
        let movie = await response.json();

        // Utilisation de la fonction openModal pour afficher les détails du film
        openModal(movie)

    } catch (error) {
        console.error("Erreur lors de la récupération des détails du film : ", error);
    }
}

// Fonction pour formater des données d'ongler Modal
function openModal(movie) {
    const modal = document.getElementById('modal');

    // Fill in the modal information with the movie details
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

    // Display the modal
    modal.style.display = 'flex';

    // Gestion de la fermeture de la modale
    setupModalClose(modal);
}

function setupModalClose(modal) {
    // Fermer la modale quand l'utilisateur clique sur le bouton de fermeture
    const closeButton = document.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        modal.style.display = "none";
    });

    // Fermer la modale quand l'utilisateur clique en dehors de la modale
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

// Load the movie once the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    fetchMovies(API_URL_TOP_MOVIE, displayTopMovies);
    fetchMovies(API_URL_BIOGRAPHY_MOVIE, displayBiographyMovies);
    fetchMovies(API_URL_COMEDY_MOVIE, displayComedyMovies);
})


// 5) Retrieve data API for the free category
const categoriesListContainer = document.getElementById('categories');
const categoriesContainer = document.getElementById('other-movies-container');
let categoriesDataArr = [];

// Fonction pour récupérer la liste des catégories
async function fetchCategories(){
    try {
        let response = await fetch(API_URL_CATEGORIES);
        let data = await response.json();
        categoriesDataArr = data.results;

        // Afficher les catégories dans le <select>
        displayListCategories(categoriesDataArr);
    } catch (error) {
        console.log("Erreur lors de la récupération des catégories : ", error);
    }  
}

// Fonction pour afficher la liste des catégories dans le <select>
function displayListCategories(categoriesDataArr) {
    // Nettoyer le contenu actuel du <select> pour éviter les duplications
    categoriesListContainer.innerHTML = `<option value="" disabled selected>Choisir une catégorie</option>`;

    categoriesDataArr.forEach(category => {
        categoriesListContainer.innerHTML += `
        <option value="${category.name}">${category.name}</option>
        `;
    });

    // Attacher l'écouteur d'événement `change` au <select> après avoir ajouté les options
    categoriesListContainer.addEventListener('change', (event) => {
        const selectedCategory = event.target.value;
        console.log(`Catégorie sélectionnée : ${selectedCategory}`);
        
        // Appeler la fonction pour afficher les détails des films de la catégorie sélectionnée
        showMovieDetailByCategory(selectedCategory);
    });
}

// Fonction pour afficher les films de la catégorie sélectionnée
async function showMovieDetailByCategory(selectedCategory) {
    // Vider l'affichage des films précédents
    categoriesContainer.innerHTML = "";

    try {
        let response = await fetch(`http://localhost:8000/api/v1/titles/?page_size=6&genre=${selectedCategory}&sort_by=-imdb_score,title`);
        let data = await response.json();
        let movieDataArr = data.results;

        // Récupérer les détails des films
        let movieDetailsPromises = movieDataArr.map(movie => fetch(movie.url).then(res => res.json()));
        let movieDetails = await Promise.all(movieDetailsPromises);

        // Afficher les films dans la section dédiée
        movieDetails.forEach(movie => {
            categoriesContainer.innerHTML +=`
            <div class="movie-item">
                <img src="${movie.image_url}" alt="${movie.title}" class="movie-img" data-film-id="${movie.id}">
                <div class="overlay">
                    <h3>${movie.title}</h3>
                    <button class="details-button" data-film-id="${movie.id}">Détails</button>
                </div>
            </div> 
            `;
        });
    } catch (error) {
        console.log("Erreur lors de la récupération des films : ", error);
    }
}

// Appeler la fonction pour charger les catégories
fetchCategories();