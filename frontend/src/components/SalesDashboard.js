// /frontend/src/components/SalesDashboard.js

import React, { useState, useContext, useRef, useEffect } from 'react'; // <-- Add useEffect here
import { AuthContext } from '../AuthContext';

export default function SalesDashboard({ onLogout }) {
  const { sessionId, userId } = useContext(AuthContext);
  const fileRef = useRef(null);
  
  const [view, setView] = useState('dashboard'); // dashboard, upload, quotation, assign
  const [selectedFile, setSelectedFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [mode, setMode] = useState('file');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [generatedQuotation, setGeneratedQuotation] = useState(null);
  const [pastQuotations, setPastQuotations] = useState([]);
  
  // Customer assignment
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  useEffect(() => {
    async function loadQuotations() {
      if (!sessionId || !userId) return;
      
      try {
        const res = await fetch(`http://localhost:5000/quotation/sales/${userId}`, {
          headers: { "x-session-id": sessionId }
        });
        
        if (res.ok) {
          const data = await res.json();
          setPastQuotations(data);
        }
      } catch (error) {
        console.error("Error loading quotations:", error);
      }
    }
    
    loadQuotations();
  }, [sessionId, userId]);

  // Stats
  const stats = [
    { 
      label: 'Quotations Created', 
      value: pastQuotations.length.toString(),
      icon: '📋',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      label: 'Active Customers', 
      value: '12', 
      icon: '👥',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    { 
      label: 'Total Revenue', 
      value: '₹8.5L', 
      icon: '💰',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    { 
      label: 'Pending Approvals', 
      value: '5', 
      icon: '⏳',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ];

  // Handle file upload
  async function handleFileUpload({ file, text }) {
    setProcessing(true);
    setProgress(0);
    setMessage('Analyzing document...');

    try {
      const xhr = new XMLHttpRequest();
      const url = 'http://localhost:5000/analyze-image';
      xhr.open('POST', url, true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          setProgress(pct);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const resp = JSON.parse(xhr.responseText);
          setGeneratedQuotation(resp);
          setMessage('Quotation generated successfully!');
          setView('quotation');
        } else {
          setMessage('Server error: ' + xhr.status);
        }
        setProcessing(false);
        setProgress(100);
      };

      xhr.onerror = () => {
        setMessage('Network error. Please check backend connection.');
        setProcessing(false);
      };

      const form = new FormData();
      if (file) form.append('file', file);
      if (text) form.append('text', text);
      xhr.send(form);
    } catch (err) {
      setMessage('Error: ' + err.message);
      setProcessing(false);
    }
  }

  function onPickFile() {
    fileRef.current && fileRef.current.click();
  }

  function onFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setSelectedFile(f);
    handleFileUpload({ file: f, text: null });
  }

  function onDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) {
      setSelectedFile(f);
      handleFileUpload({ file: f, text: null });
    }
  }

  function onSendText() {
    if (!textInput.trim()) {
      alert('Please enter text first.');
      return;
    }
    handleFileUpload({ file: null, text: textInput });
  }

  // Save quotation and assign to customer
  async function handleAssignQuotation() {
    if (!customerForm.name || !customerForm.email) {
      alert('Please fill customer name and email');
      return;
    }

    try {
      // Step 1: Create customer
      const customerRes = await fetch('http://localhost:5000/customer/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({
          ...customerForm,
          salesExecutiveId: userId
        })
      });

      const customerData = await customerRes.json();
      const customerId = customerData.id;

      // Step 2: Save quotation
      const quotationRes = await fetch('http://localhost:5000/quotation/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({
          ...generatedQuotation,
          customerId: customerId
        })
      });

      const quotationData = await quotationRes.json();

      if (quotationData.msg) {
        alert('Quotation assigned successfully!');
        setShowCustomerModal(false);
        setView('dashboard');
        // Reset form
        setCustomerForm({ name: '', email: '', phone: '', address: '' });
        setGeneratedQuotation(null);
        setSelectedFile(null);
        setTextInput('');
      }
    } catch (err) {
      alert('Error assigning quotation: ' + err.message);
    }
  }

  // Dashboard View
  if (view === 'dashboard') {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
              <span style={{ fontSize: '40px' }}>💼</span>
              <h1 style={{ 
                margin: 0,
                fontSize: '32px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Sales Executive Dashboard
              </h1>
            </div>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '15px' }}>
              Create AI-powered quotations for your customers
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              onClick={() => setView('upload')}
              style={{
                padding: '14px 24px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(240, 147, 251, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px'
              }}
            >
              <span>➕</span> Create New Quotation
            </button>
            <button 
              onClick={onLogout}
              style={{
                padding: '14px 24px',
                background: 'white',
                color: '#f5576c',
                border: '2px solid #f5576c',
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
          {stats.map((stat, idx) => (
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

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {[
            { icon: '📋', label: 'View All Quotations', color: '#f093fb' },
            { icon: '👥', label: 'My Customers', color: '#f5576c' },
            { icon: '📊', label: 'Sales Report', color: '#4facfe' },
            { icon: '⚙️', label: 'Settings', color: '#38f9d7' }
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
      </div>
    );
  }

  // Upload View
  if (view === 'upload') {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        padding: '40px'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            padding: '32px 40px',
            borderRadius: '20px',
            marginBottom: '32px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
          }}>
            <button 
              onClick={() => setView('dashboard')}
              style={{
                background: 'rgba(240, 147, 251, 0.1)',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#f5576c',
                marginBottom: '16px'
              }}
            >
              ← Back to Dashboard
            </button>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '800' }}>
              Upload Document
            </h2>
            <p style={{ margin: 0, color: '#6b7280' }}>
              Upload an interior design image, PDF, or paste text to generate a quotation
            </p>
          </div>

          {/* Upload Card */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)'
          }}>
            {/* Mode Switch */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <button 
                onClick={() => setMode('file')}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: mode === 'file' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'white',
                  color: mode === 'file' ? 'white' : '#6b7280',
                  border: mode === 'file' ? 'none' : '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '15px'
                }}
              >
                📁 Upload File
              </button>
              <button 
                onClick={() => setMode('text')}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: mode === 'text' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'white',
                  color: mode === 'text' ? 'white' : '#6b7280',
                  border: mode === 'text' ? 'none' : '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '15px'
                }}
              >
                📝 Paste Text
              </button>
            </div>

            {/* File Upload */}
            {mode === 'file' && (
              <div 
                style={{
                  border: '3px dashed #f093fb',
                  borderRadius: '16px',
                  padding: '60px 40px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'rgba(240, 147, 251, 0.03)',
                  transition: 'all 0.3s ease'
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={onPickFile}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(240, 147, 251, 0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(240, 147, 251, 0.03)'}
              >
                <input 
                  ref={fileRef} 
                  type="file" 
                  accept="image/*,application/pdf,text/plain" 
                  style={{display:'none'}} 
                  onChange={onFileChange} 
                />
                <div style={{ fontSize: '72px', marginBottom: '16px' }}>📤</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '700' }}>
                  Click or drop file here
                </h3>
                <p style={{ margin: '0 0 16px 0', color: '#6b7280' }}>
                  Supports: JPG, PNG, PDF, TXT
                </p>
                {selectedFile && (
                  <div style={{
                    padding: '12px 24px',
                    background: 'rgba(240, 147, 251, 0.1)',
                    borderRadius: '10px',
                    display: 'inline-block',
                    fontWeight: '600',
                    color: '#f5576c'
                  }}>
                    ✓ {selectedFile.name}
                  </div>
                )}
              </div>
            )}

            {/* Text Input */}
            {mode === 'text' && (
              <div>
                <textarea 
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste or type document content here...&#10;&#10;Example:&#10;6 office chairs&#10;2 work desks&#10;1 conference table"
                  style={{
                    width: '100%',
                    minHeight: '200px',
                    padding: '20px',
                    border: '2px solid #f093fb',
                    borderRadius: '16px',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    marginBottom: '20px'
                  }}
                />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={onSendText}
                    disabled={processing}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: processing ? '#9ca3af' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: processing ? 'not-allowed' : 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    {processing ? 'Processing...' : 'Generate Quotation'}
                  </button>
                  <button 
                    onClick={() => setTextInput('')}
                    style={{
                      padding: '16px 24px',
                      background: 'white',
                      color: '#f5576c',
                      border: '2px solid #f5576c',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {processing && (
              <div style={{ marginTop: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6b7280'
                }}>
                  <span>Processing...</span>
                  <span>{progress}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '12px',
                  background: '#e5e7eb',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <p style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
                  {message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quotation View
  if (view === 'quotation' && generatedQuotation) {
    const items = generatedQuotation.items || [];
    const pricing = generatedQuotation.pricing || {};

    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        padding: '40px'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            padding: '32px 40px',
            borderRadius: '20px',
            marginBottom: '32px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
          }}>
            <button 
              onClick={() => setView('upload')}
              style={{
                background: 'rgba(240, 147, 251, 0.1)',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#f5576c',
                marginBottom: '16px'
              }}
            >
              ← Back
            </button>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '800' }}>
              Generated Quotation
            </h2>
            <p style={{ margin: 0, color: '#6b7280' }}>
              Quotation ID: {generatedQuotation.quotationId}
            </p>
          </div>

          {/* Quotation Details */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            marginBottom: '24px'
          }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '22px', fontWeight: '700' }}>
              Items
            </h3>

            {items.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'separate',
                  borderSpacing: '0',
                  marginBottom: '32px'
                }}>
                  <thead>
                    <tr style={{ background: 'rgba(240, 147, 251, 0.1)' }}>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', borderRadius: '12px 0 0 0' }}>Item No.</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>Product</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>Product ID</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>Group</th>
                      <th style={{ padding: '16px', textAlign: 'center', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>Qty</th>
                      <th style={{ padding: '16px', textAlign: 'right', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>Price</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>Supplier</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>Store</th>
                      <th style={{ padding: '16px', textAlign: 'right', fontWeight: '700', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', borderRadius: '0 12px 0 0' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} style={{
                        background: idx % 2 === 0 ? 'white' : 'rgba(240, 147, 251, 0.02)',
                        borderBottom: '1px solid #f3f4f6'
                      }}>
                        <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600' }}>{item.itemNo}</td>
                        <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{item.product}</td>
                        <td style={{ padding: '16px', fontSize: '13px', color: '#6b7280' }}>{item.productId}</td>
                        <td style={{ padding: '16px', fontSize: '13px', color: '#6b7280' }}>{item.productGroup}</td>
                        <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', textAlign: 'center' }}>{item.quantity}</td>
                        <td style={{ padding: '16px', fontSize: '14px', textAlign: 'right' }}>₹{item.unit_price.toLocaleString()}</td>
                        <td style={{ padding: '16px', fontSize: '13px', color: '#6b7280' }}>{item.supplier}</td>
                        <td style={{ padding: '16px', fontSize: '13px', color: '#6b7280' }}>{item.store}</td>
                        <td style={{
                          padding: '16px',
                          fontSize: '16px',
                          fontWeight: '700',
                          textAlign: 'right',
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          ₹{item.line_total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Match Confidence Info */}
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(16, 185, 129, 0.05)',
                  borderRadius: '10px',
                  borderLeft: '4px solid #10b981',
                  marginBottom: '24px'
                }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#059669', fontWeight: '600' }}>
                    ✓ AI Match Confidence: {items.length > 0 ? Math.round(items.reduce((sum, item) => sum + item.match_confidence, 0) / items.length * 100) : 0}% Average
                  </p>
                </div>
              </div>
            ) : (
              <p style={{ color: '#6b7280', padding: '20px', textAlign: 'center' }}>
                No items detected
              </p>
            )}

            {/* Pricing Summary */}
            <div style={{
              borderTop: '2px solid #e5e7eb',
              paddingTop: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#6b7280' }}>Subtotal</span>
                <span style={{ fontWeight: '600' }}>₹{pricing.subtotal?.toLocaleString() || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#6b7280' }}>Tax ({(pricing.taxRate * 100) || 0}%)</span>
                <span style={{ fontWeight: '600' }}>₹{pricing.taxAmount?.toLocaleString() || 0}</span>
              </div>
              {pricing.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#6b7280' }}>Discount</span>
                  <span style={{ fontWeight: '600', color: '#10b981' }}>-₹{pricing.discountAmount?.toLocaleString() || 0}</span>
                </div>
              )}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '2px solid #e5e7eb',
                marginTop: '16px'
              }}>
                <span style={{ fontSize: '20px', fontWeight: '800' }}>Grand Total</span>
                <span style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  ₹{pricing.grandTotal?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => setShowCustomerModal(true)}
              style={{
                flex: 1,
                padding: '18px',
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '16px',
                boxShadow: '0 8px 24px rgba(67, 233, 123, 0.3)'
              }}
            >
              ✓ Assign to Customer
            </button>
            <button 
              onClick={() => setView('upload')}
              style={{
                padding: '18px 32px',
                background: 'white',
                color: '#f5576c',
                border: '2px solid #f5576c',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Create New
            </button>
          </div>
        </div>

        {/* Customer Assignment Modal */}
        {showCustomerModal && (
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
          }} onClick={() => setShowCustomerModal(false)}>
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '700' }}>
                Assign to Customer
              </h3>
              
              <input 
                type="text" 
                placeholder="Customer Name *"
                value={customerForm.name}
                onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px',
                  marginBottom: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '15px'
                }}
              />

              <input 
                type="email" 
                placeholder="Customer Email *"
                value={customerForm.email}
                onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px',
                  marginBottom: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '15px'
                }}
              />

              <input 
                type="tel" 
                placeholder="Phone Number"
                value={customerForm.phone}
                onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px',
                  marginBottom: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '15px'
                }}
              />

              <textarea 
                placeholder="Address"
                value={customerForm.address}
                onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px',
                  marginBottom: '20px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '15px',
                  minHeight: '100px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleAssignQuotation}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '15px'
                  }}
                >
                  Assign Quotation
                </button>
                <button 
                  onClick={() => setShowCustomerModal(false)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'white',
                    color: '#43e97b',
                    border: '2px solid #43e97b',
                    borderRadius: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '15px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}