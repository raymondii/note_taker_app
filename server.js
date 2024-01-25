const express = require("express");
const fs = require("fs");
const path = require("path");
const shortid = require("shortid");

const app = express();
const PORT = 3333;

// Middleware for parsing JSON in the request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static("public"));

// API Routes

// Read notes from the db.json file
app.get("/api/notes", (req, res) => {
  const notes = getNotes();
  res.json(notes);
});

// Save a new note to the db.json file
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = shortid.generate();

  const notes = getNotes();
  notes.push(newNote);

  saveNotes(notes);

  res.json(newNote);
});

// Delete a note from the db.json file
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;

  let notes = getNotes();
  notes = notes.filter((note) => note.id !== noteId);

  saveNotes(notes);

  res.json({ success: true });
});

// HTML Routes

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Develop", "public", "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "Develop", "public", "notes.html"));
});

// Helper functions

function getNotes() {
  const data = fs.readFileSync(path.join(__dirname, "Develop", "db", "db.json"), "utf-8");
  return JSON.parse(data) || [];
}

function saveNotes(notes) {
  fs.writeFileSync(path.join(__dirname, "Develop", "db", "db.json"), JSON.stringify(notes, null, 2), "utf-8");
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
