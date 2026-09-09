const mongoose = require('mongoose');

const LINK_DB = 'mongodb://127.0.0.1:27017/proyecto_5_nosql';

const connect = async () => {
  try {
    const db = await mongoose.connect(LINK_DB);
    const { name, host } = db.connection;
    console.log(`Conectado a la BD: ${name} en el host: ${host}`);
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
  }
};

// Exportar ambas variables dentro del objeto
module.exports = { connect, LINK_DB };