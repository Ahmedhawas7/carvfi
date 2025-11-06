import { ethers } from 'ethers';

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.walletConnectProvider = null;
  }

  // MetaMask connection
  async connectMetaMask() {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed! Please install MetaMask to continue.');
      }

      this.provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      this.signer = await this.provider.getSigner();
      const address = await this.signer.getAddress();
      const network = await this.provider.getNetwork();

      return {
        success: true,
        address,
        network: network.name,
        chainId: Number(network.chainId),
        type: 'metamask'
      };
    } catch (error) {
      console.error('MetaMask connection error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // WalletConnect connection (simplified - will work without project ID)
  async connectWalletConnect() {
    try {
      // Simplified version that guides user to install WalletConnect
      throw new Error('WalletConnect requires project setup. Please use MetaMask for now, or visit https://cloud.walletconnect.com to get Project ID.');
    } catch (error) {
      console.error('WalletConnect connection error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get wallet balance
  async getBalance(address) {
    try {
      if (!this.provider) {
        // Create a temporary provider for balance check
        this.provider = new ethers.BrowserProvider(window.ethereum);
      }
      
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Balance fetch error:', error);
      return '0';
    }
  }

  // Sign message for authentication
  async signMessage(message) {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }
      
      const signature = await this.signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Message signing error:', error);
      throw error;
    }
  }

  // Get transaction count (nonce)
  async getTransactionCount(address) {
    try {
      if (!this.provider) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
      }
      
      const nonce = await this.provider.getTransactionCount(address);
      return nonce;
    } catch (error) {
      console.error('Nonce fetch error:', error);
      return 0;
    }
  }

  // Get gas price
  async getGasPrice() {
    try {
      if (!this.provider) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
      }
      
      const gasPrice = await this.provider.getFeeData();
      return gasPrice.gasPrice;
    } catch (error) {
      console.error('Gas price fetch error:', error);
      return null;
    }
  }

  // Send transaction (basic)
  async sendTransaction(to, value) {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const transaction = {
        to: to,
        value: ethers.parseEther(value),
        gasLimit: 21000,
      };

      const tx = await this.signer.sendTransaction(transaction);
      return {
        success: true,
        transactionHash: tx.hash
      };
    } catch (error) {
      console.error('Transaction error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
  }

  // Check if wallet is connected
  isConnected() {
    return this.signer !== null;
  }

  // Get current account
  async getCurrentAccount() {
    try {
      if (!this.signer) {
        return null;
      }
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Get account error:', error);
      return null;
    }
  }

  // Get network information
  async getNetworkInfo() {
    try {
      if (!this.provider) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
      }
      
      const network = await this.provider.getNetwork();
      return {
        name: network.name,
        chainId: Number(network.chainId),
        ensAddress: network.ensAddress
      };
    } catch (error) {
      console.error('Network info error:', error);
      return null;
    }
  }

  // Listen for account changes
  onAccountsChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        callback(accounts);
      });
    }
  }

  // Listen for chain changes
  onChainChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId) => {
        callback(chainId);
      });
    }
  }

  // Disconnect wallet
  async disconnect() {
    if (this.walletConnectProvider) {
      await this.walletConnectProvider.disconnect();
      this.walletConnectProvider = null;
    }
    
    this.provider = null;
    this.signer = null;
  }

  // Switch network (Ethereum Mainnet)
  async switchToMainnet() {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // Ethereum Mainnet
      });
      
      return { success: true };
    } catch (error) {
      console.error('Network switch error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Add network to MetaMask
  async addNetwork(networkParams) {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkParams],
      });
      
      return { success: true };
    } catch (error) {
      console.error('Add network error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get token balance (ERC-20)
  async getTokenBalance(tokenAddress, walletAddress) {
    try {
      if (!this.provider) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
      }

      // ERC-20 Token ABI (simplified)
      const tokenABI = [
        "function balanceOf(address) view returns (uint256)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)"
      ];

      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, this.provider);
      const balance = await tokenContract.balanceOf(walletAddress);
      const decimals = await tokenContract.decimals();
      const symbol = await tokenContract.symbol();

      return {
        balance: ethers.formatUnits(balance, decimals),
        symbol: symbol
      };
    } catch (error) {
      console.error('Token balance error:', error);
      return null;
    }
  }

  // Verify message signature
  async verifySignature(message, signature, address) {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  // Get block number
  async getBlockNumber() {
    try {
      if (!this.provider) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
      }
      
      const blockNumber = await this.provider.getBlockNumber();
      return blockNumber;
    } catch (error) {
      console.error('Block number error:', error);
      return null;
    }
  }

  // Get transaction receipt
  async getTransactionReceipt(txHash) {
    try {
      if (!this.provider) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
      }
      
      const receipt = await this.provider.getTransactionReceipt(txHash);
      return receipt;
    } catch (error) {
      console.error('Transaction receipt error:', error);
      return null;
    }
  }
}

// Create singleton instance
const web3Service = new Web3Service();
export default web3Service;