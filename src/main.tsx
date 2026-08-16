import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext';
import { TradingProvider } from './context/TradingContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <TradingProvider>
        <App />
      </TradingProvider>
    </ThemeProvider>
  </StrictMode>,
);

