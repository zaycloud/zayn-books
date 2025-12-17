import { StrictMode } from 'react'; // eslint-disable-line no-unused-vars
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; // eslint-disable-line no-unused-vars

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
