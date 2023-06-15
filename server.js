const express = require('express');
const path = require('path');
const uuid = require('uuid');
const fs = require("fs");
const app = express();
const port = 3000;

const staticOptions = {
    root: path.join(__dirname),
}

const aFile = require('db/db.json');


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// get notes returns HTML
app.get('/notes', (req, res) => res.sendFile('public/notes.html', staticOptions))
// get * returns index
app.get('/*', (req, res) => res.sendFile('public/index.html', staticOptions))


app.get('/api/notes', (req, res) => {
    res.send([
        {
            title: 'My cool note',
            text: 'Text',
            id: uuid.v4().toString(),
        }
        ]
    );
})
app.post('/api/notes', (req, res) => {
    console.log(req.body)
    res.send('ok');
})


app.listen(port, () => console.log(`The port ${port} is connected`));