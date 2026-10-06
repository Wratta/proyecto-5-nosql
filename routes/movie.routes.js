const express = require('express');
const Movie = require('../models/Movie');

const router = express.Router();

// 1. GET - Obtener todas las Películas
router.get('/', async (req, res, next) => {
  try {
    const movies = await Movie.find();
    return res.status(200).json(movies);
  } catch (error) {
    return next(error);
  }
});

// 2. GET - Obtener Película por ID
router.get('/id/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }
    return res.status(200).json(movie);
  } catch (error) {
    return next(error);
  }
});

// 3. GET - Buscar por tí­tulo
router.get('/title/:title', async (req, res, next) => {
  const { title } = req.params;
  try {
    const movies = await Movie.find({ title: new RegExp(title, 'i') });
    return res.status(200).json(movies);
  } catch (error) {
    return next(error);
  }
});

// 4. GET - Buscar por género
router.get('/genre/:genre', async (req, res, next) => {
  const { genre } = req.params;
  try {
    const movies = await Movie.find({ genre: new RegExp(genre, 'i') });
    return res.status(200).json(movies);
  } catch (error) {
    return next(error);
  }
});

// 5. POST - Crear una nueva Película
router.post('/', async (req, res, next) => {
  try {
    const newMovie = new Movie(req.body);
    const createdMovie = await newMovie.save();
    return res.status(201).json(createdMovie);
  } catch (error) {
    return next(error);
  }
});

// 6. PUT - Modificar una Película existente
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const movieModified = new Movie(req.body);
    movieModified._id = id; // Conservar el mismo ID

    const updatedMovie = await Movie.findByIdAndUpdate(
      id, 
      movieModified, 
      { new: true, runValidators: true } // <--- Añadido runValidators: true
    );
    
    if (!updatedMovie) {
      return res.status(404).json({ message: 'Película no encontrada para actualizar' });
    }
    return res.status(200).json(updatedMovie);
  } catch (error) {
    return next(error);
  }
});

// 7. DELETE - Eliminar una Película por ID
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const movieDeleted = await Movie.findByIdAndDelete(id);
    if (!movieDeleted) {
      return res.status(404).json({ message: 'Película no encontrada para eliminar' });
    }
    return res.status(200).json({ message: 'Película eliminada con Ã©xito', movie: movieDeleted });
  } catch (error) {
    return next(error);
  }
});


module.exports = router;