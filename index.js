const express = require('express');
const { connect } = require('./utils/db');
const movieRoutes = require('./routes/movie.routes');
const cineRoutes = require('./routes/cine.routes');

const PORT = 3000;
const server = express();

// ConexiÃ³n a MongoDB
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

server.listen(PORT, () => {
  console.log(`Servidor ejecutÃ¡ndose en http://localhost:${PORT}`);
});