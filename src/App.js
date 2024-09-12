import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import logo from './assets/new_crawler.png'; 

const App = () => {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const baseURL = 'http://127.0.0.1:5000';
    let url = `${baseURL}/api/entries`;
    if (filter === 'comments') {
      url = `${baseURL}/api/entries/filter/comments`;
    } else if (filter === 'points') {
      url = `${baseURL}/api/entries/filter/points`;
    }

    axios.get(url)
      .then(response => setEntries(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, [filter]);

  const getButtonClass = (currentFilter) => {
    return filter === currentFilter ? 'filter-button active' : 'filter-button';
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="SpiderGlimpse Logo" />
        <h1>SpiderGlimpse</h1>
        <div className="filter-buttons">
          <button onClick={() => setFilter('all')} className={getButtonClass('all')}>Todos</button>
          <button onClick={() => setFilter('comments')} className={getButtonClass('comments')}>Más de 5 palabras (Ordenar por comentarios)</button>
          <button onClick={() => setFilter('points')} className={getButtonClass('points')}>Menos de o igual a 5 palabras (Ordenar por puntos)</button>
        </div>
      </header>
      <main>
        <ul className="entries-list">
          {entries.map(entry => (
            <li key={entry.number} className="entry-item">
              <span className="entry-number">{entry.number}.</span> {entry.title} - 
              <span className="entry-points">{entry.points} points</span> - 
              <span className="entry-comments">{entry.comments} comments</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default App;
