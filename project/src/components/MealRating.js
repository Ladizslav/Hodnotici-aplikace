import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const MealRating = () => {
  const { id } = useParams();
  const [price, setPrice] = useState(0);
  const [portion, setPortion] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [appearance, setAppearance] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      isNaN(portion) || portion < 0 || portion > 5 ||
      isNaN(temperature) || temperature < 0 || temperature > 5 ||
      isNaN(appearance) || appearance < 0 || appearance > 5
    ) {
      setError('Hodnocení musí být v rozsahu 0–5.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Nejste přihlášeni.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          id,
          price,
          portion,
          temperature,
          appearance,
        }),
      });

      if (response.ok) {
        alert('Hodnocení uloženo.');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Chyba při ukládání hodnocení.');
      }
    } catch (error) {
      setError('Chyba při odesílání hodnocení.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="meal-rating">
      <h2>Hodnocení jídla</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Kolik byste si byli ochotni připlatit (Kč):
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Porce (0-5 ★):
          <input
            type="number"
            min="0"
            max="5"
            value={portion}
            onChange={(e) => setPortion(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Teplota jídla (0-5 ★):
          <input
            type="number"
            min="0"
            max="5"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Vzhled jídla (0-5 ★):
          <input
            type="number"
            min="0"
            max="5"
            value={appearance}
            onChange={(e) => setAppearance(parseFloat(e.target.value))}
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Ukládání...' : 'Hodnotit'}
        </button>
      </form>
    </div>
  );
};

export default MealRating;