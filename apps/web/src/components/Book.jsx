import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./books.css";

export default function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5002/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  return (
    <div className="booklist-page">
      <div className="booklist-container">
        <ul className="booklist">
          {books.length > 0 ? (
            books.map((book) => <Book key={book.id} book={book} />)
          ) : (
            <li>No books available</li>
          )}
        </ul>
      </div>
    </div>
  );
}

// Book Component
const Book = ({ book }) => {
  const { title, author, id } = book;
  const [coverImage, setCoverImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoverImage = async () => {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`
      );
      const data = await response.json();
      if (data.docs && data.docs.length > 0) {
        setCoverImage(
          data.docs[0].cover_i
            ? `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-L.jpg`
            : ""
        );
      }
    };

    fetchCoverImage();
  }, [title]);

  const clickHandler = () => {
    navigate(`/book/${id}`);
  };

  return (
    <li className="book">
      <button
        onClick={clickHandler}
        className="book-button"
        tabIndex="0"
        onKeyDown={(e) => e.key === "Enter" && clickHandler()}
      >
        {coverImage && <img src={coverImage} alt={`${title} cover`} />}
        <h2>{title}</h2>
        <h4>{author}</h4>
      </button>
    </li>
  );
};
