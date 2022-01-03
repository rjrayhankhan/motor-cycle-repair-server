const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4oyrt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;


app.get('/', (req, res) => {
    res.send('hello from db it is working')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const reviewCollection = client.db("motorCycle").collection("review");
    
    app.post('/addReview', (req, res) => {
        const review = req.body;

        reviewCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/getReview', (req, res) => {
        reviewCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

 });




app.listen(process.env.PORT || port)