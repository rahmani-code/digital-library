const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/books", require("./routes/books"));

// Data helper
const getBooksData = () => {
  const dataPath = path.join(__dirname, "data", "library.json");
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
};

// Admin page (matches your src/admin folder)
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "adminPanel.html"));
});

// If you still need a direct :id endpoint and it's NOT in routes/books.js:
app.get("/api/books/:id", (req, res) => {
  const bookId = Number.parseInt(req.params.id, 10);
  const libraryData = getBooksData();
  const book = libraryData.books.find((b) => b.id === bookId);

  if (!book) return res.status(404).send("Book not found");
  res.json(book);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
