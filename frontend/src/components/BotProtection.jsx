import React, { useState, useEffect } from 'react'

const BotProtection = ({ account, contracts }) => {
  const [userBehavior, setUserBehavior] = useState(null)
  const [securityScore, setSecurityScore] = useState(0)
  const [threats, setThreats] = useState([])

  useEffect(() => {
    loadSecurityData()
  }, [account])

  const loadSecurityData = async () => {
    // بيانات تجريبية
    const mockBehavior = {
      interactionCount: 42,
      lastInteraction: Date.now(),
      isSuspicious: false
    }

    const mockThreats = [
      { id: 1, type: 'bot_detection', severity: 'low', description: 'نشاط عادي - لا توجد تهديدات', resolved: true },
      { id: 2, type: 'sybil_attack', severity: 'medium', description: 'محاولة إحالة متعددة مشبوهة', resolved: false },
      { id: 3, type: 'spam_prevention', severity: 'low', description: 'منع رسائل سبام تلقائياً', resolved: true }
    ]

    setUserBehavior(mockBehavior)
    setSecurityScore(85) // درجة أمان من 100
    setThreats(mockThreats)
  }

  const getSecurityColor = (score) => {
    if (score >= 80) return 'var(--success)'
    if (score >= 60) return 'var(--warning)'
    return 'var(--error)'
  }

  const getThreatIcon = (severity) => {
    const icons = {
      'low': '🟢',
      'medium': '🟡',
      'high': '🔴'
    }
    return icons[severity] || '⚪'
  }

  const runSecurityScan = async () => {
    try {
      // محاكاة فحص أمني
      console.log('Running security scan...')
      alert('جاري فحص الأمان... سيتم تحديث النتائج قريباً.')
    } catch (error) {
      console.error('Error running security scan:', error)
    }
  }

  return (
    <div className="grid">
      {/* نظرة عامة على الأمان */}
      <div className="card">
        <h3>🛡️ حماية CARVFi المتقدمة</h3>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          نظام ذكي لاكتشاف الثغرات ومنع الروبوتات وحماية المجتمع
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: `conic-gradient(${getSecurityColor(securityScore)} ${securityScore * 3.6}deg, #e2e8f0 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '20px'
            }}>
              {securityScore}
            </div>
          </div>
          <div>
            <h4>درجة الأمان</h4>
            <p style={{ color: getSecurityColor(securityScore), fontWeight: 'bold' }}>
              {securityScore >= 80 && 'ممتاز'}
              {securityScore >= 60 && securityScore < 80 && 'جيد'}
              {securityScore < 60 && 'يحتاج تحسين'}
            </p>
            <button className="btn" onClick={runSecurityScan} style={{ marginTop: '10px' }}>
              فحص أمان
            </button>
          </div>
        </div>
      </div>

      {/* إحصائيات السلوك */}
      {userBehavior && (
        <div className="card">
          <h4>📊 تحليل السلوك</h4>
          <div className="stats">
            <div className="stat">
              <div className="stat-value">{userBehavior.interactionCount}</div>
              <div className="stat-label">تفاعلات</div>
            </div>
            <div className="stat">
              <div className="stat-value">
                {userBehavior.isSuspicious ? '⚠️' : '✅'}
              </div>
              <div className="stat-label">الحالة</div>
            </div>
            <div className="stat">
              <div className="stat-value">
                {Math.floor((Date.now() - userBehavior.lastInteraction) / (60 * 1000))}
              </div>
              <div className="stat-label">دقائق منذ آخر تفاعل</div>
            </div>
          </div>
        </div>
      )}

      {/* التهديدات والإنذارات */}
      <div className="card">
        <h4>🚨 التهديدات المكتشفة</h4>
        <div style={{ marginTop: '15px' }}>
          {threats.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
              لا توجد تهديدات - كل شيء آمن
            </p>
          ) : (
            threats.map(threat => (
              <div key={threat.id} style={{
                padding: '15px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                marginBottom: '10px',
                background: threat.resolved ? '#f0fff4' : '#fff5f5'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>
                      {getThreatIcon(threat.severity)}
                    </span>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {threat.description}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        خطورة: {threat.severity === 'low' && 'منخفضة'}
                        {threat.severity === 'medium' && 'متوسطة'}
                        {threat.severity === 'high' && 'عالية'}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 8px',
                    background: threat.resolved ? 'var(--success)' : 'var(--error)',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {threat.resolved ? 'تم الحل' : 'قيد المعالجة'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ميزات الحماية */}
      <div className="card">
        <h4>🔒 ميزات الحماية النشطة</h4>
        <div style={{ marginTop: '15px' }}>
          {[
            'كشف الروبوتات الذكي',
            'منع هجمات سيبيل',
            'تحليل سلوك المستخدم',
            'الذكاء الاصطناعي لاكتشاف الثغرات',
            'حماية من السبام',
            'مراقبة النشاط المشبوه'
          ].map((feature, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <span style={{ color: 'var(--success)' }}>✅</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* نصائح أمنية */}
      <div className="card">
        <h4>💡 نصائح أمنية</h4>
        <div style={{ marginTop: '15px', padding: '15px', background: '#e6f3ff', borderRadius: '8px' }}>
          <ul style={{ paddingLeft: '20px' }}>
            <li>لا تشارك معلومات محفظتك مع أي شخص</li>
            <li>استخدم كلمات مرور قوية</li>
            <li>تأكد من تحديث التطبيق دائماً</li>
            <li>أبلغ عن أي نشاط مشبوه فوراً</li>
            <li>تفقد درجة الأمان بانتظام</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BotProtection
