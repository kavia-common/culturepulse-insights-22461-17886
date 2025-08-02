import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import './styles/Dashboard.css';
import './styles/KPICards.css';
import './styles/MoodHeatmap.css';
import './styles/DailyFeed.css';
import './styles/ActivitySuggestions.css';
import './styles/Sidebar.css';
import './styles/Onboarding.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
