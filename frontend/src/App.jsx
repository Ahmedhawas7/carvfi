import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import UserProfile from './components/UserProfile'
import AIChat from './components/AIChat'
import RewardsDashboard from './components/RewardsDashboard'
import BotProtection from './components/BotProtection'
import { CarvService } from './services/carv'
import './App.css'

function App() {
  const [account, setAccount] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [contracts, setContracts] = useState({})
  const [carvService, setCarvService] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      // Initialize Carv Service
      const carv = new CarvService()
      setCarvService(carv)

      // Check if wallet is connected
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.send('eth_requestAccounts', [])
        setAccount(accounts[0])
        
        // Initialize contracts
        await initializeContracts(provider)
      }
    } catch (error) {
      console.error('Error initializing app:', error)
    }
  }

  const initializeContracts = async (provider) => {
    // These addresses should be updated after deployment
    const contractAddresses = {
      userProfile: '0x...', // سيتم تحديثها بعد النشر
      socialRewards: '0x...',
      botProtection: '0x...'
    }

    // TODO: إضافة ABI للعقود
    const contracts = {
      // userProfile: new ethers.Contract(contractAddresses.userProfile, UserProfileABI, provider.getSigner()),
      // socialRewards: new ethers.Contract(contractAddresses.socialRewards, SocialRewardsABI, provider.getSigner()),
      // botProtection: new ethers.Contract(contractAddresses.botProtection, BotProtectionABI, provider.getSigner())
    }

    setContracts(contracts)
  }

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        setAccount(accounts[0])
        initializeApp()
      } else {
        alert('Please install MetaMask!')
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  if (!account) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', maxWidth: '500px', margin: '100px auto' }}>
          <h1 style={{ marginBottom: '20px', color: 'white' }}>🌐 CARVFi</h1>
          <h2 style={{ marginBottom: '30px', color: 'white' }}>Social FI on Carv Network</h2>
          <button className="btn" onClick={connectWallet} style={{ fontSize: '18px', padding: '15px 30px' }}>
            Connect Wallet to Start
          </button>
          <div style={{ marginTop: '30px', color: 'white', opacity: 0.8 }}>
            <p>✨ Create your social profile</p>
            <p>🤖 Chat with AI assistant</p>
            <p>🛡️ Advanced bot protection</p>
            <p>💰 Earn rewards for activities</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '2.5em' }}>🌐 CARVFi</h1>
          <p style={{ color: 'white', opacity: 0.8 }}>Social FI Platform on Carv Network</p>
        </div>
        <div style={{ color: 'white', textAlign: 'right' }}>
          <p>Connected: {account.substring(0, 6)}...{account.substring(38)}</p>
          <p style={{ fontSize: '0.9em', opacity: 0.7 }}>Carv Testnet</p>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['profile', 'rewards', 'protection', 'ai'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'btn' : 'btn btn-secondary'}
            onClick={() => setActiveTab(tab)}
            style={{ textTransform: 'capitalize' }}
          >
            {tab === 'ai' ? 'AI Chat' : tab}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main>
        {activeTab === 'profile' && (
          <UserProfile 
            account={account} 
            contracts={contracts}
            carvService={carvService}
          />
        )}
        
        {activeTab === 'rewards' && (
          <RewardsDashboard 
            account={account}
            contracts={contracts}
          />
        )}
        
        {activeTab === 'protection' && (
          <BotProtection 
            account={account}
            contracts={contracts}
          />
        )}
        
        {activeTab === 'ai' && (
          <AIChat 
            account={account}
            contracts={contracts}
          />
        )}
      </main>

      {/* AI Chat Widget */}
      <AIChat 
        account={account}
        contracts={contracts}
        widgetMode={true}
      />
    </div>
  )
}

export default App
