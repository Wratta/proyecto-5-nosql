const express = require('express');
const mongoose = require('mongoose');
const Movie = require('./models/Movie');

const DB_URL = 'mongodb://127.0.0.1:27017/movies-db';
const PORT = 3000;

const server = express();

// Conexión a MongoDB
mongoose
  .connect(DB_URL)
  .then(() => console.log('Conectado a la base de datos MongoDB'))
  .catch((err) => console.error('Error de conexión a MongoDB:', err));

// Middleware para entender JSON
server.use(express.json());

// ---------------------------------------------------------------------
// RUTAS GET (CONSULTAS)
// ---------------------------------------------------------------------

// 1. Obtener TODAS las películas
server.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    return res.status(200).json(movies);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener películas', error });
  }
});

// 2. Obtener una película por su ID (ej: /movies/id/65c84a...)
server.get('/movies/id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }
    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json({ message: 'Error al buscar por ID', error });
  }
});

// 3. Obtener películas por TÍTULO (ej: /movies/title/Matrix)
server.get('/movies/title/:title', async (req, res) => {
  const { title } = req.params;
  try {
    // Usa expresión regular para buscar coincidencia parcial sin distinguir mayúsculas/minúsculas
    const movies = await Movie.find({ title: new RegExp(title, 'i') });
    return res.status(200).json(movies);
  } catch (error) {
    return res.status(500).json({ message: 'Error al buscar por título', error });
  }
});

// 4. Obtener películas por GÉNERO (ej: /movies/genre/Animación)
server.get('/movies/genre/:genre', async (req, res) => {
  const { genre } = req.params;
  try {
    const movies = await Movie.find({ genre: new RegExp(genre, 'i') });
    return res.status(200).json(movies);
  } catch (error) {
    return res.status(500).json({ message: 'Error al buscar por género', error });
  }
});

// 5. Obtener películas estrenadas a partir de un año específico (ej: /movies/year/2010)
server.get('/movies/year/:year', async (req, res) => {
  const { year } = req.params;
  try {
    const movies = await Movie.find({ year: { $gte: Number(year) } });
    return res.status(200).json(movies);
  } catch (error) {
    return res.status(500).json({ message: 'Error al buscar por año', error });
  }
});

// Manejo de rutas no encontradas (404)
server.use('*', (req, res) => {
  return res.status(404).json({ message: 'Ruta no encontrada' });
});

// Inicio del servidor
server.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});