// Mock service for initial development
export const CARV_SVM_CONFIG = {
  name: 'Carv SVM Testnet',
  url: 'https://svm.carv.io/chain',
  chainId: 'carv-svm-testnet',
  symbol: 'CARV',
  explorer: 'https://explorer.carv.io/'
};

export class CarvWeb3Service {
  constructor() {
    this.currentProvider = null;
    this.isConnected = false;
    this.publicKey = null;
    this.balance = '0';
  }

  getAvailableWallets() {
    const wallets = [];
    
    if (typeof window !== 'undefined') {
      if (window.backpack) {
        wallets.push({ name: 'BackPack', type: 'injected', icon: '🎒' });
      }
      if (window.solana) {
        wallets.push({ name: 'Solana', type: 'injected', icon: '🔷' });
      }
      if (window.phantom) {
        wallets.push({ name: 'Phantom', type: 'injected', icon: '👻' });
      }
    }
    
    // Always show BackPack for demo
    if (wallets.length === 0) {
      wallets.push({ name: 'BackPack', type: 'injected', icon: '🎒' });
    }
    
    return wallets;
  }

  async connectWallet(walletType = 'backpack') {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.isConnected = true;
    this.currentProvider = walletType;
    this.publicKey = 'Ckpc8hRJ' + Math.random().toString(36).substr(2, 9) + 'GzWCeM';
    
    return {
      success: true,
      publicKey: this.publicKey,
      network: CARV_SVM_CONFIG.name,
      walletName: walletType
    };
  }

  async getBalance() {
    if (!this.isConnected) {
      throw new Error('Wallet not connected');
    }
    
    this.balance = (Math.random() * 10).toFixed(4);
    return this.balance;
  }

  async disconnectWallet() {
    this.currentProvider = null;
    this.isConnected = false;
    this.publicKey = null;
    this.balance = '0';
    return true;
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      publicKey: this.publicKey,
      network: CARV_SVM_CONFIG.name,
      walletName: this.currentProvider,
      balance: this.balance
    };
  }

  isAnyWalletAvailable() {
    return this.getAvailableWallets().length > 0;
  }
}

const web3Service = new CarvWeb3Service();
export default web3Service;