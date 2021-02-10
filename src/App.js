import React, { useEffect } from 'react';
import TypeWriter from './model/TypeWriter';
import './App.css';

function App() { // Functional Component

  useEffect(() => { // In-built React Hook 
    document.addEventListener('DOMContentLoaded', init);

    function init() {
      const txtElement = document.querySelector('.app__header__text--type');
      const words = JSON.parse(txtElement.getAttribute('data-words'));
      const wait = txtElement.getAttribute('data-wait');

      // Init the typewriter animation
      new TypeWriter(txtElement, words, wait);
    }
  }, []);


  return (
    <div className="app">
      <div className="app__header">
        <h1 className="app__header__text">COVID 19&nbsp;
        <span className="app__header__text--type" data-wait="3000"
            data-words='["Tracker", "Confirmed Cases", "Recovered Cases", "Death Cases"]'></span>
          
        </h1>
      </div>
    </div>

  );
}

export default App;