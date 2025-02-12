const express = require("express");
const fs = require("node:fs");
const router = express.Router();
const path = require("path");

const filePath = path.join(__dirname, "../data/library.json");

// const readData = () => JSON.parse(fs.readFileSync(filePath, "utf-8"));

const readBooksData = () => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return { books: [] }; // Return an empty array if there's an error
  }
};
const writeBooksData = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing data:", error);
  }
};

// get the books
router.get("/", (req, res) => {
  const books = readBooksData();
  res.json(books.books || []);
});

// Add new book
router.post("/", (req, res) => {
  const { title, author, genre, publishedYear, description } = req.body;
  console.log("Received data:", req.body); // Log the incoming data

  if (!title || !author || !genre || !publishedYear || !description) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const booksData = readBooksData();
  const newBook = {
    id: Date.now(),
    title,
    author,
    genre,
    publishedYear,
    description,
    borrowedBy: null,
    dueDate: null,
  };
  booksData.books = booksData.books || [];
  booksData.books.push(newBook);

  writeBooksData(booksData);
  res.status(201).json(newBook);
});

// update book
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, genre, publishedYear, description } = req.body;

  const booksData = readBooksData();
  if (!booksData.books) booksData.books = [];

  const book = booksData.books.find((b) => b.id === parseInt(id));

  if (!book) {
    return res.status(404).json({ error: "Book not found." });
  }

  // Update fields if provided
  if (title) book.title = title;
  if (author) book.author = author;
  if (isbn) book.isbn = isbn;
  if (genre) book.genre = genre;
  if (publishedYear) book.publishedYear = publishedYear;
  if (description) book.description = description;

  writeBooksData(booksData);
  res.json(book);
});

// delete book
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const booksData = readBooksData();
  const filteredBooks = booksData.books.filter((b) => b.id !== parseInt(id));

  if (booksData.books.length === filteredBooks.length) {
    return res.status(404).json({ error: "Book not found." });
  }

  booksData.books = filteredBooks;
  writeBooksData(booksData);
  res.status(204).send();
});

// Add this route to handle borrowing a book
router.post("/:id/borrow", (req, res) => {
  const { id } = req.params;
  const { user } = req.body; // Get the user from the request body

  const booksData = readBooksData();
  const book = booksData.books.find((b) => b.id === parseInt(id));

  if (!book) {
    return res.status(404).json({ error: "Book not found." });
  }

  if (book.borrowedBy) {
    return res.status(400).json({ error: "Book is already borrowed." });
  }

  // Update the book's borrowedBy and calculate the dueDate (2 weeks from now)
  book.borrowedBy = user;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // Set due date to 14 days from now
  book.dueDate = dueDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD

  writeBooksData(booksData); // Write the updated data back to the file
  res.status(200).json(book); // Return the updated book
});

router.post("/:id/return", (req, res) => {
  const { id } = req.params;
  const { user } = req.body; // Get the user from the request body

  const booksData = readBooksData();
  const book = booksData.books.find((b) => b.id === parseInt(id));

  if (!book) {
    return res.status(404).json({ error: "Book not found." });
  }

  if (!book.borrowedBy) {
    return res.status(400).json({ error: "Book is not borrowed." });
  }

  // Check if the user returning the book is the same as the user who borrowed it
  if (book.borrowedBy !== user) {
    return res
      .status(403)
      .json({ error: "You are not authorized to return this book." });
  }

  // Reset borrowedBy and dueDate
  book.borrowedBy = null;
  book.dueDate = null;

  writeBooksData(booksData);
  res.status(200).json(book);
});

module.exports = router;
