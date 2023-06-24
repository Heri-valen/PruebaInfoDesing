/* jshint esversion: 8 */
const express = require('express');
const app = express();
const sql = require('mssql');
const cors = require('cors'); // Importa el middleware CORS

// Configuración de la conexión a la base de datos
const dbConfig = {
  user: 'info',
  password: '1022Heri**',
  server: 'infodesaing.database.windows.net',
  database: 'Info',
  options: {
    encrypt: true, // Si estás utilizando Azure, establece esto en true
  },
};
 
// Middleware para habilitar CORS
app.use(cors());

async function testConnection() {
    try {
      // Conexión a la base de datos
      await sql.connect(dbConfig);
      console.log('Conexión exitosa a la base de datos.');
  
      // Realiza alguna operación de prueba, como una consulta simple
      const result = await sql.query('SELECT 1 AS Test');
      console.log('Resultado de la consulta:', result.recordset);
  
      // Cierra la conexión a la base de datos
      await sql.close();
      console.log('Conexión cerrada correctamente.');
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
    }
  }
  
  // Ejecuta la función de prueba de conexión
  testConnection();

// Ruta para obtener los datos según la opción y las fechas proporcionadas
app.get('/historicos', async (req, res) => {
  const { opcion, fechaInicial, fechaFinal } = req.query;

  try {
    // Conexión a la base de datos
    await sql.connect(dbConfig);

    // Consulta al procedimiento almacenado según la opción y las fechas
    const result = await sql.query(
      `EXEC ObtenerHistoricoConsumos @FechaInicial = '${fechaInicial}', @FechaFinal = '${fechaFinal}', @Opcion = ${opcion}`
    );

    // Envío de los resultados como respuesta
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos históricos.' });
  } finally {
    // Cierre de la conexión a la base de datos
    await sql.close();
  }
});

// Puerto en el que se ejecutará el servidor
const port = 3000;

// Inicio del servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});