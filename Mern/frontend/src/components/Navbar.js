import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <h1>QuizGenAi</h1>
      <div className="nav-links">
        {!isAuthenticated ? (
          <>
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button className="logout-button" onClick={handleLogout}>Logout</button> 
        )}
      </div>
    </nav>
  );
};

export default Navbar;
