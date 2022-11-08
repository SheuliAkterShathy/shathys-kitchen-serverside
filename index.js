const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7czv3fq.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
 try{
    const serviceCollection = client.db('shathysKitchen').collection('services');
    const reviewCollection = client.db('shathysKitchen').collection('reviews');


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

    app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const service = await serviceCollection.findOne(query);
        res.send(service);
    });

    // reviews

    app.post('/reviews',  async (req, res) => {
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        res.send(result);
    });

    app.get('/reviews/:id', async (req, res) => {
        const id = req.params.id;
        const query = { service:id };
        const reviews = await reviewCollection.find(query).toArray();
        res.send(reviews);
    });
    // app.get('/reviews/:email', async (req, res) => {
    //     const email= req.query.email;
    //     const query = { email:email };
    //     console.log(query)
    //     const reviews = await reviewCollection.find(query).toArray();
    //     res.send(reviews);
    // });

    app.get('/reviews', async (req, res) => {
        let query = {};
        if (req.query.email) {
            query = {
                email: req.query.email
            }
        }
        console.log(query)
        const cursor = reviewCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
    });

    app.delete('/reviews/:id',  async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await reviewCollection.deleteOne(query);
        res.send(result);
    })

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
