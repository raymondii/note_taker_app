const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle JSON data
app.use(express.json());

// Database file path
const dbFilePath = path.join(__dirname, 'db.json');

// Serve static files (HTML, CSS, JS, etc.)
app.use(express.static('public'));

// HTML routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'Develop', 'public', 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Develop', 'public', 'index.html'));
});

// API routes
app.get('/api/notes', (req, res) => {
  // Read the notes from the db.json file and return as JSON
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  // Read existing notes from the db.json file
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const notes = JSON.parse(data);

    // Give each note a unique id
    newNote.id = Date.now().toString();

    // Add the new note to the existing notes
    notes.push(newNote);

    // Write the updated notes back to the db.json file
    fs.writeFile(dbFilePath, JSON.stringify(notes), (writeErr) => {
      if (writeErr) {
        res.status(500).json({ error: writeErr.message });
        return;
      }
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  // Read existing notes from the db.json file
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const notes = JSON.parse(data);

    // Remove the note with the given id
    const updatedNotes = notes.filter((note) => note.id !== noteId);

    // Write the updated notes back to the db.json file
    fs.writeFile(dbFilePath, JSON.stringify(updatedNotes), (writeErr) => {
      if (writeErr) {
        res.status(500).json({ error: writeErr.message });
        return;
      }
      res.json({ success: true, message: 'Note deleted successfully' });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
