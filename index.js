// Importera nödvändiga bibliotek
require('dotenv').config();  // Ladda miljövariabler
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Använd JSON middleware för att läsa JSON-data i request body
app.use(express.json());

// Databasanslutning (MongoDB)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Skapa en Mongoose-modell för TODO
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});
const Todo = mongoose.model('Todo', todoSchema);

// GET-rutt: Hämta alla TODO-poster
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find(); // Hämta alla TODO-poster från databasen
    res.json(todos);  // Skicka tillbaka dem som JSON
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve todos' });
  }
});

// GET-rutt: Hämta en specifik TODO-poster baserat på ID
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id); // Hämta TODO-posten med given ID
    if (!todo) {
      return res.status(404).json({ error: 'TODO not found' });  // Hantera om TODO inte hittades
    }
    res.json(todo);  // Skicka tillbaka TODO-posten
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve todo' });
  }
});

// POST-rutt: Skapa en ny TODO-poster
app.post('/todos', async (req, res) => {
  try {
    const { title, completed } = req.body;

    // Validera om "title" är skickad
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTodo = new Todo({
      title,
      completed: completed || false  // Om completed inte är skickat, sätt som false
    });

    await newTodo.save();  // Spara den nya TODO-posten i databasen
    res.status(201).json(newTodo);  // Skicka tillbaka den nyskapade TODO-posten
  } catch (err) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// GET: Hämta alla TODO-poster, inklusive de som är raderade
app.get('/todos/all', async (req, res) => {
    try {
      const todos = await Todo.find();  // Hämta alla, oavsett om de är raderade
      res.json(todos);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve todos' });
    }
  });
  

// DELETE-rutt: Ta bort en TODO-poster baserat på ID
app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);  // Ta bort TODO-posten

    if (!todo) {
      return res.status(404).json({ error: 'TODO not found' });
    }

    res.status(200).json({ message: 'TODO deleted' });  // Bekräfta att TODO-posten är borttagen
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Starta servern och lyssna på rätt port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
