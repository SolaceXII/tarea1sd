const express = require('express');
const responseTime = require("response-time");
const redis = require('redis');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;
const cors = require('cors');
const client = redis.createClient();

const urlMongoDB = 'mongodb://localhost:27017';
const nombreBaseDeDatos = 'vct';
const nombreColeccion = 'stats';

app.use(express.json());
app.use(responseTime());
app.use(cors());

async function obtenerTodosLosDatos() {
    const cliente = new MongoClient(urlMongoDB);
    try {
      await cliente.connect();
      const baseDeDatos = cliente.db(nombreBaseDeDatos);
      const coleccion = baseDeDatos.collection(nombreColeccion);
      const resultados = await coleccion.find({}).toArray();
      return resultados;
    } finally {
      await cliente.close();
    }
}

async function obtenerDatosPorAtributo(atributo, valor) {
    const cliente = new MongoClient(urlMongoDB);
    try {
      await cliente.connect();
      const baseDeDatos = cliente.db(nombreBaseDeDatos);
      const coleccion = baseDeDatos.collection(nombreColeccion);
      const filtro = { [atributo]: valor };
      const resultados = await coleccion.find(filtro).toArray();
      return resultados;
    } finally {
      await cliente.close();
    }
  }

app.get('/api/stats', async (req, res) => {

    try{    

        const datos = await obtenerTodosLosDatos();
        res.json(datos);

    }catch(error){

        console.error('Error al obtener los datos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/api/stats/filter', async (req, res) => {
    const atributo = req.query.atributo;
    const valor = req.query.valor;
  
    if (!atributo || !valor) {
      return res.status(400).json({ error: 'Se requieren los parámetros "atributo" y "valor" en la consulta' });
    }
  
    try {
      const datos = await obtenerDatosPorAtributo(atributo, valor);
      res.json(datos);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });


app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});