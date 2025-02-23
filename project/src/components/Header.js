import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.png';

const Header = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername('');
    navigate('/login');
  };

  return (
    <header>
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Seznam obědů</Link>
          </li>
          {isLoggedIn ? (
            <li>
              <Link to="/login" onClick={handleLogout} className="logout-link">
                Logout
              </Link>
            </li>
          ) : (
            <li>
              <Link to="/login" className="login-link">
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
      {isLoggedIn && <div className="username">{username}</div>}
    </header>
  );
};

export default Header;