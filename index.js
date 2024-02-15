const express = require('express');
const rounter = require('./rounter.js');
const app = express();

app.use(express.static('public'));

app.use(rounter)

app.listen(8080,()=>{
    console.log("Start server at port 8080.Run in http://localhost:8080/");
})