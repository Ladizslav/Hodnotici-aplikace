import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const MealRating = () => {
  const { id } = useParams(); 
  const [price, setPrice] = useState(0);
  const [portion, setPortion] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [appearance, setAppearance] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Rating:', { id, price, portion, temperature, appearance });
  };

  return (
    <div className="meal-rating">
      <h2>Hodnocení jídla</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Kolik byste si byli ochotni připlatit (Kč):
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <label>
          Porce (0-5 ★):
          <input
            type="number"
            min="0"
            max="5"
            value={portion}
            onChange={(e) => setPortion(e.target.value)}
          />
        </label>
        <label>
          Teplota jídla (0-5 ★):
          <input
            type="number"
            min="0"
            max="5"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
          />
        </label>
        <label>
          Vzhled jídla (0-5 ★):
          <input
            type="number"
            min="0"
            max="5"
            value={appearance}
            onChange={(e) => setAppearance(e.target.value)}
          />
        </label>
        <button type="submit">Hodnotit</button>
      </form>
    </div>
  );
};

export default MealRating;