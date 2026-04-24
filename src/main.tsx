import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { logUIError } from './lib/funnel';

window.addEventListener('error', (e) => {
  logUIError({
    error_type: 'unhandled_error',
    error_message: e.message,
    error_stack: e.error?.stack,
    severity: 'error',
  });
});

window.addEventListener('unhandledrejection', (e) => {
  logUIError({
    error_type: 'unhandled_rejection',
    error_message: String(e.reason),
    error_stack: (e.reason as { stack?: string })?.stack,
    severity: 'error',
  });
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
