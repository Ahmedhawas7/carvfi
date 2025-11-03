import React, { useState, useEffect } from 'react';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    avatar: '',
    bio: '',
    website: '',
    twitter: '',
    github: '',
    walletAddress: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');

  useEffect(() => {
    const fetchProfile = async () => {
      setProfile({
        username: 'ahmedhawas',
        email: 'ahmed@example.com',
        avatar: '',
        bio: 'مطور ويب شغوف بتقنية Web3 ومشاريع البلوكشين',
        website: 'https://ahmedhawas.com',
        twitter: 'ahmedhawas',
        github: 'ahmedhawas7',
        walletAddress: '0x742d35Cc6634C0532925a3b8D...'
      });
    };
    
    fetchProfile();
  }, []);

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('بيانات الملف الشخصي المحفوظة:', profile);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
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

  return (
    <div className="main-content">
      <div className="card" style={{ background: 'white', border: '1px solid #e5e7eb' }}>
        <h2 style={{ 
          marginBottom: '0.5rem', 
          color: '#1f2937',
          fontSize: '1.5rem',
          fontWeight: '700'
        }}>
          الملف الشخصي
        </h2>
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '2rem',
          fontSize: '0.9rem'
        }}>
          إدارة معلومات حسابك وتخصيص ظهورك في المنصة
        </p>
        
        <form onSubmit={handleSaveProfile}>
          {/* صورة الملف الشخصي */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ 
                width: '100px', 
                height: '100px',
                background: profile.avatar ? 'transparent' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                color: 'white',
                marginBottom: '1rem',
                border: '4px solid white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  '👤'
                )}
              </div>
              
              <label 
                htmlFor="avatar-upload"
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: '#6366f1',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
                onMouseOver={(e) => e.target.style.background = '#4f46e5'}
                onMouseOut={(e) => e.target.style.background = '#6366f1'}
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
            <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              انقر على الأيقونة لتغيير الصورة
            </p>
          </div>

          {/* معلومات الأساسية */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#374151', 
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                اسم المستخدم *
              </label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="ادخل اسم المستخدم"
                required
                style={{ 
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: '#1f2937',
                  background: 'white',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#374151', 
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="ادخل بريدك الإلكتروني"
                required
                style={{ 
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: '#1f2937',
                  background: 'white',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>

          {/* عنوان المحفظة */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: '#374151', 
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              عنوان المحفظة (Web3)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={profile.walletAddress}
                readOnly
                style={{ 
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: '#6b7280',
                  background: '#f9fafb',
                  cursor: 'not-allowed'
                }}
              />
              <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                <span style={{ 
                  fontSize: '0.7rem', 
                  background: '#10b981', 
                  color: 'white', 
                  padding: '0.3rem 0.6rem', 
                  borderRadius: '6px',
                  fontWeight: '600'
                }}>
                  متصل
                </span>
              </div>
            </div>
          </div>

          {/* السيرة الذاتية */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: '#374151', 
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              السيرة الذاتية
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={3}
              placeholder="اخبرنا عن نفسك وخبراتك..."
              style={{ 
                width: '100%', 
                resize: 'vertical',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#1f2937',
                background: 'white',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          {/* حسابات التواصل الاجتماعي */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: '#1f2937', 
              marginBottom: '1rem', 
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              حسابات التواصل الاجتماعي
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: '#374151', 
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  الموقع الإلكتروني
                </label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://example.com"
                  style={{ 
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    color: '#1f2937',
                    background: 'white',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: '#374151', 
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    Twitter
                  </label>
                  <input
                    type="text"
                    value={profile.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    placeholder="اسم المستخدم"
                    style={{ 
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      color: '#1f2937',
                      background: 'white',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: '#374151', 
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    GitHub
                  </label>
                  <input
                    type="text"
                    value={profile.github}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    placeholder="اسم المستخدم"
                    style={{ 
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      color: '#1f2937',
                      background: 'white',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* أزرار الحفظ */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="button"
              style={{ 
                padding: '0.75rem 1.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                background: 'white',
                color: '#374151',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#f9fafb'}
              onMouseOut={(e) => e.target.style.background = 'white'}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{ 
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                background: isLoading ? '#9ca3af' : '#6366f1',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '140px'
              }}
              onMouseOver={(e) => !isLoading && (e.target.style.background = '#4f46e5')}
              onMouseOut={(e) => !isLoading && (e.target.style.background = '#6366f1')}
            >
              {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>

          {/* رسالة الحالة */}
          {saveStatus === 'success' && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#ecfdf5',
              border: '1px solid #10b981',
              color: '#065f46',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              ✓ تم حفظ التغييرات بنجاح
            </div>
          )}
          
          {saveStatus === 'error' && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#fef2f2',
              border: '1px solid #ef4444',
              color: '#991b1b',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              ✗ حدث خطأ أثناء الحفظ، يرجى المحاولة مرة أخرى
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
