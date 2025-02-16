import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MealList = () => {
  // Příklad dat
  const meals = [
    { id: 1, date: '2023-10-01', name: 'Svíčková', rating: 4 },
    { id: 2, date: '2023-10-02', name: 'Guláš', rating: 3 },
    { id: 3, date: '2023-10-03', name: 'Kachna', rating: 0 }, // Nehodnoceno
    { id: 4, date: '2023-10-04', name: 'Pizza', rating: 5 },
  ];

  // Stav pro viditelnost menu filtrů
  const [showFilters, setShowFilters] = useState(false);

  // Stav pro aktuální seznam jídel (pro případné filtrování)
  const [filteredMeals, setFilteredMeals] = useState(meals);

  // Funkce pro otevření/zavření menu filtrů
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Funkce pro resetování filtrů (zobrazení původního seznamu)
  const resetFilter = () => {
    setFilteredMeals(meals); // Zobrazí původní seznam
    setShowFilters(false); // Zavře menu
  };

  return (
    <div className="meal-list">
      <h2>Seznam obědů</h2>

      {/* Tlačítko pro otevření menu filtrů */}
      <button onClick={toggleFilters}>Filtry</button>

      {/* Rozbalovací menu filtrů */}
      {showFilters && (
        <div className="filters-menu">
          <button onClick={() => alert('Řadit podle času')}>Řadit podle času</button>
          <button onClick={() => alert('Hodnoceno za poslední týden')}>
            Hodnoceno za poslední týden
          </button>
          <button onClick={() => alert('Nehodnoceno za poslední týden')}>
            Nehodnoceno za poslední týden
          </button>
          <button onClick={() => alert('Hodnoceno celkem')}>Hodnoceno celkem</button>
          <button onClick={() => alert('Nehodnoceno celkem')}>Nehodnoceno celkem</button>
          <button onClick={resetFilter}>Odebrat filtr</button>
        </div>
      )}

      {/* Seznam jídel */}
      <ul>
        {filteredMeals.map((meal) => (
          <li key={meal.id}>
            <span>
              {meal.date} - {meal.name}
            </span>
            <span>{'★'.repeat(meal.rating)}</span>
            <Link to={`/meal/${meal.id}`}>Hodnotit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MealList;