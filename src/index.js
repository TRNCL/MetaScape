import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StyledEngineProvider } from '@mui/joy/styles';
import Web3Provider from './utils/Web3Provider';
import CollectionProvider from './utils/CollectionProvider';
import MarketplaceProvider from './utils/MarketplaceProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Web3Provider>
    <CollectionProvider>
      <MarketplaceProvider>
        <StyledEngineProvider injectFirst>
          <App />
        </StyledEngineProvider>
      </MarketplaceProvider>
    </CollectionProvider>
  </Web3Provider>,
);