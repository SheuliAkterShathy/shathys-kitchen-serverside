const express = require('express');
const cors = require('cors');
 const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7czv3fq.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({message: 'Unauthorized access'});
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
        if(err){
            return res.status(403).send({message: 'Forbidden access'});
        }
        req.decoded = decoded;
        next();
    })
}

async function run(){
 try{
    const serviceCollection = client.db('shathysKitchen').collection('services');
    const reviewCollection = client.db('shathysKitchen').collection('reviews');

    app.post('/jwt', (req, res) =>{
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d'})
        res.send({token})
    })  


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

    app.post('/services',  async (req, res) => {
        const addService = req.body;
        const result = await serviceCollection.insertOne(addService);
        res.send(result);
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
    app.get('/reviews/:email', async (req, res) => {
        const email= req.query.email;
        const query = { email:email };
        console.log(query)
        const reviews = await reviewCollection.find(query).toArray();
        res.send(reviews);
    });

    app.get('/reviews', verifyJWT, async (req, res) => {

        const decoded = req.decoded;
            
        if(decoded.email !== req.query.email){
            res.status(403).send({message: 'unauthorized access'})
        }
        let query = {};
        if (req.query.email) {
            query = {
                email: req.query.email
            }
        }
       
        const cursor = reviewCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
    });

    app.get('/review/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id)
        console.log('test')
        const query = { _id: ObjectId(id) };
        const user = await reviewCollection.findOne(query);
        res.send(user);
    })

    app.put('/review/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const user = req.body;
        const option = {upsert: true};
        const updatedUser = {
            $set: {
                customer: user.name,
             
                message: user.message
            }
        }
        const result = await reviewCollection.updateOne(filter, updatedUser, option);
        res.send(result);
    })

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
