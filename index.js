const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

async function run(){
 try{

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
