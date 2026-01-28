import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const SingleBook = () => {
  const { id } = useParams();
  const [book, setBook] = useState({});
  const [coverImage, setCoverImage] = useState("");

  useEffect(() => {
    // Fetch book details
    fetch(`http://localhost:5002/api/books/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setBook(data);
        fetchCoverImage(data.title);
      });
  }, [id]);

  const fetchCoverImage = (title) => {
    fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.docs && data.docs.length > 0) {
          const coverId = data.docs[0].cover_i;
          if (coverId) {
            setCoverImage(
              `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
            );
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching cover image:", error);
      });
  };

  const handleBorrow = () => {
    if (!book.borrowedBy) {
      // Send borrow request to the server
      fetch(`http://localhost:5002/api/books/${book.id}/borrow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: JSON.parse(localStorage.getItem("loggedInUser")).name,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to borrow the book.");
          }
        })
        .then((updatedBook) => {
          alert("Book borrowed successfully!");
          setBook(updatedBook);
        })
        .catch((error) => {
          console.error("Error borrowing book:", error);
          alert("Failed to borrow the book.");
        });
    } else {
      alert("This book is already borrowed!");
    }
  };

  const handleReturn = () => {
    if (book.borrowedBy) {
      // Send return request to the server
      fetch(`http://localhost:5002/api/books/${book.id}/return`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: JSON.parse(localStorage.getItem("loggedInUser")).name,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else if (response.status === 403) {
            throw new Error("You are not authorized to return this book.");
          } else {
            throw new Error("Failed to return the book.");
          }
        })
        .then((updatedBook) => {
          alert("Book returned successfully!");
          setBook(updatedBook);
        })
        .catch((error) => {
          console.error("Error returning book:", error);
          alert(error.message);
        });
    } else {
      alert("This book is not borrowed!");
    }
  };

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))?.name;

  return (
    <div style={styles.container}>
      <video autoPlay loop muted style={styles.video}>
        <source src={require("../assets/book.mp4")} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={styles.overlay}></div>
      <div style={styles.card}>
        <img
          src={
            coverImage ||
            "http://covers.openlibrary.org/b/isbn/0385472579-S.jpg"
          }
          alt={book.title}
          style={styles.coverImage}
        />
        <div style={styles.detailsContainer}>
          <h1 style={styles.title}>{book.title}</h1>
          <p style={styles.info}>
            <strong>Author:</strong> {book.author}
          </p>
          <p style={styles.info}>
            <strong>Genre:</strong> {book.genre}
          </p>
          <p style={styles.info}>
            <strong>Published:</strong> {book.publishedYear}
          </p>
          {book.borrowedBy ? (
            <p style={styles.status}>
              <strong>Borrowed By:</strong> {book.borrowedBy}
            </p>
          ) : (
            <p style={styles.status}>
              <strong>Status:</strong> Available
            </p>
          )}
          {book.dueDate && (
            <p style={styles.info}>
              <strong>Due Date:</strong> {book.dueDate}
            </p>
          )}
          <p style={styles.description}>
            <strong>Description:</strong> {book.description}
          </p>
          <div style={styles.buttonContainer}>
            {book.borrowedBy ? (
              loggedInUser === book.borrowedBy ? (
                <button style={styles.returnButton} onClick={handleReturn}>
                  Return Book
                </button>
              ) : (
                <p style={styles.status}>Not available at the moment!</p>
              )
            ) : (
              <button style={styles.borrowButton} onClick={handleBorrow}>
                Borrow Book
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    position: "relative",
    overflow: "hidden",
  },
  video: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "translate(-50%, -50%)",
    zIndex: -1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 0,
  },
  card: {
    display: "flex",
    background: "#fff",

    padding: "50px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    maxWidth: "1000px",
    width: "90%",
    alignItems: "center",
    zIndex: 1,
    transform: "scale(1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  coverImage: {
    width: "300px",
    height: "450px",
    objectFit: "cover",
    borderRadius: "12px",
    marginRight: "40px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease",
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
    fontFamily: "'Merriweather', serif",
  },
  info: {
    fontSize: "20px",
    marginBottom: "12px",
    color: "#555",
    fontFamily: "'Open Sans', sans-serif",
  },
  status: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#d9534f",
    fontFamily: "'Open Sans', sans-serif",
    marginBottom: "2rem",
  },
  description: {
    fontSize: "18px",
    marginBottom: "20px",
    color: "#666",
    lineHeight: "1.6",
    fontFamily: "'Open Sans', sans-serif",
  },
  buttonContainer: {
    marginTop: "30px",
  },
  borrowButton: {
    padding: "15px 30px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "20px",
    transition: "background 0.3s ease, transform 0.2s ease",
    fontFamily: "'Open Sans', sans-serif",
  },
  returnButton: {
    padding: "15px 30px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "20px",
    transition: "background 0.3s ease, transform 0.2s ease",
    fontFamily: "'Open Sans', sans-serif",
  },
};

// Add hover effects and animations
const hoverStyles = `
  .card:hover {
    transform: scale(1.02);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  }
  .coverImage:hover {
    transform: scale(1.05);
  }
  .borrowButton:hover {
    background: #0056b3;
    transform: translateY(-2px);
  }
  .returnButton:hover {
    background: #c82333;
    transform: translateY(-2px);
  }
`;

// Inject hover styles into the document
const styleSheet = document.createElement("style");
styleSheet.innerText = hoverStyles;
document.head.appendChild(styleSheet);

export default SingleBook;
