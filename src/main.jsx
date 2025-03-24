import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { LoadingProvider } from './context/LoadingContext.jsx';
import { WalletApi } from './context/WalletContext.jsx';
import { Provider } from 'react-redux';
import store from './app/store.jsx';
import { BrowserRouter } from 'react-router-dom';
import PusherProvider from './context/PusherContext.jsx';
import { Web3ModalProvider } from './web3/Web3Provider.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { AuthProvider } from './context/useAuth.jsx';
import { DarkModeProvider } from './context/DarkModeProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LoadingProvider>
          <PusherProvider>
            <Web3ModalProvider>
              <WalletApi>
                <AuthProvider>
                  <NotificationProvider>
                    <DarkModeProvider>

                      <App />

                    </DarkModeProvider>
                  </NotificationProvider>

                </AuthProvider>
              </WalletApi>
            </Web3ModalProvider>
          </PusherProvider>
        </LoadingProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode >
);
