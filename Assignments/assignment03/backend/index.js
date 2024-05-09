// Author: Bella Singh
// ISU Netid: bellas23
// Date: April 23rd, 2024

var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const port = "8082";
const host = "localhost";
const { MongoClient } = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
const dbName = "reactdata";
const client = new MongoClient(url);
const db = client.db(dbName);

//verify connection
app.listen(port, () => {
    console.log("App listening at http://%s:%s/catalog", host, port);
});

//Read - get product list
app.get("/catalog", async (req, res) => {
    try {
        const results = await db.collection("fakestore_catalog").find({}).toArray();
        console.log("Success in Reading MongoDB");
        res.status(200).send(results); // Send the results as the response
    } catch (err) {
        console.error("Error in Reading MongoDB:", err);
        res.status(500).send({ error: 'An error occurred while fetching items.' });
    }
});

//Read - get one product
app.get("/catalog/:id", async (req, res) => {
    const productid = Number(req.params.id);
    console.log("product to find: ", productid);
    await client.connect();
    console.log("Node connected successfully to GET-id MongoDB");
    const query = { "id": productid };
    const results = await db.collection("fakestore_catalog").findOne(query);
    console.log("Results: ", results);
    if (!results) res.status(404).send("Not Found");
    else res.status(200).send(results);
});

//POST a product
app.post("/catalog/", async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            const msg = "POST:Bad request: No data provided.";
            console.log(msg);
            return res.status(400).send({ error: msg });
        }
        const itemId = req.body.id;
        const productExists = await db.collection("fakestore_catalog").findOne({ id: itemId });
        if (productExists) {
            // Item exists
            const msg = "POST: Item already exists";
            console.log(msg);
            return res.status(409).send({ error: msg });
        }
        const { id, title, price, description, category, image, rating } = req.body;
        await db.collection("fakestore_catalog").insertOne({ id, title, price, description, category, image, rating });
        const msg = "POST:Success in Posting MongoDB";
        console.log(msg);
        return res.status(200).send({ success: msg });
    } catch (err) {
        const msg = "POST: An ERROR occurred in Post" + err;
        console.error(msg);
        res.status(500).send({ error: msg });
    }
});

// UPDATE a Product
app.put("/catalog/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { title, price, description, category, image, rating } = req.body;
        const filter = { id: id };
        const updateDoc = {
            $set: { title: title, price: price, description: description, category: category, image: image, rating: rating }
        };
        const options = { upsert: true };
        const result = await db.collection("fakestore_catalog").updateOne(filter, updateDoc, options);
        if (result.modifiedCount === 0) {
            throw new Error(`PUT: Item with ID ${id} not found.`);
        }
        console.log("Success in updating item: ", result.modifiedCount, " row(s) affected");
        res.status(200).send({ success: `Success in updating item: ${result.modifiedCount} row(s) affected` });
    } catch (err) {
        console.error("PUT: An error occurred in updating item: ", err);
        res.status(500).send({ error: `PUT: An error occurred in updating item: ${err.message}` });
    }
});

//DELETE a Product
app.delete("/catalog/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const deleteResult = await db.collection("fakestore_catalog").deleteOne({ id: id });
        if (deleteResult.deletedCount === 0) {
            throw new Error(`DELETE: Item with ID ${id} not found.`);
        }
        console.log("Success in DELETE item :", id);
        res.status(200).send({ success: `Success in deleting item with ID ${id}` });
    } catch (err) {
        console.error("DELETE: An error occurred in deleting item: ", err);
        res.status(500).send({ error: `DELETE: An error occurred in deleting item: ${err.message}` });
    }
});
