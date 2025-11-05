const express = require('express')
const path = require ('path')
require('dotenv').config()
const mongoose = require ('mongoose');
mongoose.connect(process.env.DATABASE)


const Tree = require ("./models/tree.model")

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('✅ Server is running!');
});

app.get('/tree', async(req, res) => {
  const treeList = await Tree.find({})

	console.log(treeList)
})

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
})

