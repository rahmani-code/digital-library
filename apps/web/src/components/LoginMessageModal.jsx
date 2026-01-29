import React, { useEffect, useState } from "react";
import "../index.css";

const LoginMessageModal = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in">
        <h2>🔒 Please Log In</h2>
      </div>
    </div>
  );
};

export default LoginMessageModal;
