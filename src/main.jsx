import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { LoadingProvider } from './context/LoadingContext.jsx';
import Wallet3Provider from './web3/Wallet3Provider.jsx';
import { WalletApi } from './context/WalletContext.jsx';
import { Provider } from 'react-redux';
import store from './app/store.jsx';
import PusherProvider from './context/PusherContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <LoadingProvider>
        <PusherProvider>
          <Wallet3Provider>
            <WalletApi>
              <App />
            </WalletApi>
          </Wallet3Provider>
        </PusherProvider>
      </LoadingProvider>
    </Provider>
  </StrictMode >
);
