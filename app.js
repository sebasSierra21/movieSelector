// Lista inicial de películas
const initialMovies = [
    "Bad surgeon (Netflix)",
    "Behind her eyes (Netflix)",
    "Adolescence (Netflix)",
    "Watch untold the gf who didnt exist (Netflix)",
    "Match point",
    "Your name (crunchy)",
    "The fourth kind",
    "Arrival",
    "Gladiator 1",
    "The Big Short",
    "The rite",
    "Parasite (max)",
    "El Sueño Valentín (Prime)",
    "Troya",
    "Margin Call (Prime)",
    "I origins (prime)",
    "Los huéspedes (Prime)",
    "Warfare",
    "Oldboy"
];

// Inicializar películas en localStorage si no existen
if (!localStorage.getItem('movies')) {
    localStorage.setItem('movies', JSON.stringify(initialMovies));
}

// Obtener películas desde localStorage
function getMovies() {
    return JSON.parse(localStorage.getItem('movies')) || [];
}

// Guardar películas en localStorage
function saveMovies(movies) {
    localStorage.setItem('movies', JSON.stringify(movies));
}

// Manejar el formulario para agregar películas
document.getElementById('movie-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const movieInput = document.getElementById('movie');
    const movie = movieInput.value.trim();
    if (movie) {
        const movies = getMovies();
        movies.push(movie);
        saveMovies(movies);
        movieInput.value = ''; // Limpiar input
        document.getElementById('recommendation').textContent = 'Película agregada.';
        updateMovieList(); // Actualizar la lista si está visible
    }
});

// Obtener recomendación aleatoria
function getRecommendation() {
    const movies = getMovies();
    const recommendationDiv = document.getElementById('recommendation');
    if (movies.length > 0) {
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        recommendationDiv.textContent = `¡Recomendación: ${randomMovie}!`;
    } else {
        recommendationDiv.textContent = 'No hay películas disponibles.';
    }
}

// Mostrar u ocultar la lista de películas
function toggleMovieList() {
    const movieListDiv = document.getElementById('movie-list');
    if (movieListDiv.style.display === 'block') {
        movieListDiv.style.display = 'none';
    } else {
        movieListDiv.style.display = 'block';
        updateMovieList();
    }
}

// Actualizar la lista de películas en la interfaz
function updateMovieList() {
    const movies = getMovies();
    const movieListDiv = document.getElementById('movie-list');
    if (movies.length > 0) {
        movieListDiv.innerHTML = '<ul>' + movies.map(movie => `<li>${movie}</li>`).join('') + '</ul>';
    } else {
        movieListDiv.innerHTML = '<p>No hay películas en la lista.</p>';
    }
}