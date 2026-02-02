const express = require("express");
const cors = require("cors");
const pdfParse = require("pdf-parse");

const multer  = require('multer');
const storage = multer.memoryStorage();

const upload = multer({
    storage : storage
});

const app = express()
const port = 3000

app.get('/', (req,res)=>{
    return res.status(200).json({"message" : "Home Page"})
})

app.get('/test', (req, res)=>{
    return res. status(200).json({"message" : "Test Page"})
})

app.post('/upload', 
    upload.single("resume"),
    async (req, res)=>{
        try{
            if(!req.file){
                return res.status(400).json({
                    error : "NO file uploaded"
                })
            }
            const data = await pdfParse(req.file.buffer)
            res.status(200).json({ text : data.text})
        }catch(err){
            console.log(err)
            return res.status(400).json({
                error : err})
        }
})


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})