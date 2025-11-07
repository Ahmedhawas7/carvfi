import React, { createContext, useState, useContext, useEffect } from 'react';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if wallet was previously connected
  useEffect(() => {
    const savedWallet = localStorage.getItem('carvfi_wallet');
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setIsConnected(true);
    }
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    setError('');

    try {
      // Check if Ethereum provider is available
      if (window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          setIsConnected(true);
          
          // Save to localStorage
          localStorage.setItem('carvfi_wallet', address);
          
          // Update user data if exists
          const userData = localStorage.getItem('carvfi_user');
          if (userData) {
            const user = JSON.parse(userData);
            user.wallet = address;
            localStorage.setItem('carvfi_user', JSON.stringify(user));
          }

          setError('');
          return address;
        } else {
          throw new Error('No accounts found');
        }
      } else {
        throw new Error('Please install MetaMask or another Ethereum wallet');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setIsConnected(false);
    localStorage.removeItem('carvfi_wallet');
    setError('');
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          // User disconnected wallet
          disconnectWallet();
        } else {
          // User switched accounts
          setWalletAddress(accounts[0]);
          localStorage.setItem('carvfi_wallet', accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const value = {
    walletAddress,
    isConnected,
    loading,
    error,
    connectWallet,
    disconnectWallet
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;