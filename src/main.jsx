import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Web3ModalProvider } from './web3/Web3Provider.jsx'
import { WalletProvider } from './context/WalletContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Web3ModalProvider>
      <WalletProvider>
        <App />
      </WalletProvider>
    </Web3ModalProvider>
  </StrictMode>,
)
