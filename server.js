const express = require('express');
const path = require('path');
const {readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils');

// Helper method for generating unique ids
const { v4: uuidv4 } = require('uuid');

const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for a new UX/UI tip
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      noteId: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding note');
  }
});

app.delete('/api/notes/:noteId', (req, res) => {
  console.info(`${req.method} request received to delete note ${req.params.noteId}`);

  const noteId = req.params.noteId;

  readFromFile('./db/db.json').then((data) => {
    const notes = JSON.parse(data);
    const updatedNotes = notes.filter((note) => note.noteId !== noteId);

    writeToFile('./db/db.json', updatedNotes);
    res.json(`Note with ID ${noteId} deleted successfully 🚀`);
  });
});



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
