import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './allcss/normalize.css'
import './allcss/w.css'
import './allcss/main.css'
import Main from './Main'
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
