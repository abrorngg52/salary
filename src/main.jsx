import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';

// Временная заглушка до создания App.jsx на шаге B2
const App = () => (
  <div style={{ 
    padding: '20px', 
    textAlign: 'center',
    color: 'var(--color-text-secondary)'
  }}>
    Salary Tracker: инициализация...
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);