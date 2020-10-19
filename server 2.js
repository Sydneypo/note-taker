'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid').v4;

const app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    return res.json(JSON.parse(fs.readFileSync('./db/db.json', 'utf-8')));
});

app.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    notes.push({
        id: uuid(),
        title: req.body.title,
        text: req.body.text
    });
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(true);
});

app.delete('/api/notes/:id', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    const newNotes = notes.filter(note => note.id !== req.params.id);
    fs.writeFileSync('./db/db.json', JSON.stringify(newNotes));
    res.json(true);
});

app.get('*', (req, res) => {
    res.redirect('/');
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
