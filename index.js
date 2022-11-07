const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7czv3fq.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
 try{
    const serviceCollection = client.db('shathysKitchen').collection('services');

    app.get('/', async (req, res) => {
        const query = {}
        const cursor = serviceCollection.find(query);
        const limitServices = await cursor.limit(3).toArray();
        res.send(limitServices);
    });
    
    app.get('/services', async (req, res) => {
        const query = {}
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
    });


 }
 finally{

 }
}
run().catch(err => console.error(err));
app.get('/', (req, res) => {
    res.send('Shathys kitchen server is running')
})

app.listen(port, () => {
    console.log(` Shathys kitchen server running on: ${port}`);
})
