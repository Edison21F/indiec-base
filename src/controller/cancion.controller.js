const orm = require('../Database/dataBase.orm');
const sql = require('../Database/dataBase.sql');
const mongo = require('../Database/dataBaseMongose');


const cancionCtl = {};

// Obtener todas las canciones
cancionCtl.obtenerCanciones = async (req, res) => {
    try {
        const [listaCanciones] = await sql.promise().query(`
            select * from canciones
        `);

        const cancionesCompletas = await Promise.all(
            listaCanciones.map(async (cancion) => {
                const cancionMongo = await mongo.cancionModel.findOne({ 
                    idCancionSql: cancion.idCancion 
                });
                return {
                    ...cancion,
                    detallesMongo: cancionMongo
                };
            })
        );

        return res.apiResponse(cancionesCompletas, 200, 'Canciones obtenidas exitosamente');
    } catch (error) {
        console.error('Error al obtener canciones:', error);
        return res.apiError('Error interno del servidor', 500);
    }
};

// Crear nueva canción
cancionCtl.crearCancion = async (req, res) => {
    try {
        const { titulo, album, año, duracion, genero, artistaIdArtista, albumeIdAlbum } = req.body;

        // Crear en SQL
        const datosSql = {
            titulo,
            album,
            año: parseInt(año),
            estado: 'activo',
            createCancion: new Date().toLocaleString(),
            artistaIdArtista,
            albumeIdAlbum
        };

        const nuevaCancion = await orm.cancion.create(datosSql);
        const idCancion = nuevaCancion.idCancion;

        // Crear en MongoDB
        const datosMongo = {
            duracion,
            genero,
            imagen: req.files?.imagen?.name || null,
            idCancionSql: idCancion,
            createCancionMongo: new Date().toLocaleString()
        };

        await mongo.cancionModel.create(datosMongo);

        return res.apiResponse(
            { idCancion }, 
            201, 
            'Canción creada exitosamente'
        );

    } catch (error) {
        console.error('Error al crear canción:', error);
        return res.apiError('Error al crear la canción', 500);
    }
};

// Obtener canciones por artista
cancionCtl.obtenerCancionesPorArtista = async (req, res) => {
    try {
        const { artistaId } = req.params;

        const [canciones] = await sql.promise().query(
            
           );

        const cancionesCompletas = await Promise.all(
            canciones.map(async (cancion) => {
                const cancionMongo = await mongo.cancionModel.findOne({ 
                    idCancionSql: cancion.idCancion 
                });
                return {
                    ...cancion,
                    duracion: cancionMongo?.duracion || '',
                    genero: cancionMongo?.genero || '',
                    imagen: cancionMongo?.imagen || ''
                };
            })
        );

        return res.apiResponse(cancionesCompletas, 200, 'Canciones del artista obtenidas exitosamente');
    } catch (error) {
        console.error('Error al obtener canciones por artista:', error);
        return res.apiError('Error interno del servidor', 500);
    }
};

module.exports = cancionCtl;