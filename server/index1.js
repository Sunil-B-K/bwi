const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

const uri =
  "mongodb+srv://sunilkuligod21:8olFzpfCktKAG0nh@cluster0.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  if (err) throw err;
});

app.post("/register", (req, res) => {
  const data = req.body;
  const collection = client.db("test").collection("devices");

  collection.insertOne(data, (err, result) => {
    if (err) {
      console.log("Error inserting data: ", err);
      res.status(500).send(error);
    } else {
      console.log("Data inserted successfully: ", result.insertedCount);
      res.status(200).send(result.ops[0]);
    }
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
