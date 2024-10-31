// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { LoadingProvider } from './context/LoadingContext.jsx';
import Wallet3Provider from './web3/Wallet3Provider.jsx';
import { WalletApi } from './context/WalletContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingProvider>
      <Wallet3Provider>
        <WalletApi>
          <App />
        </WalletApi>
      </Wallet3Provider>
    </LoadingProvider>
  </StrictMode>
);
