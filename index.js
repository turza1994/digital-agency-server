const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.je9oc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
    const serviceCollection = client.db("digital-agency").collection("services");
    const orderCollection = client.db("digital-agency").collection("orders");
    const reviewCollection = client.db("digital-agency").collection("reviews");
    const adminCollection = client.db("digital-agency").collection("adminEmail");
  
    app.get('/services', (req, res) => {
        serviceCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
    })

    app.get('/services/:id', (req, res) => {
        serviceCollection.find({ _id: ObjectID(`${req.params.id}`) })
        .toArray((err, items) => {
            console.log(items);
            res.send(items[0])
        })
    })

    app.post('/addService', (req, res) => {
        const newService = req.body;
        console.log('adding new service: ', newService)
        serviceCollection.insertOne(newService)
        .then(result => {
            console.log('inserted count', result.insertedCount, result);
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/reviews', (req, res) => {
        reviewCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
    })

    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        console.log('adding new service: ', newReview)
        reviewCollection.insertOne(newReview)
        .then(result => {
            console.log('inserted count', result.insertedCount, result);
            res.send(result.insertedCount > 0)
        })
    })

    app.delete('/deleteService/:id', (req, res) => {
        // console.log('delete this', id);
        const id = ObjectID(req.params.id);
        serviceCollection.findOneAndDelete({ _id: id })
        .then(documents =>{
            console.log(!!documents);
            res.send(!!documents.value)
        } )
    })

    app.get('/allOrders', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/orders/:email', (req, res) => {
        console.log(req.params.email);
        orderCollection.find({ userEmail: `${req.params.email}` })
        .toArray((err, items) => {
            res.send(items)
        })
    })
    
    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        console.log('adding new order: ', newOrder)
        orderCollection.insertOne(newOrder)
        .then(result => {
            console.log('inserted count', result.insertedCount, result);
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/addReview', (req, res) => {
        const review = req.body;
        console.log(review);
        reviewCollection.insertOne(review)
            .then((result) => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/adminEmail', (req, res) => {
        const email = req.body;
        adminCollection.insertOne(email)
            .then((result) => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, adminEmail) => {
                res.send(adminEmail.length > 0)
            })
    })

    app.patch('/update/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        orderCollection.updateOne({ _id: id },
            {
                $set: { status: req.body.status }
            })
            .then((result) => {
                res.send(result.modifiedCount > 0)
            })
    })

    app.delete('/deleteService/:id', (req, res) => {
        // console.log('delete this', id);
        const id = ObjectID(req.params.id);
        serviceCollection.findOneAndDelete({ _id: id })
        .then(documents =>{
            console.log(!!documents);
            res.send(!!documents.value)
        } )
    })

//   client.close();
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})