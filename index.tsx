import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './AppComponent.tsx'; // Ensure this matches the exact case of App.tsx
import reportWebVitals from './reportWebVitalsFile.ts'; // Ensure this matches the exact case of reportWebVitals.ts

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
