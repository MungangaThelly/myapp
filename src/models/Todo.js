// Importera Mongoose
const mongoose = require('mongoose');

// Skapa en Mongoose-schema för TODO
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],  // Titel är obligatorisk
    trim: true  // Trimma eventuella extra mellanslag
  },
  completed: {
    type: Boolean,
    default: false  // Standardvärde för completed är false
  }
}, {
  timestamps: true // Skapa automatiskt `createdAt` och `updatedAt` fält
});

// Skapa en modell baserat på schema
const Todo = mongoose.model('Todo', todoSchema);

// Exportera modellen så att vi kan använda den i andra filer
module.exports = Todo;
