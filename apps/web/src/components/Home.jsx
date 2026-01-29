import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import videoSource from "../assets/lib.mp4";

function Home() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  // Fetch books from the backend
  useEffect(() => {
    fetch("http://localhost:5002/api/books")
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setQuery(searchTerm);

    if (searchTerm) {
      const results = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm),
      );
      setFilteredBooks(results);
    } else {
      setFilteredBooks([]);
    }
  };

  return (
    <section className="hero-section">
      <video autoPlay loop muted className="background-video">
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Digital Library Management System</h1>
        <h2>Manage Libraries Online</h2>

        {/* Search Bar */}
        <input
          className="search"
          type="text"
          placeholder="Search book, author, or ISBN..."
          value={query}
          onChange={handleSearch}
        />

        {/* Book Results */}
        {query && (
          <ul className="search-results">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <li key={book.id}>
                  <Link to={`/book/${book.id}`}>
                    <strong>{book.title}</strong> by {book.author}
                  </Link>
                </li>
              ))
            ) : (
              <li>No books found</li>
            )}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Home;
