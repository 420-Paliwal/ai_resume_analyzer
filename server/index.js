const express = require("express")
const cors = require("cors")
const multer  = require('multer')
const upload = multer()


const app = express()
const port = 3000

app.get('/', (req,res)=>{
    return res.status(200).json({"message" : "Home Page"})
})

app.get('/test', (req, res)=>{
    return res. status(200).json({"message" : "Test Page"})
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})