import React from 'react';
import { Link } from 'react-router-dom';

const MealList = () => {
  const meals = [
    { id: 1, date: '2023-10-01', name: 'Svíčková', rating: 4 },
    { id: 2, date: '2023-10-02', name: 'Guláš', rating: 3 },
    // Další obědy...
  ];

  return (
    <div className="meal-list">
      <h2>Seznam obědů</h2>
      <ul>
        {meals.map((meal) => (
          <li key={meal.id}>
            <span>{meal.date} - {meal.name}</span>
            <span>{'★'.repeat(meal.rating)}</span>
            <Link to={`/meal/${meal.id}`}>Hodnotit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MealList;