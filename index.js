const express = require('express');
const { connect } = require('./utils/db');
const Movie = require('./models/Movie');

const PORT = 3000;
const server = express();

// Conectar con MongoDB
connect();

// Middleware para transformar el cuerpo de las peticiones a JSON
server.use(express.json());

// ---------------------------------------------------------------------
// ENDPOINTS GET
// ---------------------------------------------------------------------

// 1. Obtener todas las películas
server.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    return res.status(200).json(movies);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener películas', error: error.message });
  }
});

// 2. Obtener película por ID
server.get('/movies/id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }
    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json({ message: 'Error en la búsqueda por ID', error: error.message });
  }
});

// 3. Buscar películas por Título
server.get('/movies/title/:title', async (req, res) => {
  const { title } = req.params;
  try {
    const movies = await Movie.find({ title: new RegExp(title, 'i') });
    return res.status(200).json(movies);
  } catch (error) {
    return res.status(500).json({ message: 'Error en la búsqueda por título', error: error.message });
  }
});

// 4. Buscar películas por Género
server.get('/movies/genre/:genre', async (req, res) => {
  const { genre } = req.params;
  try {
    const movies = await Movie.find({ genre: new RegExp(genre, 'i') });
    return res.status(200).json(movies);
  } catch (error) {
    return res.status(500).json({ message: 'Error en la búsqueda por género', error: error.message });
  }
});

// Manejo de rutas inexistentes (404)
server.use('*', (req, res) => {
  return res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});