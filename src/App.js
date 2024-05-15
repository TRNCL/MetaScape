import React, { useContext, useEffect } from 'react';
import Collection from './pages/Collection';
import CreateNFT from './pages/CreateNFT';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Sidebar from './components/SideBar';
import Header from './components/Header';
import Home from './pages/Home';
import Test from './components/Test';
import Asset from './pages/Asset';

import NFTCollection from './abis/NFTCollection.json';
import NFTMarketplace from './abis/NFTMarketplace.json';
import CollectionContext from './utils/collection-context';
import MarketplaceContext from './utils/marketplace-context';
import Web3Context from './utils/web3-context';
import web3 from './utils/web3';
import PersonalFile from './pages/PersonalFile';
import Template from './pages/Template';
import GenerateDID from './components/GenerateDID';

const App = () => {
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);
  const marketplaceCtx = useContext(MarketplaceContext);

  useEffect(() => {
    initializeBlockchain();
  }, []);

  async function initializeBlockchain (){
    // Check if the user has Metamask active
    if (!web3) {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      return;
    }

    // Function to fetch all the blockchain data
    const loadBlockchainData = async () => {
      // Request accounts acccess if needed
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error(error);
      }
      const account = await web3Ctx.loadAccount(web3);
      const networkId = await web3Ctx.loadNetworkId(web3);

      const nftDeployedNetwork = NFTCollection.networks[networkId];
      const nftContract = collectionCtx.loadContract(web3, NFTCollection, nftDeployedNetwork);
      const mktDeployedNetwork = NFTMarketplace.networks[networkId];
      const mktContract = marketplaceCtx.loadContract(web3, NFTMarketplace, mktDeployedNetwork);

      if (nftContract) {
        const totalSupply = await collectionCtx.loadTotalSupply(nftContract);
        collectionCtx.loadCollection(nftContract, totalSupply);

        // const transferEvent = nftContract.events.Transfer();
        nftContract.events.Transfer()
          .on('data', (event) => {
            collectionCtx.updateCollection(nftContract, event.returnValues.tokenId, event.returnValues.to);
            collectionCtx.setNftIsLoading(false);
          });

      } else {
        window.alert('NFTCollection contract not deployed to detected network.')
      }

      if (mktContract) {
        const offerCount = await marketplaceCtx.loadOfferCount(mktContract);
        marketplaceCtx.loadOffers(mktContract, offerCount);
        account && marketplaceCtx.loadUserFunds(mktContract, account);

        mktContract.events.OfferFilled()
          .on('data', (event) => {
            marketplaceCtx.updateOffer(event.returnValues.offerId);
            collectionCtx.updateOwner(event.returnValues.id, event.returnValues.newOwner);
            marketplaceCtx.setMktIsLoading(false);
          });

        // Event Offer subscription 
        mktContract.events.Offer()
          .on('data', (event) => {
            marketplaceCtx.addOffer(event.returnValues);
            marketplaceCtx.setMktIsLoading(false);
          });

        // Event offerCancelled subscription 
        mktContract.events.OfferCancelled()
          .on('data', (event) => {
            marketplaceCtx.updateOffer(event.returnValues.offerId);
            collectionCtx.updateOwner(event.returnValues.id, event.returnValues.owner);
            marketplaceCtx.setMktIsLoading(false);
          });

      } else {
        window.alert('NFTMarketplace contract not deployed to detected network.')
      }

      collectionCtx.setNftIsLoading(false);
      marketplaceCtx.setMktIsLoading(false);

      // Metamask Event Subscription - Account changed
      window.ethereum.on('accountsChanged', (accounts) => {
        web3Ctx.loadAccount(web3);
        accounts[0] && marketplaceCtx.loadUserFunds(mktContract, accounts[0]);
      });

      // Metamask Event Subscription - Network changed
      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
      });
    };

    loadBlockchainData();
  };

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <BrowserRouter>
          <Header />
          <Sidebar />
          <Routes>
            <Route path='/' element={<Home />}></Route>
          </Routes>
          <Box
            component="main"
            className="MainContent"
            sx={{
              pt: { xs: 'calc(12px + var(--Header-height))', md: 3 },
              pb: { xs: 2, sm: 2, md: 3 },
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              height: '100dvh',
              gap: 1,
              overflow: 'auto',
            }}
          >
            <Routes>
              <Route path='/template' element={<Template />}/>
              <Route path='/createnft' element={<CreateNFT />}/>
              <Route path='/marketplace' element={<Collection />}/>
              <Route path='/test' element={<Test />}/>
              <Route path="/profile" element={<PersonalFile />} />
              <Route path="/marketplace/asset/:assetId/:key" element={<Asset />} />
              <Route path='/did' element={<GenerateDID />}></Route>
            </Routes>
          </Box>
        </BrowserRouter>
      </Box>
    </CssVarsProvider>
  );
}

export default App;