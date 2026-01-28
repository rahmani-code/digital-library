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
  const dataPath = path.join(__dirname, "data", "library.json");
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
};

app.use(express.static(path.join(__dirname, "public")));

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin", "adminPanel.html"));
});

app.get("/api/books/:id", (req, res) => {
  const bookId = req.params.id;
  const libraryData = getBooksData();
  const book = libraryData.books.find((b) => b.id === Number.parseInt(bookId));

  if (book) {
    res.json(book);
  } else {
    res.status(404).send("Book not found");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const bookRoutes = require("./routes/books");
app.use("/api/books", bookRoutes);

const userRoutes = require("./routes/users");
