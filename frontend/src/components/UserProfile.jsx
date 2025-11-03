import React, { useState, useEffect } from 'react';

const UserProfile = ({ user, carvService, solanaService }) => {
  const [profile, setProfile] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    // بيانات تجريبية للبروفيل
    const mockProfile = {
      username: user.type === 'evm' 
        ? `user_${user.address.substring(2, 8)}` 
        : `sol_${user.address.substring(0, 6)}`,
      avatar: '',
      bio: 'Web3 enthusiast and CARVFi user',
      joinDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
      reputation: 85,
      totalPoints: 150,
      socialLinks: []
    };

    // بيانات المحفظة
    let walletInfo = {};
    if (user.type === 'evm') {
      walletInfo = {
        balance: '2.5 ETH',
        network: 'Ethereum',
        transactions: 15
      };
    } else {
      walletInfo = {
        balance: '45 SOL',
        network: 'Solana',
        transactions: 8
      };
    }

    setProfile(mockProfile);
    setWalletData(walletInfo);
  };

  if (!profile || !walletData) {
    return (
      <div className="card">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="grid">
      {/* Profile Card */}
      <div className="card">
        <div className="profile-header">
          <div className="avatar">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile" />
            ) : (
              '👤'
            )}
          </div>
          <h2>{profile.username}</h2>
          <p>{profile.bio}</p>
          <div className="verification-badge">
            {profile.reputation >= 80 ? 'Verified' : 'Unverified'}
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <div className="stat-value">{profile.reputation}</div>
            <div className="stat-label">Reputation</div>
          </div>
          <div className="stat">
            <div className="stat-value">{profile.totalPoints}</div>
            <div className="stat-label">Points</div>
          </div>
          <div className="stat">
            <div className="stat-value">
              {Math.floor((Date.now() - profile.joinDate) / (24 * 60 * 60 * 1000))}
            </div>
            <div className="stat-label">Days</div>
          </div>
        </div>

        <button 
          className="btn" 
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Wallet Info Card */}
      <div className="card">
        <h3>Wallet Information</h3>
        <div className="wallet-details">
          <div className="wallet-item">
            <span className="label">Network:</span>
            <span className="value">{walletData.network}</span>
          </div>
          <div className="wallet-item">
            <span className="label">Balance:</span>
            <span className="value">{walletData.balance}</span>
          </div>
          <div className="wallet-item">
            <span className="label">Transactions:</span>
            <span className="value">{walletData.transactions}</span>
          </div>
          <div className="wallet-item">
            <span className="label">Address:</span>
            <span className="value address">{user.address}</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="card">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">🔄</div>
            <div className="activity-info">
              <div className="activity-title">Profile Updated</div>
              <div className="activity-time">2 hours ago</div>
            </div>
            <div className="activity-points">+5 pts</div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🤖</div>
            <div className="activity-info">
              <div className="activity-title">AI Chat Session</div>
              <div className="activity-time">1 day ago</div>
            </div>
            <div className="activity-points">+10 pts</div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🔗</div>
            <div className="activity-info">
              <div className="activity-title">Wallet Connected</div>
              <div className="activity-time">3 days ago</div>
            </div>
            <div className="activity-points">+25 pts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
