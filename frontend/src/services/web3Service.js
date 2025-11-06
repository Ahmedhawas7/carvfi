import { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Carv SVM Testnet configuration
export const CARV_SVM_CONFIG = {
  name: 'Carv SVM Testnet',
  url: 'https://svm.carv.io/chain',
  chainId: 'carv-svm-testnet',
  symbol: 'CARV',
  explorer: 'https://explorer.carv.io/'
};

export class CarvSolanaService {
  constructor() {
    this.connection = null;
    this.wallet = null;
    this.publicKey = null;
    this.isConnected = false;
    this.setupConnection();
  }

  setupConnection() {
    // Use Carv SVM RPC URL
    this.connection = new Connection(CARV_SVM_CONFIG.url, 'confirmed');
  }

  // Check if BackPack is installed
  isBackPackInstalled() {
    return typeof window !== 'undefined' && !!window.backpack;
  }

  // Connect to BackPack wallet
  async connectWallet() {
    if (!this.isBackPackInstalled()) {
      throw new Error('Please install BackPack wallet to use this dApp');
    }

    try {
      // Request connection
      const response = await window.backpack.connect();
      
      this.wallet = window.backpack;
      this.publicKey = new PublicKey(response.publicKey);
      this.isConnected = true;

      console.log('Connected to BackPack:', this.publicKey.toString());

      return {
        success: true,
        publicKey: this.publicKey.toString(),
        network: CARV_SVM_CONFIG.name
      };
    } catch (error) {
      console.error('BackPack connection failed:', error);
      throw error;
    }
  }

  // Disconnect wallet
  disconnectWallet() {
    this.wallet = null;
    this.publicKey = null;
    this.isConnected = false;
    
    if (window.backpack) {
      window.backpack.disconnect();
    }
  }

  // Get balance in CARV
  async getBalance() {
    if (!this.isConnected || !this.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      const balance = await this.connection.getBalance(this.publicKey);
      return balance / LAMPORTS_PER_SOL; // Convert lamports to CARV
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  // Get transaction history
  async getTransactions(limit = 10) {
    if (!this.isConnected || !this.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      const signatures = await this.connection.getSignaturesForAddress(this.publicKey, { limit });
      return signatures;
    } catch (error) {
      console.error('Failed to get transactions:', error);
      throw error;
    }
  }

  // Send transaction (basic implementation)
  async sendTransaction(toAddress, amount) {
    if (!this.isConnected || !this.wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      const transaction = await this.createTransferTransaction(toAddress, amount);
      const signature = await this.wallet.signAndSendTransaction(transaction);
      return signature;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  async createTransferTransaction(toAddress, amount) {
    // This is a simplified version - you'd need to implement actual transaction creation
    // based on your specific requirements
    return {
      to: toAddress,
      amount: amount * LAMPORTS_PER_SOL,
      memo: 'CARVFi Social Transaction'
    };
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      publicKey: this.publicKey ? this.publicKey.toString() : null,
      network: CARV_SVM_CONFIG.name
    };
  }
}

// Create singleton instance
const solanaService = new CarvSolanaService();
export default solanaService;