import React from 'react';
import ReactDOM from 'react-dom/client'; // Using the new React 18 root API
import App from './App';
// You might want to add global CSS imports here if you have any, e.g., import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element. Ensure your public/index.html has a <div id='root'></div>.");
}
