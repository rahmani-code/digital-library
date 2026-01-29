import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import "./index.css";
import Home from "./components/Home";
import Book from "./components/Book";
import SingleBook from "./components/SingleBook";
import LoginModal from "./components/loginModal";
import LoginMessageModal from "./components/LoginMessageModal";

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setTimeout(() => setModalOpen(true), 5000);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

      setPrevScrollPos(currentScrollPos);
      setVisible(visible);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    setShowLogoutMessage(true);

    setTimeout(() => {
      setShowLogoutMessage(false); // Hide modal after 2 sec
    }, 2000);
  };

  return (
    <Router>
      <>
        <Navbar
          user={user}
          onLoginClick={() => setModalOpen(true)}
          onLogout={handleLogout}
          visible={visible}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={user ? <Book /> : <Home />} />
          <Route path="/book/:id" element={user ? <SingleBook /> : <Home />} />
        </Routes>
        <LoginModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onLoginSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            setModalOpen(false);
          }}
        />
        {showLogoutMessage && <LoginMessageModal />}
      </>
    </Router>
  );
}

function Navbar({ user, onLoginClick, onLogout, visible }) {
  return (
    <nav className="navbar" style={{ top: visible ? "0" : "-100px" }}>
      <div className="navbar-logo">
        <span className="logo-text">DIGITAL LIBRARY</span>
      </div>

      <ul className="links">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/books"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Books
          </NavLink>
        </li>
        <li>
          {user ? (
            <>
              <span className="username" style={{ alignSelf: "center" }}>
                {user.name}
              </span>{" "}
              <button
                type="button"
                className="logout-button"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button type="button" className="login-link" onClick={onLoginClick}>
              User Login
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default App;
