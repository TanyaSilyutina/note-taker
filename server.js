const express = require('express');
const path = require('path');
const uuid = require('uuid');
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

const staticOptions = {
    root: path.join(__dirname),
}

const notes_db = require('./db/db.json');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// get notes returns HTML
app.get('/notes', (req, res) => res.sendFile('/public/notes.html', staticOptions));

app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        const notes = JSON.parse(data);
        res.json(notes);
    });
})

app.post('/api/notes', (req, res) => {
    const note = {
        id: uuid.v4(),
        title: req.body.title,
        text: req.body.text
    };

    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        const notes = JSON.parse(data);
        notes.push(note);

        fs.writeFile("./db/db.json", JSON.stringify(notes,null,4),(err)=> {
            if (err) {
                return res.status(500).json({
                    msg:"error writing to db"
                })
            } else {
                return res.json(notes);
            }
        })
    });
});

app.delete('/api/notes/:id', function(req, res) {
    notes_db.splice(req.params.id, 1);
    update_db(notes_db);
    res.json(notes_db);
})

function update_db(notes) {
    fs.writeFile('db/db.json', JSON.stringify(notes, null), (err) => {
        if (err) throw err;
        return true;
    })}

app.get('/api/notes/:id', function(req, res) {
    res.json(notes_db[req.params.id]);
})

app.get('/', (req, res) => res.sendFile('/public/index.html', staticOptions))

app.listen(port, () => console.log(`The port ${port} is connected`));