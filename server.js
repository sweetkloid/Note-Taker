const express = require('express');
const path = require('path');
const {readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils');

// Helper method for generating unique ids
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
//Get route to notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
 
//displaying all notes
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

//displaying note on click
app.get('/api/notes/:noteId', (req, res) => {
  console.info(`${req.method} request received for notes`);

  readFromFile('./db/db.json').then((data) => {
    const notes = JSON.parse(data);

    if (req.params.noteId) {
      // If a noteId is specified, find the note with that ID
      const note = notes.find((note) => note.noteId === req.params.noteId);
      res.json(note);
    } else {
      // If no noteId is specified, return all notes
      res.json(notes);
    }
  });
});


// adding new note
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding note');
  }
});

//deleting a note on click
app.delete('/api/notes/:id', (req, res) => {
  console.info(`${req.method} request received to delete note ${req.params.id}`);

  const notesId = req.params.id;

  readFromFile('./db/db.json').then((data) => {
    const notes = JSON.parse(data);
    const updatedNotes = notes.filter((note) => note.id !== notesId);
    console.log(notesId);
    writeToFile('./db/db.json', updatedNotes);
    res.json(`Note with ID ${notesId} deleted successfully 🚀`);
  });
});


//exporting to port
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
