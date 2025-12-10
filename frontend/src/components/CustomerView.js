// /frontend/src/components/CustomerView.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext'; // Adjust path if needed

export default function CustomerView({ onLogout }) {
  const { sessionId, userEmail } = useContext(AuthContext);
  
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch customer quotations on mount
  useEffect(() => {
    async function loadCustomerData() {
      if (!userEmail || !sessionId) return;

      try {
        // Step 1: Get customer ID from email
        const customerRes = await fetch(
          `http://localhost:5000/customer/by-email/${userEmail}`,
          {
            headers: { "x-session-id": sessionId }
          }
        );
        
        if (!customerRes.ok) {
          console.error("Customer not found");
          setLoading(false);
          return;
        }

        const customerData = await customerRes.json();
        const customerId = customerData._id; // Local variable instead of state

        // Step 2: Get quotations for this customer
        const quotationsRes = await fetch(
          `http://localhost:5000/quotation/customer/${customerId}`,
          {
            headers: { "x-session-id": sessionId }
          }
        );

        if (quotationsRes.ok) {
          const quotationsData = await quotationsRes.json();
          setQuotations(quotationsData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading customer data:", error);
        setLoading(false);
      }
    }

    loadCustomerData();
  }, [userEmail, sessionId]);

  // Format quotations for display
  const formattedQuotations = quotations.map(q => ({
    id: q.quotationId,
    project: `Quotation ${q.quotationId}`,
    executive: 'Sales Executive',
    items: q.items?.length || 0,
    amount: `₹${q.pricing?.grandTotal?.toLocaleString() || 0}`,
    status: q.status === 'pending' ? 'Pending Review' : 
            q.status === 'approved' ? 'Approved' : 'In Progress',
    date: q.date,
    deadline: q.date,
    description: `${q.items?.length || 0} items in this quotation`
  }));

  // Stats based on real data
  const customerStats = [
    { 
      label: 'Active Quotations', 
      value: quotations.filter(q => q.status === 'pending').length.toString(),
      icon: '📋',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    { 
      label: 'Approved Projects', 
      value: quotations.filter(q => q.status === 'approved').length.toString(),
      icon: '✅',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    { 
      label: 'Total Investment', 
      value: `₹${(quotations.reduce((sum, q) => sum + (q.pricing?.grandTotal || 0), 0) / 100000).toFixed(1)}L`,
      icon: '💰',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    { 
      label: 'Pending Review', 
      value: quotations.filter(q => q.status === 'pending').length.toString(),
      icon: '⏳',
      color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
    }
  ];

  // Keep the old mock data arrays below for now (timeline, etc.)

  const timeline = [
    { date: '2024-12-08', event: 'New quotation received', type: 'info', quote: 'Q-2024-156' },
    { date: '2024-12-05', event: 'Payment processed', type: 'success', quote: 'Q-2024-148' },
    { date: '2024-12-01', event: 'Quotation approved', type: 'success', quote: 'Q-2024-148' },
    { date: '2024-11-28', event: 'Revision requested', type: 'warning', quote: 'Q-2024-142' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      padding: '40px'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        padding: '32px 40px',
        borderRadius: '20px',
        marginBottom: '32px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '40px' }}>👤</span>
            <h1 style={{ 
              margin: 0,
              fontSize: '32px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Customer Portal
            </h1>
          </div>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '15px' }}>
            Welcome back! Review and manage your quotations
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={() => setShowFeedbackModal(true)}
            style={{
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(79, 172, 254, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '15px'
            }}
          >
            <span>💬</span> Send Feedback
          </button>
          <button 
            onClick={onLogout}
            style={{
              padding: '14px 24px',
              background: 'white',
              color: '#4facfe',
              border: '2px solid #4facfe',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '15px'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {customerStats.map((stat, idx) => (
          <div 
            key={idx}
            style={{
              background: 'white',
              padding: '28px',
              borderRadius: '20px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: stat.color
            }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ 
                  margin: '0 0 8px 0', 
                  color: '#6b7280', 
                  fontSize: '14px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {stat.label}
                </p>
                <h2 style={{ 
                  margin: 0,
                  fontSize: '36px',
                  fontWeight: '800',
                  background: stat.color,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {stat.value}
                </h2>
              </div>
              <div style={{
                fontSize: '48px',
                opacity: 0.2
              }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '32px',
        marginBottom: '32px'
      }}>
        {/* Quotations List */}
        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)'
        }}>
          <h3 style={{ 
            margin: '0 0 24px 0',
            fontSize: '22px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>📋</span> Your Quotations
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {loading ? (
                          <div style={{ 
                            padding: '40px', 
                            textAlign: 'center', 
                            color: '#6b7280',
                            fontSize: '15px'
                          }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                            Loading your quotations...
                          </div>
                        ) : formattedQuotations.length === 0 ? (
                          <div style={{ 
                            padding: '60px 40px', 
                            textAlign: 'center',
                            background: 'rgba(79, 172, 254, 0.03)',
                            borderRadius: '16px',
                            border: '2px dashed rgba(79, 172, 254, 0.2)'
                          }}>
                            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
                            <h3 style={{ 
                              margin: '0 0 8px 0', 
                              color: '#1f2937',
                              fontSize: '18px',
                              fontWeight: '700'
                            }}>
                              No Quotations Yet
                            </h3>
                            <p style={{ 
                              margin: 0, 
                              color: '#6b7280',
                              fontSize: '14px'
                            }}>
                              Your sales executive will create a quotation for you soon!
                            </p>
                          </div>
                        ) : (
                          formattedQuotations.map(quote => (
                            <div key={quote.id} style={{
                              padding: '24px',
                              background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.03), rgba(0, 242, 254, 0.03))',
                              borderRadius: '16px',
                              border: '2px solid rgba(79, 172, 254, 0.1)',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer'
                            }}
                            onClick={() => console.log('View quote:', quote)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateX(4px)';
                              e.currentTarget.style.boxShadow = '0 8px 24px rgba(79, 172, 254, 0.15)';
                              e.currentTarget.style.borderColor = 'rgba(79, 172, 254, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateX(0)';
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.borderColor = 'rgba(79, 172, 254, 0.1)';
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div>
                                  <p style={{ 
                                    margin: '0 0 4px 0',
                                    fontWeight: '700',
                                    fontSize: '18px',
                                    color: '#1f2937'
                                  }}>
                                    {quote.project}
                                  </p>
                                  <p style={{ 
                                    margin: '0 0 8px 0',
                                    fontSize: '13px',
                                    color: '#4facfe',
                                    fontWeight: '600'
                                  }}>
                                    {quote.id} • {quote.executive}
                                  </p>
                                </div>
                                <span style={{
                                  padding: '8px 16px',
                                  borderRadius: '10px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  background: quote.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : quote.status === 'Pending Review' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                  color: quote.status === 'Approved' ? '#10b981' : quote.status === 'Pending Review' ? '#f59e0b' : '#3b82f6'
                                }}>
                                  {quote.status}
                                </span>
                              </div>

                              <p style={{ 
                                margin: '0 0 16px 0',
                                fontSize: '14px',
                                color: '#6b7280',
                                lineHeight: '1.6'
                              }}>
                                {quote.description}
                              </p>

                              <div style={{ 
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '16px',
                                borderTop: '1px solid rgba(0,0,0,0.05)'
                              }}>
                                <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#6b7280' }}>
                                  <span>📦 {quote.items} items</span>
                                  <span>📅 Due: {quote.deadline}</span>
                                </div>
                                <p style={{ 
                                  margin: 0,
                                  fontSize: '24px',
                                  fontWeight: '800',
                                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent'
                                }}>
                                  {quote.amount}
                                </p>
                              </div>

                              {quote.status === 'Pending Review' && (
                                <div style={{ 
                                  display: 'flex',
                                  gap: '12px',
                                  marginTop: '16px'
                                }}>
                                  <button style={{
                                    flex: 1,
                                    padding: '12px',
                                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                  }}>
                                    ✅ Approve
                                  </button>
                                  <button style={{
                                    flex: 1,
                                    padding: '12px',
                                    background: 'white',
                                    color: '#f59e0b',
                                    border: '2px solid #f59e0b',
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                  }}>
                                    📝 Request Changes
                                  </button>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                      </div>
                    </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Timeline */}
          <div style={{
            background: 'white',
            padding: '28px',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0',
              fontSize: '18px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⏱️</span> Recent Activity
            </h3>

            <div style={{ position: 'relative' }}>
              {/* Timeline line */}
              <div style={{
                position: 'absolute',
                left: '10px',
                top: '12px',
                bottom: '12px',
                width: '2px',
                background: 'linear-gradient(180deg, #4facfe, #00f2fe)'
              }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {timeline.map((item, idx) => (
                  <div key={idx} style={{ position: 'relative', paddingLeft: '32px' }}>
                    <div style={{
                      position: 'absolute',
                      left: '4px',
                      top: '4px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: item.type === 'success' ? '#10b981' : item.type === 'warning' ? '#f59e0b' : '#4facfe',
                      border: '3px solid white',
                      boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
                    }} />
                    <p style={{ 
                      margin: '0 0 4px 0',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937'
                    }}>
                      {item.event}
                    </p>
                    <p style={{ 
                      margin: '0 0 2px 0',
                      fontSize: '12px',
                      color: '#4facfe',
                      fontWeight: '600'
                    }}>
                      {item.quote}
                    </p>
                    <p style={{ 
                      margin: 0,
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      {item.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div style={{
            background: 'white',
            padding: '28px',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)'
          }}>
            <h3 style={{ 
              margin: '0 0 16px 0',
              fontSize: '18px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>💡</span> Need Help?
            </h3>
            <p style={{ 
              margin: '0 0 20px 0',
              fontSize: '14px',
              color: '#6b7280',
              lineHeight: '1.6'
            }}>
              Our support team is here to help you with any questions about your quotations.
            </p>
            <button style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span>📞</span> Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        {[
          { icon: '📄', label: 'View All Quotes', color: '#4facfe' },
          { icon: '💾', label: 'Download PDFs', color: '#00f2fe' },
          { icon: '📊', label: 'Payment History', color: '#43e97b' },
          { icon: '⭐', label: 'Rate Service', color: '#fbc2eb' }
        ].map((action, idx) => (
          <div key={idx} style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center',
            borderTop: `4px solid ${action.color}`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>{action.icon}</div>
            <p style={{ 
              margin: 0,
              fontWeight: '600',
              fontSize: '15px',
              color: action.color
            }}>
              {action.label}
            </p>
          </div>
        ))}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowFeedbackModal(false)}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '700' }}>
              Send Feedback
            </h3>
            <textarea 
              placeholder="Share your experience with us..."
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '15px',
                fontFamily: 'inherit',
                marginBottom: '20px',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{
                flex: 1,
                padding: '14px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '15px'
              }}>
                Submit Feedback
              </button>
              <button onClick={() => setShowFeedbackModal(false)} style={{
                flex: 1,
                padding: '14px',
                background: 'white',
                color: '#4facfe',
                border: '2px solid #4facfe',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '15px'
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}