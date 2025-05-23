// Mock localStorage for Node.js environments
const localStorage = typeof window !== 'undefined' ? window.localStorage : {
    getItem: (key) => {
        const fs = require('fs');
        try {
            return fs.readFileSync('localStorage.json', 'utf8');
        } catch (e) {
            return null;
        }
    },
    setItem: (key, value) => {
        const fs = require('fs');
        fs.writeFileSync('localStorage.json', value);
    }
};

// Lista inicial de películas
const initialMovies = [
    
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
        movies.push({ title: movie, seen: false });
        saveMovies(movies);
        movieInput.value = ''; // Limpiar input
        document.getElementById('recommendation').textContent = 'Película agregada.';
        updateMovieList(); // Actualizar la lista si está visible
    }
});

// Obtener recomendación aleatoria (solo películas no vistas)
function getRecommendation() {
    const movies = getMovies();
    const unseenMovies = movies.filter(movie => !movie.seen);
    const recommendationDiv = document.getElementById('recommendation');
    if (unseenMovies.length > 0) {
        const randomMovie = unseenMovies[Math.floor(Math.random() * unseenMovies.length)];
        recommendationDiv.textContent = `¡Recomendación: ${randomMovie.title}!`;
    } else {
        recommendationDiv.textContent = 'No hay películas no vistas disponibles.';
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

// Vaciar la lista de películas
function clearMovies() {
    localStorage.removeItem('movies', 'initialMovies');
    localStorage.setItem('movies');
    updateMovieList();
    document.getElementById('recommendation').textContent = 'Lista reiniciada.';
}

// Actualizar la lista de películas en la interfaz
function updateMovieList() {
    const movies = getMovies();
    const movieListDiv = document.getElementById('movie-list');
    if (movies.length > 0) {
        movieListDiv.innerHTML = '<ul>' + 
            movies.map((movie, index) => `
                <li>
                    ${movie.editMode ? 
                        `<input type="text" class="edit-input" value="${movie.title}" onblur="saveEditedMovie(${index}, this.value)" onkeypress="if(event.key === 'Enter') saveEditedMovie(${index}, this.value)">` :
                        `<span class="movie-title ${movie.seen ? 'seen' : ''}">${movie.title}</span>`}
                    <button class="action-btn seen-btn" onclick="toggleSeen(${index})">${movie.seen ? 'Desmarcar' : 'Marcar Visto'}</button>
                    <button class="action-btn edit-btn" onclick="editMovie(${index})">${movie.editMode ? 'Cancelar' : 'Editar'}</button>
                </li>
            `).join('') + '</ul>';
    } else {
        movieListDiv.innerHTML = '<p>No hay películas en la lista.</p>';
    }
}

// Marcar o desmarcar película como vista
function toggleSeen(index) {
    const movies = getMovies();
    movies[index].seen = !movies[index].seen;
    saveMovies(movies);
    updateMovieList();
}

// Activar modo de edición para una película
function editMovie(index) {
    const movies = getMovies();
    movies.forEach((movie, i) => {
        movie.editMode = (i === index) ? !movie.editMode : false;
    });
    saveMovies(movies);
    updateMovieList();
}

// Guardar película editada
function saveEditedMovie(index, newTitle) {
    const movies = getMovies();
    if (newTitle.trim()) {
        movies[index].title = newTitle.trim();
    }
    movies[index].editMode = false;
    saveMovies(movies);
    updateMovieList();
}