const express = require("express");
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// X8t0XuAXrduuKvvC
app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://laptop_admin:X8t0XuAXrduuKvvC@cluster0.zixex.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 


async function run() {
    try {
        await client.connect();
        const productsCollection = client.db("laptop").collection("products")

        app.get("/products", async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })



        app.get("/orders", async (req, res) => {
            const email = req.query.email;
            const query = {email: email};
            const cursor = productsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query)
            res.send(result)
        })


        app.post('/addItem', async (req, res) => {
            const item = req.body
            const result = await productsCollection.insertOne(item);
            res.send(result)
        })


        app.put('/products/:id', async (req, res) => {
            const id = req.params.id
            const updatedStock = req.body
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDocument = {
                $set: updatedStock
            };
            const result = await productsCollection.updateOne(filter, updateDocument, options)
        
            res.send(result)
        
        })



    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("LAPTOP SERVER SIDE!");
  });
  
  app.listen(port, () => {
    console.log(`Laptop listening on port ${port}`);
  });