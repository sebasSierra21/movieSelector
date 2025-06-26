from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Permitir solicitudes desde el frontend

MOVIES_FILE = 'movies.json'

# Lista inicial de películas
initial_movies = [
    {"title": "Bad surgeon (Netflix)", "seen": False},
    {"title": "Behind her eyes (Netflix)", "seen": False},
    {"title": "Adolescence (Netflix)", "seen": False},
    {"title": "Watch untold the gf who didn’t exist (Netflix)", "seen": False},
    {"title": "Match point", "seen": False},
    {"title": "Your name (crunchy)", "seen": False},
    {"title": "The fourth kind", "seen": False},
    {"title": "Arrival", "seen": False},
    {"title": "Gladiator 1", "seen": False},
    {"title": "The Big Short", "seen": False},
    {"title": "The rite", "seen": False},
    {"title": "Parasite (max)", "seen": False},
    {"title": "El Sueño Valentín (Prime)", "seen": False},
    {"title": "Troya", "seen": False},
    {"title": "Margin Call (Prime)", "seen": False},
    {"title": "I origins (prime)", "seen": False},
    {"title": "Los huéspedes (Prime)", "seen": False},
    {"title": "Warfare", "seen": False},
    {"title": "Oldboy", "seen": False}
]

# Inicializar movies.json si no existe
if not os.path.exists(MOVIES_FILE):
    with open(MOVIES_FILE, 'w') as f:
        json.dump(initial_movies, f)

# Leer películas desde el archivo


def read_movies():
    with open(MOVIES_FILE, 'r') as f:
        return json.load(f)

# Escribir películas al archivo


def write_movies(movies):
    with open(MOVIES_FILE, 'w') as f:
        json.dump(movies, f)


@app.route('/api/movies', methods=['GET'])
def get_movies():
    return jsonify(read_movies())


@app.route('/api/movies', methods=['PUT'])
def update_movies():
    movies = request.get_json()
    write_movies(movies)
    return '', 204


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
