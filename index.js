const express = require('express');
var cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://art-craft-b287c.web.app',
  ]
}));
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4zosjqm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const craftCollection = client.db("craftDB").collection("craft");
    const newCollection = client.db("craftDB").collection("categories");
    // data show
    app.get('/craft',async(req,res)=>{
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    // ditels
    app.get('/craft/:id',async(req,res)=>{
      const id=req.params.id;
      const quary = {_id:new ObjectId(id)}
      const cursor = craftCollection.findOne(quary);
      const result = await cursor;
      res.send(result)
    })
    // only email listed data
    app.get('/crafts/:email',async(req,res)=>{
      // console.log(req.params.email)
      const result = await craftCollection.find({email:req.params.email}).toArray();
      res.send(result)
    })
    // update data
    app.get('/craftss/:id',async(req,res)=>{
      const id=req.params.id;
      // console.log(id)
      const quary = {_id:new ObjectId(id)}
      const cursor = craftCollection.findOne(quary);
      const result = await cursor;
      res.send(result)
    })
    app.post('/craft',async(req, res)=>{
      const infoCraft=req.body;
      // console.log(infoCraft)
      const result = await craftCollection.insertOne(infoCraft);
      res.send(result)
    })
    // updated data
    app.put('/updatesinfo/:id',async(req,res)=>{
      const id=req.params.id;
      console.log(id)
      const quary = {_id:new ObjectId(id)}
      const options = { upsert: true };
      const data= req.body;
      const updata ={
        $set:{
          item_name:data.item_name,
          subcategory_Name:data.subcategory_Name,
          short_description:data.short_description,
          photoURL:data.photoURL,
          price:data.price,
          rating:data.rating,
          customization:data.customization,
          processing_time:data.processing_timee,
          srock_status:data.srock_status

        }
      }
      const result= await craftCollection.updateOne(quary,updata,options)
      console.log(result)
      res.send(result)
    })
    app.delete('/delete/:id',async(req,res)=>{
      const id= req.params.id;
      const quary = {_id:new ObjectId(id)}
      const result = await craftCollection.deleteOne(quary)
      res.send(result)
    })
    app.get('/categories',async(req,res)=>{
      const cursor = newCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/categoriess/:subcategory_Names',async(req,res)=>{
      // console.log(req.params.email)
      const result = await craftCollection.find({subcategory_Name:req.params.subcategory_Names}).toArray();
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Server is Running')
  })
  
  app.listen(port, () => {
    console.log(`Server is Running on port ${port}`)
  })