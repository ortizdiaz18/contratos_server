const express = require('express');
const mysql = require('mysql2');
var bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT | 3000;
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: process.env.HOST,  // Cambia esto a la dirección de tu base de datos
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port:process.env.PORT
});

// Conexión a la base de datos
connection.connect(error => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});
app.get('/', (req, res) => {
 
          res.json({"message":"Esta ruta esta en desuso"});
    
});

// Ruta para realizar consultas

app.get('/pendientes', (req, res) => {
  connection.query('SELECT * FROM documentos WHERE ESTADO_APROBACION IS NULL', (error, results) => {
    if (error) {
      console.error('Error al realizar la consulta:', error);
      res.status(500).json({ error: 'Error al realizar la consulta' });
    } else {
      res.json({"documentos":results});
    }
  });
});
app.get('/aprobados', (req, res) => {
  connection.query('SELECT * FROM documentos WHERE ESTADO_APROBACION = 1 ', (error, results) => {
    if (error) {
      console.error('Error al realizar la consulta:', error);
      res.status(500).json({ error: 'Error al realizar la consulta' });
    } else {
      res.json({"documentos":results});
    }
  });
});

app.get('/rechazados', (req, res) => {
  connection.query('SELECT * FROM documentos WHERE ESTADO_APROBACION = 0 ', (error, results) => {
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
  let {tecnico,titular, id_transaccion, timestamp, url_documento, url_certificado, hash_documento, url_selfie, otp, servicio, tipo_transaccion} = req.body;
 

  connection.query('INSERT INTO documentos (TECNICO,TITULAR, ID_TRANSACCION,TIMESTAMP, URL_DOCUMENTO, URL_CERTIFICADO,HASH_DOCUMENTO,URL_SELFIE,CODIGO_OTP,NUM_SERVICIO,tipo_transaccion_ID_TIPO_TRANSACCION) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [tecnico, titular,id_transaccion, timestamp, url_documento, url_certificado, hash_documento, url_selfie, otp, servicio, tipo_transaccion], function(error, result) {
    if (error) {
      console.error('Error al insertar datos:', error);
      res.status(500).json({ error: 'Error al insertar datos' });
    } else {
      res.json({ message: 'Datos insertados correctamente', insertedId: result.insertId });
    }
  });
});

app.put('/actualizar/:id', (req, res) => {
  const id = req.params.id;
  const { estado, comentarios } = req.body;

if(estado && comentarios){
  connection.query(
    `UPDATE documentos SET ESTADO_APROBACION = ${estado}, COMENTARIOS = "${comentarios}" WHERE  ID_TRANSACCION= "${id}"`,
    [estado,comentarios, id],
    (error, result) => {
      if (error) {
        console.error('Error al actualizar datos:', error);
        res.status(500).json({ error: 'Error al actualizar datos' });
      } else {
        res.json({ message: 'Datos actualizados correctamente' });
      }
    }
  );
  
}else{
  connection.query(
    `UPDATE documentos SET ESTADO_APROBACION = ${estado} WHERE  ID_TRANSACCION= "${id}"`,
    [estado, id],
    (error, result) => {
      if (error) {
        console.error('Error al actualizar datos:', error);
        res.status(500).json({ error: 'Error al actualizar datos' });
      } else {
        res.json({ message: 'Datos actualizados correctamente' });
      }
    }
  );

}
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

