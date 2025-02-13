import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import MealList from './components/MealList';
import MealRating from './components/MealRating';
import './App.css';

const App = () => {
  const username = "JohnDoe"; // Toto byste získali z přihlášení

  return (
    <Router>
      <div className="app">
        <Header username={username} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/meal/:id" element={<MealRating />} />
          <Route path="/" element={<MealList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; // Toto je důležité!