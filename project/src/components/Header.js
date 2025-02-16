import React from 'react';
import { Link } from 'react-router-dom'; 
import logo from './logo.png';

const Header = ({ username }) => {
  return (
    <header>
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Seznam obědů</Link> {}
          </li>
          <li>
            <Link to="/login">Login</Link> {}
          </li>
          <li>
            <Link to="/register">Register</Link> {}
          </li>
        </ul>
      </nav>
      {username && <div className="username">{username}</div>}
    </header>
  );
};

export default Header;