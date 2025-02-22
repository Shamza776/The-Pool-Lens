// ConnectWallet.tsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

const ConnectWallet: React.FC = () => {
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const initializeProvider = async () => {
      const ethereumProvider: any = await detectEthereumProvider();
      if (ethereumProvider) {
        setProvider(new ethers.BrowserProvider(ethereumProvider));
      } else {
        console.error('Please install MetaMask!');
      }
    };

    initializeProvider();
  }, []);

  const connectWallet = async () => {
    if (!provider) {
      console.error('No provider found');
      return;
    }
    
    try {
      const accounts = await (provider as ethers.BrowserProvider).send('eth_requestAccounts', []);
      setAccount(accounts[0]);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div>
      {account ? (
        <div>
          <p>Connected account: {account}</p>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>

  );
}


export default ConnectWallet;
