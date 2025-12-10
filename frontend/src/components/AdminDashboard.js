// /frontend/src/components/AdminDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';

export default function AdminDashboard({ onLogout }) {

  const { sessionId } = useContext(AuthContext);
  const [inventory, setInventory] = useState([]);  // Initialize as empty array
  const [form, setForm] = useState({
    itemNo: "",
    product: "",
    productId: "",
    shortText: "",
    description: "",
    productGroup: "",
    stockQuantity: "",
    price: "",
    supplier: "",
    store: ""
  });

  const [showAddModal, setShowAddModal] = useState(false);

  async function loadInventory() {
    try {
      const res = await fetch("http://localhost:5000/admin/products", {
        headers: { "x-session-id": sessionId }
      });
      const data = await res.json();
      
      // Ensure data is an array before setting
      if (Array.isArray(data)) {
        setInventory(data);
      } else {
        console.error("Expected array, got:", data);
        setInventory([]);
      }
    } catch (error) {
      console.error("Error loading inventory:", error);
      setInventory([]);
    }
  }

  useEffect(() => {
    if (sessionId) {
      loadInventory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Mock data
  const stats = [
    { 
      label: 'Total Products', 
      value: '1,248', 
      change: '+12%', 
      icon: '📦',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      label: 'Low Stock Items', 
      value: '23', 
      change: '-5%', 
      icon: '⚠️',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      label: 'Total Value', 
      value: '₹45.2L', 
      change: '+18%', 
      icon: '💰',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    { 
      label: 'Active Users', 
      value: '87', 
      change: '+8%', 
      icon: '👥',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];

  const lowStockAlerts = [
    { item: 'Conference Table Oak', current: 8, threshold: 10, urgency: 'medium' },
    { item: 'Ergonomic Keyboard', current: 3, threshold: 15, urgency: 'high' },
    { item: 'Whiteboard Large', current: 5, threshold: 8, urgency: 'low' }
  ];

  async function deleteProduct(id) {
    await fetch("http://localhost:5000/admin/delete-product/" + id, {
      method: "DELETE",
      headers: { "x-session-id": sessionId }
    });
    loadInventory();
  }


  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            <span style={{ fontSize: '40px' }}>👨‍💼</span>
            <h1 style={{ 
              margin: 0,
              fontSize: '32px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Admin Dashboard
            </h1>
          </div>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '15px' }}>
            Manage your entire inventory and system settings
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '15px'
            }}
          >
            <span>➕</span> Add Product
          </button>
          <button 
            onClick={onLogout}
            style={{
              padding: '14px 24px',
              background: 'white',
              color: '#667eea',
              border: '2px solid #667eea',
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
                  margin: '0 0 8px 0',
                  fontSize: '36px',
                  fontWeight: '800',
                  background: stat.color,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {stat.value}
                </h2>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: stat.change.startsWith('+') ? '#10b981' : '#ef4444',
                  background: stat.change.startsWith('+') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  padding: '4px 12px',
                  borderRadius: '8px'
                }}>
                  {stat.change}
                </span>
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

      {/* Main Content Grid */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '32px',
        marginBottom: '32px'
      }}>
        {/* Products Table */}
        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h3 style={{ 
              margin: 0,
              fontSize: '22px',
              fontWeight: '700'
            }}>
              Recent Products
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                padding: '8px 16px',
                background: 'rgba(102, 126, 234, 0.1)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#667eea'
              }}>
                Filter
              </button>
              <button style={{
                padding: '8px 16px',
                background: 'rgba(102, 126, 234, 0.1)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#667eea'
              }}>
                Export
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0 12px'
            }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>Product</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>Category</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>Stock</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>Price</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory && inventory.length > 0 ? (
                  inventory.map(p => (
                    <tr key={p._id} style={{ background: 'white' }}>
                      <td style={{ padding: '16px', fontWeight: '600' }}>{p.product || 'N/A'}</td>
                      <td style={{ padding: '16px', color: '#6b7280' }}>{p.productGroup || 'N/A'}</td>
                      <td style={{ padding: '16px', fontWeight: '600' }}>{p.stockQuantity || 0}</td>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#667eea' }}>₹{p.price || 0}</td>
                      <td style={{ padding: '16px' }}>
                        <button 
                          style={{ 
                            padding: "8px 16px", 
                            background: "#ef4444", 
                            color: "white", 
                            border: "none",
                            borderRadius: "8px", 
                            cursor: "pointer",
                            fontWeight: "600"
                          }}
                          onClick={() => deleteProduct(p._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                      {sessionId ? 'No products found. Add your first product!' : 'Loading products...'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
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
            <span>⚠️</span> Low Stock Alerts
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {lowStockAlerts.map((alert, idx) => (
              <div key={idx} style={{
                padding: '20px',
                background: alert.urgency === 'high' ? 'rgba(239, 68, 68, 0.05)' : alert.urgency === 'medium' ? 'rgba(251, 191, 36, 0.05)' : 'rgba(59, 130, 246, 0.05)',
                borderRadius: '12px',
                borderLeft: `4px solid ${alert.urgency === 'high' ? '#ef4444' : alert.urgency === 'medium' ? '#f59e0b' : '#3b82f6'}`
              }}>
                <p style={{ 
                  margin: '0 0 8px 0',
                  fontWeight: '600',
                  fontSize: '15px'
                }}>
                  {alert.item}
                </p>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '13px',
                  color: '#6b7280'
                }}>
                  <span>Current: <strong>{alert.current}</strong></span>
                  <span>Min: <strong>{alert.threshold}</strong></span>
                </div>
                <div style={{
                  marginTop: '12px',
                  height: '6px',
                  background: '#e5e7eb',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(alert.current / alert.threshold) * 100}%`,
                    height: '100%',
                    background: alert.urgency === 'high' ? '#ef4444' : alert.urgency === 'medium' ? '#f59e0b' : '#3b82f6',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>

          <button style={{
            marginTop: '20px',
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            View All Alerts
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        {[
          { icon: '📦', label: 'Manage Inventory', color: '#667eea' },
          { icon: '📊', label: 'View Reports', color: '#f5576c' },
          { icon: '👥', label: 'User Management', color: '#00f2fe' },
          { icon: '⚙️', label: 'System Settings', color: '#38f9d7' }
        ].map((action, idx) => (
          <div key={idx} style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>{action.icon}</div>
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

      {/* Add Product Modal */}
      {showAddModal && (
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
        }} onClick={() => setShowAddModal(false)}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '700' }}>Add New Product</h3>
            <input 
              type="text" placeholder="Item No"
              value={form.itemNo}
              onChange={(e) => setForm({ ...form, itemNo: e.target.value })}
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
              type="text" placeholder="Product Name"
              value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
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
              type="text" placeholder="Product ID"
              value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
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
              type="text" placeholder="Short Text"
              value={form.shortText}
              onChange={(e) => setForm({ ...form, shortText: e.target.value })}
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
              type="text" placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
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
              type="text" placeholder="Category / Product Group"
              value={form.productGroup}
              onChange={(e) => setForm({ ...form, productGroup: e.target.value })}
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
              type="number" placeholder="Stock Quantity"
              value={form.stockQuantity}
              onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
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
              type="number" placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
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
              type="text" placeholder="Supplier"
              value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
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
              type="text" placeholder="Store"
              value={form.store}
              onChange={(e) => setForm({ ...form, store: e.target.value })}
              style={{
                width: '100%',
                padding: '14px',
                marginBottom: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '15px'
              }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={async () => {
                  await fetch("http://localhost:5000/admin/add-product", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "x-session-id": sessionId
                    },
                    body: JSON.stringify(form)
                  });
                  setShowAddModal(false);
                  loadInventory();
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '15px'
                }}
              >
                Add Product
              </button>
              <button onClick={() => setShowAddModal(false)} style={{
                flex: 1,
                padding: '14px',
                background: 'white',
                color: '#667eea',
                border: '2px solid #667eea',
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