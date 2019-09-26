const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/file/add', (req, res) => {
    const newClient = req.body.clientObj;
    fs.appendFileSync('client.json', newClient);
    res.status(200).json({success:'ok'})
}); 

app.listen(5000, () => console.log("5000 you in this port now"));

