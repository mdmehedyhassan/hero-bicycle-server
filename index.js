const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tnvy9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
  res.send("hello from db it's working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("heroBicycle").collection("products");
  app.post('/services', (req, res) => {
    const services = req.body;
    servicesCollection.insertOne(services)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/addAdmin', (req, res) => {
    const email = req.body.email;
    console.log(email);

  })


  app.post('/addService', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const description = req.body.description;
    console.log(name, description, file);
    file.mv(`${__dirname}/services/${file.name}`, err => {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: 'Failed to upload image' })
      }
      return res.send({ name: file.name, path: `/${file.name}` })
    })
  })


});

app.listen(process.env.PORT || port)