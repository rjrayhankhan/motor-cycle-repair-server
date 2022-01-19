const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4oyrt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('images'));
app.use(fileUpload());

const port = process.env.PORT || 5000;


app.get('/', (req, res) => {
    res.send('hello from db it is working')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const reviewCollection = client.db("motorCycle").collection("review");
    const userCollection = client.db("motorCycle").collection("allUser");
    const serviceCollection = client.db("motorCycle").collection("service");
    const adminCollection = client.db("motorCycle").collection("admin"); 
    const servicesCollection = client.db("motorCycle").collection("services");
    
    app.post('/addReview', (req, res) => {
        const review = req.body;

        reviewCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
    
    app.post('/addUser', (req, res) => {
        const review = req.body;

        userCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
    
    app.post('/service', (req, res) => {
        const allService = req.body;

        serviceCollection.insertOne(allService)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
    
    app.post('/admin', (req, res) => {
        const admin = req.body;

        adminCollection.insertOne(admin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
    
    app.post('/addServices', (req, res) => {
        const file = req.files.file;
        const services = req.body;
        console.log(file, services)
        file.mv(`${__dirname}/images/${file.name}`, err => {
            if(err){
                console.log(err);
                return res.status(500).send({msg: 'Failed to upload image'});
            }
            return res.send({name: file.name, path: `/${file.name}`})
        });

        servicesCollection.insertOne()
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/getReview', (req, res) => {
        reviewCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    });

    app.get('/getUser/:token', (req, res) => {
        userCollection.find({token: req.params.token})
        .toArray((err, documents) => {
            res.send(documents)
        })
    });

    app.get('/getService', (req, res) => {
        serviceCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    });

    app.get('/getAdmin', (req, res) => {
        adminCollection.find({})
        .toArray((err, documents) => { 
            res.send(documents[0]) 
        })
    });

 });

   


app.listen(port, () => console.log('listening song on port 5000'))