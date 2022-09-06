const express = require('express')
const app = express()
const dotenv = require("dotenv")
const cors = require("cors")

dotenv.config()
const port = process.env.PORT
app.use(cors())
app.use(express.json())

app.get("/", function (req, res) {
  res.send("Hello world")
})

app.post("/information", function (req, res) {
  const body = req.body
  console.log(body)
  res.json(body)
})

app.listen(parseInt(port), () => {
  console.log(`Example app listening on port ${parseInt(port)}`)
})