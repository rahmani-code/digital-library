import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: username, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        onLoginSuccess(data.user);
        onClose();
        navigate("/");
      } else {
        setError(data.error || "Invalid username or password.");
      }
    } catch (err) {
      setError("Error logging in. Try again later.");
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? "show" : ""}`}>
      <div className="modal-content">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" className="login-btn" onClick={handleLogin}>
          Login
        </button>
        <button type="button" className="close-btn" onClick={onClose} />
      </div>
    </div>
  );
};

export default LoginModal;
