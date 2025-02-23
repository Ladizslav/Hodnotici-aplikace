import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import MealList from './components/MealList';
import MealRating from './components/MealRating';
import './App.css';

const App = () => {
  const username = "Žábis"; 

  return (
    <Router>
      <div className="app">
        <Header username={username} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/meal/:id" element={<MealRating />} />
          <Route path="/" element={<MealList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 