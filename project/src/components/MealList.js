import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MealList = () => {
  const [meals, setMeals] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    fetch('http://localhost:3000/api/jecnalunches')
      .then(response => response.json())
      .then(data => {
        const transformedMeals = data.flatMap(day => 
          day.lunches.map((lunch, index) => ({
            id: `${day.date}-${index}`,
            date: new Date(day.date.split('.').reverse().join('-')),
            name: lunch.details,
            rating: 0,
          }))
        );
        setMeals(transformedMeals);
        setFilteredMeals(transformedMeals);
      })
      .catch(error => console.error('Error fetching meals:', error));

    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:3000/api/ratings', {
        headers: {
          Authorization: token,
        },
      })
        .then(response => response.json())
        .then(data => {
          const ratingsMap = data.ratings.reduce((acc, rating) => {
            acc[rating.id] = rating;
            return acc;
          }, {});
          setRatings(ratingsMap);
        })
        .catch(error => console.error('Error fetching ratings:', error));
    }
  }, []);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilter = () => {
    setFilteredMeals(meals);
    setShowFilters(false);
  };

  const sortByDate = (ascending = true) => {
    const sortedMeals = [...filteredMeals].sort((a, b) => {
      return ascending ? a.date - b.date : b.date - a.date;
    });
    setFilteredMeals(sortedMeals);
  };

  const filterByRating = (type) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const sevenDaysAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    let filtered = [];
    switch (type) {
      case 'ratedLastWeek':
        filtered = meals.filter(meal => {
          const rating = ratings[meal.id];
          const mealDate = new Date(meal.date);
          return (
            rating && 
            rating.averageRating > 0 && 
            mealDate >= sevenDaysAgo && 
            mealDate <= sevenDaysAhead
          );
        });
        break;
      case 'notRatedLastWeek':
        filtered = meals.filter(meal => {
          const rating = ratings[meal.id];
          const mealDate = new Date(meal.date);
          return (
            (!rating || rating.averageRating === 0) && 
            mealDate >= sevenDaysAgo && 
            mealDate <= sevenDaysAhead
          );
        });
        break;
      case 'ratedOverall':
        filtered = meals.filter(meal => {
          const rating = ratings[meal.id];
          return rating && rating.averageRating > 0;
        });
        break;
      case 'notRatedOverall':
        filtered = meals.filter(meal => {
          const rating = ratings[meal.id];
          return !rating || rating.averageRating === 0;
        });
        break;
      default:
        filtered = meals;
    }
    setFilteredMeals(filtered);
  };

  return (
    <div className="meal-list">
      <h2>Seznam obědů</h2>

      <button onClick={toggleFilters}>Filtry</button>

      {showFilters && (
        <div className="filters-menu">
          <button onClick={() => sortByDate(true)}>Řadit podle času (nejstarší)</button>
          <button onClick={() => sortByDate(false)}>Řadit podle času (nejnovější)</button>
          <button onClick={() => filterByRating('ratedLastWeek')}>
            Hodnoceno za poslední týden
          </button>
          <button onClick={() => filterByRating('notRatedLastWeek')}>
            Nehodnoceno za poslední týden
          </button>
          <button onClick={() => filterByRating('ratedOverall')}>Hodnoceno celkem</button>
          <button onClick={() => filterByRating('notRatedOverall')}>Nehodnoceno celkem</button>
          <button onClick={resetFilter}>Odebrat filtr</button>
        </div>
      )}

      <div className="meal-list-container">
        <ul>
          {filteredMeals.map((meal) => {
            const rating = ratings[meal.id] || { averageRating: 0 };
            const averageRating = parseFloat(rating.averageRating);
            const validRating = Math.min(5, Math.max(0, Math.round(averageRating)));

            return (
              <li key={meal.id}>
                <span>
                  {meal.date.toLocaleDateString()} - {meal.name}
                </span>
                <span>{'★'.repeat(validRating)}</span>
                <Link to={`/meal/${meal.id}`}>Hodnotit</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MealList;