const mongoose = require('mongoose');
const Movie = require('../models/Movie');

// Definir la URL directamente aquí
const LINK_DB = 'mongodb://127.0.0.1:27017/proyecto_5_nosql';

const movies = [
  {
    title: 'The Matrix',
    director: 'Hermanas Wachowski',
    year: 1999,
    genre: 'Acción',
  },
  {
    title: 'The Matrix Reloaded',
    director: 'Hermanas Wachowski',
    year: 2003,
    genre: 'Acción',
  },
  {
    title: 'Buscando a Nemo',
    director: 'Andrew Stanton',
    year: 2003,
    genre: 'Animación',
  },
  {
    title: 'Buscando a Dory',
    director: 'Andrew Stanton',
    year: 2016,
    genre: 'Animación',
  },
  {
    title: 'Interestelar',
    director: 'Christopher Nolan',
    year: 2014,
    genre: 'Ciencia ficción',
  },
  {
    title: '50 primeras citas',
    director: 'Peter Segal',
    year: 2004,
    genre: 'Comedia romántica',
  },
];

mongoose
  .connect(LINK_DB)
  .then(async () => {
    const allMovies = await Movie.find();
    if (allMovies.length) {
      await Movie.collection.drop();
      console.log('Colección anterior borrada con éxito.');
    }
  })
  .catch((err) => console.log('Error limpiando la BD:', err.message))
  .then(async () => {
    await Movie.insertMany(movies);
    console.log('¡Semilla (seeds) insertada con éxito!');
  })
  .catch((err) => console.log('Error al insertar las películas:', err.message))
  .finally(() => {
    mongoose.disconnect();
  });