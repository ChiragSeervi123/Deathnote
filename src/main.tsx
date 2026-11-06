import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/fonts';
import './styles/global.css';
import { App } from './app/App';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Remove the inline boot screen once React has painted.
requestAnimationFrame(() => {
  document.getElementById('boot')?.classList.add('boot--done');
  window.setTimeout(() => document.getElementById('boot')?.remove(), 900);
});
