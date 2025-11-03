import React, { useState, useEffect } from 'react';

const UserProfile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = () => {
    // تحميل البيانات من localStorage أو إنشاء بيانات جديدة
    const savedProfile = localStorage.getItem(`carvfi_profile_${user.address}`);
    
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      setEditForm(parsedProfile);
    } else {
      // بيانات افتراضية جديدة
      const defaultProfile = {
        username: user.type === 'evm' 
          ? `user_${user.address.substring(2, 8)}` 
          : `sol_${user.address.substring(0, 6)}`,
        avatar: '',
        bio: 'Web3 enthusiast and CARVFi user',
        joinDate: Date.now(),
        reputation: 85,
        totalPoints: 150,
        socialLinks: ['', ''],
        isVerified: false
      };
      
      setProfile(defaultProfile);
      setEditForm(defaultProfile);
      // حفظ البيانات الافتراضية
      localStorage.setItem(`carvfi_profile_${user.address}`, JSON.stringify(defaultProfile));
    }

    // بيانات المحفظة
    const walletInfo = user.type === 'evm' 
      ? { balance: '2.5 ETH', network: 'Ethereum', transactions: 15 }
      : { balance: '45 SOL', network: 'Solana', transactions: 8 };

    setWalletData(walletInfo);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // إذا كان في وضع التعديل وضغط Cancel، نرجع للبيانات الأصلية
      setEditForm(profile);
    }
    setIsEditing(!isEditing);
    setSaveStatus('');
  };

  const handleSaveProfile = () => {
    try {
      // حفظ البيانات الجديدة
      const updatedProfile = {
        ...editForm,
        lastUpdated: Date.now()
      };
      
      setProfile(updatedProfile);
      localStorage.setItem(`carvfi_profile_${user.address}`, JSON.stringify(updatedProfile));
      setIsEditing(false);
      setSaveStatus('success');
      
      // إخفاء رسالة النجاح بعد 3 ثواني
      setTimeout(() => setSaveStatus(''), 3000);
      
      // إضافة نقاط لتحديث البروفيل
      addPoints(5, 'profile_update');
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
    }
  };

  const addPoints = (points, reason) => {
    const currentPoints = profile.totalPoints || 0;
    const updatedProfile = {
      ...profile,
      totalPoints: currentPoints + points
    };
    
    setProfile(updatedProfile);
    localStorage.setItem(`carvfi_profile_${user.address}`, JSON.stringify(updatedProfile));
    
    // تسجيل النشاط
    const activity = {
      type: reason,
      points: points,
      timestamp: Date.now(),
      description: getActivityDescription(reason)
    };
    
    saveActivity(activity);
  };

  const getActivityDescription = (reason) => {
    const descriptions = {
      'profile_update': 'Profile updated',
      'ai_chat': 'AI chat interaction',
      'social_action': 'Social activity'
    };
    return descriptions[reason] || 'Activity';
  };

  const saveActivity = (activity) => {
    const activities = JSON.parse(localStorage.getItem(`carvfi_activities_${user.address}`) || '[]');
    activities.unshift(activity);
    
    // حفظ فقط آخر 10 أنشطة
    if (activities.length > 10) {
      activities.pop();
    }
    
    localStorage.setItem(`carvfi_activities_${user.address}`, JSON.stringify(activities));
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (index, value) => {
    const newSocialLinks = [...editForm.socialLinks];
    newSocialLinks[index] = value;
    setEditForm(prev => ({
      ...prev,
      socialLinks: newSocialLinks
    }));
  };

  const addSocialLink = () => {
    setEditForm(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, '']
    }));
  };

  const removeSocialLink = (index) => {
    const newSocialLinks = editForm.socialLinks.filter((_, i) => i !== index);
    setEditForm(prev => ({
      ...prev,
      socialLinks: newSocialLinks
    }));
  };

  const getActivities = () => {
    const activities = JSON.parse(localStorage.getItem(`carvfi_activities_${user.address}`) || '[]');
    return activities.slice(0, 5); // آخر 5 أنشطة فقط
  };

  if (!profile || !walletData) {
    return (
      <div className="card">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  const activities = getActivities();

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
            {profile.isVerified ? 'Verified ✅' : 'Not Verified ⏳'}
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

        <div className="profile-actions">
          <button 
            className={`btn ${isEditing ? 'btn-cancel' : 'btn-edit'}`}
            onClick={handleEditToggle}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
          
          {isEditing && (
            <button 
              className="btn btn-save"
              onClick={handleSaveProfile}
            >
              💾 Save Changes
            </button>
          )}
        </div>

        {saveStatus === 'success' && (
          <div className="save-status success">
            ✅ Profile saved successfully! +5 points
          </div>
        )}
        
        {saveStatus === 'error' && (
          <div className="save-status error">
            ❌ Error saving profile
          </div>
        )}
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <div className="card">
          <h3>✏️ Edit Profile</h3>
          <div className="edit-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={editForm.username || ''}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group">
              <label>Avatar URL</label>
              <input
                type="text"
                value={editForm.avatar || ''}
                onChange={(e) => handleInputChange('avatar', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={editForm.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Social Links</label>
              {editForm.socialLinks?.map((link, index) => (
                <div key={index} className="social-link-input">
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                  {editForm.socialLinks.length > 1 && (
                    <button 
                      type="button"
                      className="btn-remove"
                      onClick={() => removeSocialLink(index)}
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                className="btn btn-add"
                onClick={addSocialLink}
              >
                + Add Social Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Info Card */}
      <div className="card">
        <h3>💰 Wallet Information</h3>
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
        <h3>📊 Recent Activity</h3>
        <div className="activity-list">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'profile_update' && '✏️'}
                  {activity.type === 'ai_chat' && '🤖'}
                  {activity.type === 'social_action' && '💬'}
                </div>
                <div className="activity-info">
                  <div className="activity-title">{activity.description}</div>
                  <div className="activity-time">
                    {new Date(activity.timestamp).toLocaleDateString()} • {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="activity-points">+{activity.points}</div>
              </div>
            ))
          ) : (
            <div className="no-activities">
              No activities yet. Start by editing your profile or chatting with AI!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
