const express = require('express')
const app = express()
const dotenv = require("dotenv")
const cors = require("cors")
const mongoose = require("mongoose")

dotenv.config()
const port = process.env.PORT
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://admin-richard:Qr731006.@atlascluster.0iwigdk.mongodb.net/CVcontacts")

const postSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
})

const Post = mongoose.model("Post", postSchema)


app.get("/", function (req, res) {
  res.send("Hello world")
})

app.post("/information", function (req, res) {
  const body = req.body

  const post = new Post({
    name: body.name,
    email: body.email,
    message: body.message
  })
  post.save(function (err) {

  })
  // console.log(body)
  // res.json(body)
})

app.listen(parseInt(port), () => {
  console.log(`Example app listening on port ${parseInt(port)}`)
})