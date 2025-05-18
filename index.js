const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

// create app and port
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bghuk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // db name *& collection name
    const coffeeDB = client.db('coffeeDB');
    const coffeeCollection = coffeeDB.collection('coffeeCollection');
    
    // CoffeeDB database er moddhe arekta Collection create kora  of users
    // const userCollection of  coffeeDB  Database
    const userCollection =  coffeeDB.collection('userCollection')


    //Do here all CRUD works

    // Get all coffee
    app.get('/coffee', async (req, res) => {
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    });

    // Get a single coffee
    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // post a coffee  or Create a coffee 

    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // delete a coffee
    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // update a coffee
    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const updatedCoffee = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      //update doc
      const coffee = {
        $set: {
          name: updatedCoffee.name,
          supplier: updatedCoffee.supplier,
          quantity: updatedCoffee.quantity,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo,
          category: updatedCoffee.category,
          taste: updatedCoffee.taste,
        },
      };
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result);
    });


     // USer Related API

    // Create New User
    app.post('/users' ,  async(req, res) =>{
      const newUser =  req.body;
      console.log('CReating new user',   newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    } );

    // get all users
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });



    //DELETE a user

    app.delete('/users/:id', async (req, res) => { 
      
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // keep track when a user last logged in 
    // a user will log in . That mean , he has already a account
    // So, his  name,mail, info is already showing in user List
    // Our goal , when a user will Login, update the info of Last Login time
    // So, here we are updating info of a already existing data , So we will use PATCH

    // Update info of a user
    app.patch('/users' ,  async(req, res) =>{

      const email =  req.body?.email  ;
      const filter =  {email}

      const updatedDoc = {
        $set: {
          lastSignInTime : req.body?.lastSignInTime

        }
      }

      const result = await userCollection.updateOne(filter, updatedDoc) ; 
      res.send(result) ;

    } )











    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Coffee making server is running');
});

app.listen(port, () => {
  console.log(`Coffee making server is running on port ${port}`);
});
