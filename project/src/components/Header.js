import React from 'react';
import { Link } from 'react-router-dom'; // Import Link pro navigaci
import logo from './logo.png';

const Header = ({ username }) => {
  return (
    <header>
      <div className="logo">
        <img src={logo} alt="Logo" style={{ height: '50px' }} />
      </div>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Seznam obědů</Link> {/* Odkaz na hlavní stránku */}
          </li>
          <li>
            <Link to="/login">Login</Link> {/* Odkaz na přihlášení */}
          </li>
          <li>
            <Link to="/register">Register</Link> {/* Odkaz na registraci */}
          </li>
        </ul>
      </nav>
      {username && <div className="username">Welcome, {username}</div>}
    </header>
  );
};

export default Header;