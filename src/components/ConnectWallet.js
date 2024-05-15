import { useState } from 'react';
import { Web3 } from 'web3';
import '@fontsource/inter';
import Button from '@mui/joy/Button';
import { Box, Typography } from '@mui/joy';

const ConnectWallet = async() => {
  const [connect, setConnectedAccount] = useState('null');
  
  async function connectMetamask(){
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts'});
      web3Ctx.loadAccount(web3);
    }else{
      alert('Metamask wallet not found. Please install it.')
    }
  }

  return (
    <Box sx={{maxWidth: '100%'}}>
    <Button variant="plain" onClick={() => connectMetamask()}>
      <Typography sx={{ maxWidth: '100%' }}>{connect}</Typography>
    </Button>
    </Box>
  );
}

export default ConnectWallet;