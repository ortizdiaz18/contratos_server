const express = require('express');
const mysql = require('mysql2');
var bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT | 3000;
app.use(bodyParser.json());
app.use(cors());

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: process.env.HOST,  // Cambia esto a la dirección de tu base de datos
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

// Conexión a la base de datos
connection.connect(error => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

// Ruta para realizar consultas
app.get('/consultar', (req, res) => {
  connection.query('SELECT * FROM documentos', (error, results) => {
    if (error) {
      console.error('Error al realizar la consulta:', error);
      res.status(500).json({ error: 'Error al realizar la consulta' });
    } else {
      res.json({"documentos":results});
    }
  });
});

app.post('/insertar', function(req, res) {
  console.log(req.body);
  let {tecnico, id_transaccion, timestamp, url_documento, url_certificado, hash_documento, url_selfie, otp, servicio, tipo_transaccion} = req.body;
 

  connection.query('INSERT INTO documentos (TECNICO, ID_TRANSACCION,TIMESTAMP, URL_DOCUMENTO, URL_CERTIFICADO,HASH_DOCUMENTO,URL_SELFIE,CODIGO_OTP,NUM_SERVICIO,tipo_transaccion_ID_TIPO_TRANSACCION) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [tecnico, id_transaccion, timestamp, url_documento, url_certificado, hash_documento, url_selfie, otp, servicio, tipo_transaccion], function(error, result) {
    if (error) {
      console.error('Error al insertar datos:', error);
      res.status(500).json({ error: 'Error al insertar datos' });
    } else {
      res.json({ message: 'Datos insertados correctamente', insertedId: result.insertId });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

