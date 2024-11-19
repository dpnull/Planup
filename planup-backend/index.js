require("dotenv").config();
console.log("API Key:", process.env.OPENAI_API_KEY);

const express = require("express");
const mongoose = require("mongoose");

// get routes
const userRoutes = require("./routes/users");
const gpt3Routes = require("./routes/gpt3Routes"); // route handler

const app = express();
const port = process.env.PORT || 3000; // using process.env.PORT to make things easier
const cors = require("cors"); // cors middleware with default options to allow all cross-origin requests

app.use(cors());

app.use(express.json());

// unsafe to keep it here but .env didnt work for me
mongoose.connect("mongodb+srv://dpnull:dpnull@planup.tsmspxr.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// testing route
app.get("/", (res) => {
  res.send("Hello from Planup backend!");
});

// get task model
const Task = require("./models/taskModel");

// endpoint for task
app.post("/tasks", async (req, res) => {
  try {
    const newTask = new Task(req.body); // request body directly mapped to schema
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.use("/users", userRoutes);

app.use("/gpt3", gpt3Routes);

// start
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
