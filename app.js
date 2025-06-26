// URL del backend (reemplaza con la URL de tu backend desplegado)
const API_URL = 'https://movieselector.onrender.com/api'; // Ejemplo: 'https://your-app.onrender.com/api'

// Obtener películas desde el backend
async function getMovies() {
    try {
        const response = await fetch(`${API_URL}/movies`);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener películas:', error);
        return [];
    }
}

// Guardar películas en el backend
async function saveMovies(movies) {
    try {
        await fetch(`${API_URL}/movies`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movies)
        });
    } catch (error) {
        console.error('Error al guardar películas:', error);
    }
}

// Manejar el formulario para agregar películas
document.getElementById('movie-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const movieInput = document.getElementById('movie');
    const movie = movieInput.value.trim();
    if (movie) {
        const movies = await getMovies();
        movies.push({ title: movie, seen: false });
        await saveMovies(movies);
        movieInput.value = ''; // Limpiar input
        document.getElementById('recommendation').textContent = 'Película agregada.';
        await updateMovieList(); // Actualizar la lista si está visible
    }
});

// Obtener recomendación aleatoria (solo películas no vistas)
async function getRecommendation() {
    const movies = await getMovies();
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
async function toggleMovieList() {
    const movieListDiv = document.getElementById('movie-list');
    if (movieListDiv.style.display === 'block') {
        movieListDiv.style.display = 'none';
    } else {
        movieListDiv.style.display = 'block';
        await updateMovieList();
    }
}

// Vaciar la lista de películas
async function clearMovies() {
    const initialMovies = [
        { title: "Bad surgeon (Netflix)", seen: false },
        { title: "Behind her eyes (Netflix)", seen: false },
        { title: "Adolescence (Netflix)", seen: false },
        { title: "Watch untold the gf who didn’t exist (Netflix)", seen: false },
        { title: "Match point", seen: false },
        { title: "Your name (crunchy)", seen: false },
        { title: "The fourth kind", seen: false },
        { title: "Arrival", seen: false },
        { title: "Gladiator 1", seen: false },
        { title: "The Big Short", seen: false },
        { title: "The rite", seen: false },
        { title: "Parasite (max)", seen: false },
        { title: "El Sueño Valentín (Prime)", seen: false },
        { title: "Troya", seen: false },
        { title: "Margin Call (Prime)", seen: false },
        { title: "I origins (prime)", seen: false },
        { title: "Los huéspedes (Prime)", seen: false },
        { title: "Warfare", seen: false },
        { title: "Oldboy", seen: false }
    ];
    await saveMovies(initialMovies);
    await updateMovieList();
    document.getElementById('recommendation').textContent = 'Lista reiniciada.';
}

// Actualizar la lista de películas en la interfaz
async function updateMovieList() {
    const movies = await getMovies();
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
async function toggleSeen(index) {
    const movies = await getMovies();
    movies[index].seen = !movies[index].seen;
    await saveMovies(movies);
    await updateMovieList();
}

// Activar modo de edición para una película
async function editMovie(index) {
    const movies = await getMovies();
    movies.forEach((movie, i) => {
        movie.editMode = (i === index) ? !movie.editMode : false;
    });
    await saveMovies(movies);
    await updateMovieList();
}

// Guardar película editada
async function saveEditedMovie(index, newTitle) {
    const movies = await getMovies();
    if (newTitle.trim()) {
        movies[index].title = newTitle.trim();
    }
    movies[index].editMode = false;
    await saveMovies(movies);
    await updateMovieList();
}
