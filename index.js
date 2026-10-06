const express = require('express');
const { connect } = require('./utils/db');
const movieRoutes = require('./routes/movie.routes');
const cineRoutes = require('./routes/cine.routes');

const PORT = 3000;
const server = express();

// Conexión a MongoDB
connect();

// Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Enrutadores
server.use('/movies', movieRoutes);
server.use('/cines', cineRoutes);

// Manejo de rutas inexistentes (404)
server.use('/*path/', (req, res, next) => {
  const error = new Error('Ruta no encontrada');
  error.status = 404;
  return next(error);
});

// Control global de errores (500)
server.use((error, req, res, next) => {
  return res.status(error.status || 500).json({
    message: error.message || 'Error interno del servidor',
    error: error
  });
});

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

// ---------------------------------------------------------------------
// 6. CREAR UNA NUEVA PELÍCULA (POST)
// ---------------------------------------------------------------------
server.post('/movies', async (req, res) => {
  try {
    // Creamos una instancia del modelo Movie con los datos enviados en req.body
    const newMovie = new Movie(req.body);
    const savedMovie = await newMovie.save();
    return res.status(201).json(savedMovie);
  } catch (error) {
    return res.status(400).json({ message: 'Error al crear la película', error: error.message });
  }
});

// ---------------------------------------------------------------------
// 7. ACTUALIZAR UNA PELÍCULA EXISTENTE (PUT)
// ---------------------------------------------------------------------
server.put('/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // findByIdAndUpdate recibe: id, datos a actualizar, y { new: true } para retornar el documento modificado
    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    
    if (!updatedMovie) {
      return res.status(404).json({ message: 'No se encontró la película para actualizar' });
    }
    
    return res.status(200).json(updatedMovie);
  } catch (error) {
    return res.status(400).json({ message: 'Error al actualizar la película', error: error.message });
  }
});

// ---------------------------------------------------------------------
// 8. ELIMINAR UNA PELÍCULA (DELETE)
// ---------------------------------------------------------------------
server.delete('/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMovie = await Movie.findByIdAndDelete(id);
    
    if (!deletedMovie) {
      return res.status(404).json({ message: 'No se encontró la película a eliminar' });
    }
    
    return res.status(200).json({ message: 'Película eliminada correctamente', movie: deletedMovie });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar la película', error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});