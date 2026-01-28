document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".sidebar-menu li a");
  const sections = document.querySelectorAll(".content-section");
  const modeToggle = document.getElementById("mode-toggle");

  const fetchUsers = () => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((users) => {
        const userList = document.getElementById("user-list");
        userList.innerHTML = "";
        for (const user of users) {
          const row = document.createElement("tr");
          row.setAttribute("data-id", user.id);
          row.innerHTML = `
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>
                            <button class="edit-user">Edit</button>
                            <button class="delete-user">Delete</button>
                        </td>
                    `;
          userList.appendChild(row);
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  };

  const setupUserManagement = () => {
    const userForm = document.getElementById("user-form");

    userForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (!name || !email || !password) return;

      fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })
        .then((response) => {
          if (response.ok) {
            userForm.reset();
            fetchUsers();
          } else {
            console.error("Error adding user:", response.statusText);
          }
        })
        .catch((error) => console.error("Error adding user:", error));
    });

    fetchUsers();
  };

  const updateDashboardMetrics = (books) => {
    const activeUsersCount = 120;
    const availableBooksCount = books.filter((book) => !book.borrowedBy).length;
    const borrowedBooksCount = books.filter((book) => book.borrowedBy).length;
    const overdueBooksCount = books.filter(
      (book) => book.dueDate && new Date(book.dueDate) < new Date()
    ).length;

    document.querySelector("#active-users").textContent = activeUsersCount;
    document.querySelector("#available-books").textContent =
      availableBooksCount;
    document.querySelector("#borrowed-books").textContent = borrowedBooksCount;
    document.querySelector("#overdue-books").textContent = overdueBooksCount;
  };

  const fetchBooks = () => {
    fetch("/api/books")
      .then((response) => response.json())
      .then((books) => {
        const bookList = document.getElementById("book-list");
        bookList.innerHTML = "";
        for (const book of books) {
          const row = document.createElement("tr");
          row.setAttribute("data-id", book.id);
          row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.borrowedBy || "Available"}</td>
            <td>${book.dueDate || "N/A"}</td>
            <td>
              <button class="edit-book">Edit</button>
              <button class="delete-book">Delete</button>
            </td>
          `;
          bookList.appendChild(row);
        }
        updateDashboardMetrics(books);
      })
      .catch((error) => console.error("Error fetching books:", error));
  };

  const setupBookManagement = () => {
    const bookForm = document.getElementById("book-form");

    bookForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = document.getElementById("book-title").value;
      const author = document.getElementById("author").value;
      const genre = document.getElementById("genre").value;
      const publishedYear = document.getElementById("published-year").value;
      const description = document.getElementById("description").value;

      if (!title || !author || !genre || !publishedYear || !description) {
        alert("Please fill in all fields.");
        return;
      }

      fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          genre,
          publishedYear,
          description,
        }),
      })
        .then((response) => {
          if (response.ok) {
            bookForm.reset();
            fetchBooks();
          } else {
            console.error("Error adding book:", response.statusText);
          }
        })
        .catch((error) => console.error("Error adding book:", error));
    });

    fetchBooks();
  };

  for (const item of menuItems) {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const target = item.getAttribute("data-target");

      for (const section of sections) {
        section.classList.remove("active");
      }
      for (const menuItem of menuItems) {
        menuItem.classList.remove("active");
      }

      document.getElementById(target).classList.add("active");
      item.classList.add("active");
    });
  }

  document.getElementById("dashboard").classList.add("active");
  document
    .querySelector('.sidebar-menu li a[data-target="dashboard"]')
    .classList.add("active");

  modeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    modeToggle.textContent = document.body.classList.contains("dark-mode")
      ? "Toggle Light Mode"
      : "Toggle Dark Mode";
  });

  setupUserManagement();
  setupBookManagement();

  const deleteUser = (id) => {
    fetch(`/api/users/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          fetchUsers();
        } else {
          console.error("Error deleting user:", response.statusText);
        }
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  const editUser = (id, name, email) => {
    fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    })
      .then((response) => {
        if (response.ok) {
          fetchUsers();
        } else {
          console.error("Error editing user:", response.statusText);
        }
      })
      .catch((error) => console.error("Error editing user:", error));
  };

  const deleteBook = (id) => {
    fetch(`/api/books/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          fetchBooks();
        } else {
          console.error("Error deleting book:", response.statusText);
        }
      })
      .catch((error) => console.error("Error deleting book:", error));
  };

  const editBook = (id, title, author, genre, publishedYear, description) => {
    fetch(`/api/books/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        author,
        genre,
        publishedYear,
        description,
      }),
    })
      .then((response) => {
        if (response.ok) {
          fetchBooks();
        } else {
          console.error("Error editing book:", response.statusText);
        }
      })
      .catch((error) => console.error("Error editing book:", error));
  };

  const setupBookTableEvents = () => {
    const bookList = document.getElementById("book-list");
    bookList.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-book")) {
        const row = e.target.closest("tr");
        const id = row.dataset.id;
        deleteBook(id);
      } else if (e.target.classList.contains("edit-book")) {
        const row = e.target.closest("tr");
        const id = row.dataset.id;
        const title = row.querySelector("td:nth-child(1)").textContent;
        const author = row.querySelector("td:nth-child(2)").textContent;
        const genre = row.querySelector("td:nth-child(3)").textContent;
        const publishedYear = row.querySelector("td:nth-child(4)").textContent;
        const description = row.querySelector("td:nth-child(5)").textContent;

        console.log("Edit Book:", {
          id,
          title,
          author,
          genre,
          publishedYear,
          description,
        });
      }
    });
  };

  const setupUserTableEvents = () => {
    const userList = document.getElementById("user-list");
    userList.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-user")) {
        const row = e.target.closest("tr");
        const id = row.dataset.id;
        deleteUser(id);
      } else if (e.target.classList.contains("edit-user")) {
        const row = e.target.closest("tr");
        const id = row.dataset.id;
        const name = row.querySelector("td:nth-child(1)").textContent;
        const email = row.querySelector("td:nth-child(2)").textContent;

        console.log("Edit User:", { id, name, email });
      }
    });
  };

  fetchUsers();
  fetchBooks();
  setupUserTableEvents();
  setupBookTableEvents();
});
