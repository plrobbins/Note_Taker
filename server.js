const express = require('express');
const path = require('path');
const fs = require("fs");
const crypto = require("crypto");
const util = require("util");

//Express App
const app = express();
const PORT = process.env.PORT || 5000;

//Set up Express app
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

//Read the JSON file
let savedNotesGlobal = util.promisify(fs.readFile)
function getSavedNotes() {
    console.log("Saved Notes", savedNotesGlobal("./db/db.json", "utf8"))
    return savedNotes = savedNotesGlobal("./db/db.json", "utf8")
};

//Read JSON file and return saved notes
app.get("/api/notes", (req, res) => {
    getSavedNotes() 
      .then((savedNotes) => {  
      res.send(JSON.parse(savedNotes))})  
      .catch((err) => res.status(500).json(err)); 
    });

app.post("/api/notes", (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8")); 
  let id = crypto.randomBytes(16).toString("hex");  
  let newNote = {  
    title: req.body.title,
    text: req.body.text, 
    id: id,
  }
  console.log("newNote:", newNote)

savedNotes.push(newNote);

//writes new notes to db,json
fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes), (err) => {
    if (err) throw err;
    console.log("error");
});
console.log("A new note has been written");
return res.json(savedNotes);
});

//Delete a note
app.delete("/api/notes/:id", (req, res) => {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8")); 
    let noteID = savedNotes.filter(x=>x.id!=req.params.id)  
    console.log("NOTE ID", noteID)
    console.log("REQ.PARAMS.ID", req.params.id)
  
    // writes all new notes to db.json
    fs.writeFileSync("./db/db.json", JSON.stringify(noteID), (err) => {
      if (err) throw err; 
      console.log("error");
    });
      console.log("Your note has been deleted");
      return res.json(savedNotes);
  });

  // returns notes.html file
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });
  
  // returns index.html file
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  });
  
  // Starts the server to begin listening
  app.listen(PORT, () => {
    console.log('App listening on PORT: ' + PORT);
  });