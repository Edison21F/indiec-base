const mongoose = require('mongoose');
const { MONGODB_URI } = require('../keys');

// 1. Configuración de eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose conectado a MongoDB en:', mongoose.connection.host);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión en Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose desconectado de MongoDB');
});

// 2. Función de conexión mejorada 
const connectDB = async () => {
  try {
    // Codificar contraseña por si contiene caracteres especiales
    const encodedPassword = encodeURIComponent('0987021692@Rj');
    const connectionURI = MONGODB_URI.replace('<PASSWORD>', encodedPassword);

    await mongoose.connect(connectionURI, {
      connectTimeoutMS: 10000, // 10 segundos de timeout
      socketTimeoutMS: 45000, // 45 segundos
    });
    
    console.log('🚀 MongoDB conectado correctamente');
  } catch (err) {
    console.error('💥 FALLA CRÍTICA en conexión MongoDB:', err.message);
    process.exit(1); // Termina la aplicación con error
  }
};

// 3. Manejo de cierre de aplicación
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada por terminación de la app');
    process.exit(0);
  } catch (err) {
    console.error('Error al cerrar conexión MongoDB:', err);
    process.exit(1);
  }
});

// 4. Iniciar conexión inmediatamente (como solicitaste)
connectDB();

// 5. Exportar modelos (ajusta las rutas según tu estructura)
const pageModel = require('../models/mongo/page');
const artistaModel = require('../models/mongo/artista');
const cancionModel = require('../models/mongo/cancion');
const albumModel = require('../models/mongo/album');
const grupoMusicalModel = require('../models/mongo/grupoMusical');
const managerModel = require('../models/mongo/manager');
const eventoModel = require('../models/mongo/evento');
const perfilDisqueraModel = require('../models/mongo/perfilDisquera');
const clienteModel = require('../models/mongo/cliente');

module.exports = {
  pageModel,
  artistaModel,
  cancionModel,
  albumModel,
  grupoMusical: grupoMusicalModel,
  managerModel,
  eventoModel,
  perfilDisqueraModel,
  clienteModel
};