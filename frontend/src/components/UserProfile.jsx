import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ user }) => {
  const [profile, setProfile] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    carvPlayUsername: '',
    carvUID: '',
    twitter: '',
    telegram: '',
    avatar: '',
    bio: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        carvPlayUsername: user.carvPlayUsername || '',
        carvUID: user.carvUID || '',
        twitter: user.twitter || '',
        telegram: user.telegram || '',
        avatar: user.avatar || '',
        bio: user.bio || 'مطور ويب شغوف بتقنية Web3 ومشاريع البلوكشين'
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // حفظ البيانات في localStorage
      const updatedUser = {
        ...user,
        ...profile,
        lastUpdated: new Date().toISOString()
      };

      const users = JSON.parse(localStorage.getItem('carvfi_users') || '{}');
      const userKey = user.walletAddress?.toLowerCase();
      users[userKey] = updatedUser;
      localStorage.setItem('carvfi_users', JSON.stringify(users));
      localStorage.setItem('carvfi_current_user', JSON.stringify(updatedUser));

      // حفظ النشاط
      const activities = JSON.parse(localStorage.getItem('carvfi_activities') || '{}');
      if (!activities[userKey]) {
        activities[userKey] = [];
      }
      activities[userKey].unshift({
        id: Date.now().toString(),
        type: 'profile_update',
        description: 'Profile updated successfully',
        points: 5,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('carvfi_activities', JSON.stringify(activities));

      console.log('✅ Profile data saved successfully');
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('avatar', e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  if (!user) {
    return (
      <div className="main-content">
        <div className="card" style={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          textAlign: 'center',
          padding: '3rem'
        }}>
          <h2>No User Data</h2>
          <p>Please go back to dashboard</p>
          <button
            onClick={handleBackToDashboard}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ 
            color: 'var(--text-primary)', 
            marginBottom: '0.5rem', 
            fontSize: '2rem', 
            fontWeight: 'bold' 
          }}>
            Profile Settings 👤
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Manage your account information and preferences
          </p>
        </div>
        <button
          onClick={handleBackToDashboard}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.background = 'var(--primary-dark)'}
          onMouseOut={(e) => e.target.style.background = 'var(--primary)'}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="card" style={{ 
        background: 'var(--glass)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--glass-border)',
        borderRadius: '16px',
        padding: '2rem'
      }}>
        <form onSubmit={handleSaveProfile}>
          {/* Profile Picture */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ 
                width: '120px', 
                height: '120px',
                background: profile.avatar ? 'transparent' : 'linear-gradient(135deg, var(--primary), #8b5cf6)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                color: 'white',
                marginBottom: '1rem',
                border: '4px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
              }}>
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  profile.firstName?.charAt(0) || '👤'
                )}
              </div>
              
              <label 
                htmlFor="avatar-upload"
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: 'var(--primary)',
                  color: 'white',
                  padding: '0.6rem',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '3px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
                onMouseOver={(e) => e.target.style.background = 'var(--primary-dark)'}
                onMouseOut={(e) => e.target.style.background = 'var(--primary)'}
              >
                📷
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Click the icon to change profile picture
            </p>
          </div>

          {/* Basic Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              marginBottom: '1.5rem', 
              fontSize: '1.3rem',
              fontWeight: '600',
              borderBottom: '2px solid var(--glass-border)',
              paddingBottom: '0.5rem'
            }}>
              Basic Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: 'var(--text-primary)', 
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Username *
                </label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter username"
                  required
                  style={{ 
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: 'var(--text-primary)', 
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={{ 
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: 'var(--text-primary)', 
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  First Name *
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="First name"
                  required
                  style={{ 
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: 'var(--text-primary)', 
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Last name"
                  required
                  style={{ 
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>
            </div>
          </div>

          {/* Carv Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              marginBottom: '1.5rem', 
              fontSize: '1.3rem',
              fontWeight: '600',
              borderBottom: '2px solid var(--glass-border)',
              paddingBottom: '0.5rem'
            }}>
              Carv Information (Optional)
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: 'var(--text-primary)', 
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Carv Play Username
                </label>
                <input
                  type="text"
                  value={profile.carvPlayUsername}
                  onChange={(e) => handleInputChange('carvPlayUsername', e.target.value)}
                  placeholder="Your Carv Play username"
                  style={{ 
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: 'var(--text-primary)', 
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Carv UID
                </label>
                <input
                  type="text"
                  value={profile.carvUID}
                  onChange={(e) => handleInputChange('carvUID', e.target.value)}
                  placeholder="Your Carv UID"
                  style={{ 
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              marginBottom: '1.5rem', 
              fontSize: '1.3rem',
              fontWeight: '600',
              borderBottom: '2px solid var(--glass-border)',
              paddingBottom: '0.5rem'
            }}>
              Social Media (Optional)
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: 'var(--text-primary)', 
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Twitter
                </label>
                <input
                  type="text"
                  value={profile.twitter}
                  onChange={(e) => handleInputChange('twitter', e.target.value)}
                  placeholder="@username"
                  style={{ 
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: 'var(--text-primary)', 
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Telegram
                </label>
                <input
                  type="text"
                  value={profile.telegram}
                  onChange={(e) => handleInputChange('telegram', e.target.value)}
                  placeholder="@username"
                  style={{ 
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: 'var(--text-primary)', 
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={3}
              placeholder="Tell us about yourself..."
              style={{ 
                width: '100%', 
                resize: 'vertical',
                padding: '0.75rem 1rem',
                border: '1px solid var(--glass-border)',
                borderRadius: '10px',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                background: 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
            />
          </div>

          {/* Wallet Address (Read-only) */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: 'var(--text-primary)', 
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Wallet Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={user.walletAddress}
                readOnly
                style={{ 
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  cursor: 'not-allowed'
                }}
              />
              <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                <span style={{ 
                  fontSize: '0.7rem', 
                  background: '#10b981', 
                  color: 'white', 
                  padding: '0.3rem 0.6rem', 
                  borderRadius: '6px',
                  fontWeight: '600'
                }}>
                  Connected
                </span>
              </div>
            </div>
          </div>

          {/* Save Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="button"
              onClick={handleBackToDashboard}
              style={{ 
                padding: '0.75rem 1.5rem',
                border: '1px solid var(--glass-border)',
                borderRadius: '10px',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseOut={(e) => e.target.style.background = 'transparent'}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{ 
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '10px',
                background: isLoading ? 'var(--text-muted)' : 'var(--primary)',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '140px'
              }}
              onMouseOver={(e) => !isLoading && (e.target.style.background = 'var(--primary-dark)')}
              onMouseOut={(e) => !isLoading && (e.target.style.background = 'var(--primary)')}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Status Messages */}
          {saveStatus === 'success' && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              borderRadius: '10px',
              textAlign: 'center',
              fontSize: '0.9rem',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}>
              ✅ Changes saved successfully
            </div>
          )}
          
          {saveStatus === 'error' && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              borderRadius: '10px',
              textAlign: 'center',
              fontSize: '0.9rem',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}>
              ❌ Error saving changes, please try again
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserProfile;