const express = require('express');
      require('dotenv').config();

const {MongoClient,ServerApiVersion, ObjectId} = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
// middlewire
app.use(cors());
app.use(express.json());

//user: crudtester  pss : csOzBn8fqCvsGL7T



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
 try{
  await client.connect();

  const database = client.db('userdb');
  const userCollection = database.collection('users')

  
  app.get('/users', async(req,res)=>{
    const cursor= userCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  })

    app.get('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.findOne(query);
      res.send(result);
    })

  // const userCollection = clientdb('userdb').collection('users');

  app.post('/users', async(req,res) =>{
    console.log('data in the server ', req.body)
    const newUser = req.body;
    const result = await userCollection.insertOne(newUser)
    res.send(result);
  })

  app.put('/users/:id', async(req,res) =>{
    const id = req.params.id;
    const filter = {_id : new ObjectId(id)}
    const user = req.body;

    const updateDoc = {
      $set: {
        name: user.name,
        email: user.email
      }
    }
    const options = {upsert: true};
    console.log(user)

    const result = await userCollection.updateOne(filter,updateDoc,options);
    res.send(result);
  
  })

  app.delete('/users/:_id', async(req,res) => {
    
    const id = req.params._id
    const query = {_id : new ObjectId(id)}
    const result = await userCollection.deleteOne(query);
    res.send(result);
  })


//   await client.db('admin').command({ping: 1});
//   console.log("Pinged your deployment. You successfully connected to MongoDB!");
 }finally{

 }
}

run().catch(console.dir)


app.get('/',(req,res)=>{
    res.send('Simple crud Server Running')
});
app.listen(port, ()=>{
    console.log('simiple crude server running')
});