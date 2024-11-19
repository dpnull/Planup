const mongoose = require("mongoose");

// defines schema for a task
const taskSchema = new mongoose.Schema({
  name: String,
  description: String,
  dueDate: Date,
});

// our constructor
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
