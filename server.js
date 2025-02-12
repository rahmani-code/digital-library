const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5002;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/api/users", require("./routes/users"));

const getBooksData = () => {
  const dataPath = path.join(__dirname, "data", "library.json"); // Path to your JSON file
  const data = fs.readFileSync(dataPath); // Read the JSON file synchronously
  return JSON.parse(data); // Parse the JSON data and return it
};

app.use(express.static(path.join(__dirname, "public")));

// Route to serve the admin panel
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin", "adminPanel.html"));
});

// routes
app.get("/api/books/:id", (req, res) => {
  const bookId = req.params.id;
  const libraryData = getBooksData(); // Read the data from the JSON file
  const book = libraryData.books.find((b) => b.id === Number.parseInt(bookId)); // Find book by ID

  if (book) {
    // console.log(book); // Log the book data to the terminal
    res.json(book); // Return the selected book
  } else {
    res.status(404).send("Book not found");
  }
});
// Start the server

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const bookRoutes = require("./routes/books");
app.use("/api/books", bookRoutes);

const userRoutes = require("./routes/users");
