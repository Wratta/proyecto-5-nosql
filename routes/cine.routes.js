const express = require('express');
const Cine = require('../models/Cine');

const router = express.Router();

// 1. GET - Obtener todos los cines (poblando el array de pelÃ­culas)
router.get('/', async (req, res, next) => {
  try {
    const cines = await Cine.find().populate('movies');
    return res.status(200).json(cines);
  } catch (error) {
    return next(error);
  }
});

// 2. POST - Crear un nuevo cine
router.post('/', async (req, res, next) => {
  try {
    const newCine = new Cine(req.body);
    const createdCine = await newCine.save();
    return res.status(201).json(createdCine);
  } catch (error) {
    return next(error);
  }
});

// 3. PUT - AÃ±adir una pelÃ­cula a un cine existente
router.put('/:id/add-movie', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { movieId } = req.body;

    const updatedCine = await Cine.findByIdAndUpdate(
      id,
      { $push: { movies: movieId } },
      { new: true }
    ).populate('movies');

    if (!updatedCine) {
      return res.status(404).json({ message: 'Cine no encontrado para actualizar' });
    }

    return res.status(200).json(updatedCine);
  } catch (error) {
    return next(error);
  }
});

// 4. DELETE - Eliminar un cine
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const cineDeleted = await Cine.findByIdAndDelete(id);
    if (!cineDeleted) {
      return res.status(404).json({ message: 'Cine no encontrado para eliminar' });
    }
    return res.status(200).json({ message: 'Cine eliminado correctamente', cine: cineDeleted });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;