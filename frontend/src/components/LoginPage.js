import React, { useState, useContext } from 'react'; // <-- ADD useContext HERE
import { AuthContext } from '../AuthContext'; // <-- ADD THIS IMPORT

export default function LoginPage({ onLogin }) {
  const { setSessionId, setUserId, setUserRole, setUserEmail, setUserName } = useContext(AuthContext);
  const [selectedRole, setSelectedRole] = useState(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const roles = {
    admin: {
      title: 'Admin',
      icon: '👨‍💼',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      lightGradient: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
      color: '#667eea',
      description: 'Manage inventory & system',
      demo: { email: 'admin@naxrita.com', password: 'admin123' } // <-- CHANGED TO YOUR DOMAIN
    },
    sales: {
      title: 'Sales Executive',
      icon: '💼',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      lightGradient: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1), rgba(245, 87, 108, 0.1))',
      color: '#f5576c',
      description: 'Create AI quotations',
      demo: { email: 'sales@naxrita.com', password: 'sales123' } // <-- CHANGED TO YOUR DOMAIN
    },
    customer: {
      title: 'Customer',
      icon: '👤',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      lightGradient: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1), rgba(0, 242, 254, 0.1))',
      color: '#4facfe',
      description: 'Review & approve quotes',
      demo: { email: 'customer@naxrita.com', password: 'customer123' } // <-- CHANGED TO YOUR DOMAIN
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const data = await response.json();

      if (data.error || !response.ok) {
        alert("Login failed: " + (data.error || "Invalid credentials"));
        setIsLoading(false);
        return;
      }

      // Store in AuthContext
      setSessionId(data.sessionId);
      setUserId(data.userId);      // <-- ADD THIS
      setUserRole(data.role);
      setUserEmail(data.email);
      setUserName(data.name);

      // Store in localStorage as backup
      localStorage.setItem("sessionId", data.sessionId);
      localStorage.setItem("userId", data.userId); // <-- ADD THIS
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email); // <-- ADD THIS
      localStorage.setItem("name", data.name);   // <-- ADD THIS

      setIsLoading(false);
      onLogin(data.role); // <-- CHANGED from selectedRole to data.role
    } catch (err) {
      alert("Network error: " + err.message);
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    const demo = roles[selectedRole].demo;
    setCredentials(demo);
  };

  // Role Selection View
  if (!selectedRole) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '-200px',
          left: '-200px',
          animation: 'float 20s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          bottom: '-150px',
          right: '-150px',
          animation: 'float 15s ease-in-out infinite reverse'
        }} />

        <div style={{
          maxWidth: '1200px',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '48px',
            animation: 'fadeInDown 0.8s ease-out'
          }}>
            <div style={{
              fontSize: '72px',
              marginBottom: '20px',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              ⚡
            </div>
            <h1 style={{
              margin: '0 0 16px 0',
              fontSize: '48px',
              fontWeight: '800',
              color: 'white',
              textShadow: '0 4px 20px rgba(0,0,0,0.2)',
              letterSpacing: '-1px'
            }}>
              Welcome to ERP-AI
            </h1>
            <p style={{
              margin: 0,
              fontSize: '20px',
              color: 'rgba(255,255,255,0.9)',
              fontWeight: '500'
            }}>
              Select your role to continue
            </p>
          </div>

          {/* Role Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            marginBottom: '40px'
          }}>
            {Object.keys(roles).map((roleKey, idx) => {
              const role = roles[roleKey];
              return (
                <div
                  key={roleKey}
                  onClick={() => setSelectedRole(roleKey)}
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    padding: '40px 32px',
                    borderRadius: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: `fadeInUp 0.8s ease-out ${idx * 0.2}s backwards`,
                    border: '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 30px 80px rgba(0,0,0,0.3)';
                    e.currentTarget.style.borderColor = role.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.2)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  {/* Top Gradient Bar */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: role.gradient
                  }} />

                  {/* Icon */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: role.gradient,
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    marginBottom: '24px',
                    boxShadow: `0 12px 32px ${role.color}40`,
                    animation: 'bounce 2s ease-in-out infinite'
                  }}>
                    {role.icon}
                  </div>

                  {/* Content */}
                  <h3 style={{
                    margin: '0 0 12px 0',
                    fontSize: '28px',
                    fontWeight: '800',
                    background: role.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {role.title}
                  </h3>
                  
                  <p style={{
                    margin: '0 0 24px 0',
                    color: '#6b7280',
                    fontSize: '16px',
                    lineHeight: '1.6'
                  }}>
                    {role.description}
                  </p>

                  {/* Demo Credentials */}
                  <div style={{
                    background: role.lightGradient,
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '20px'
                  }}>
                    <p style={{
                      margin: '0 0 8px 0',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: role.color,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Demo Credentials
                    </p>
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#4b5563' }}>
                      📧 {role.demo.email}
                    </p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>
                      🔒 {role.demo.password}
                    </p>
                  </div>

                  {/* Button */}
                  <button style={{
                    width: '100%',
                    padding: '16px',
                    background: role.gradient,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    boxShadow: `0 8px 24px ${role.color}40`
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    Login as {role.title} →
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '14px'
          }}>
            <p style={{ margin: 0 }}>🔒 Secure Login • © 2024 ERP-AI System</p>
          </div>
        </div>

        <style>{`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, -30px) rotate(5deg); }
            66% { transform: translate(-20px, 20px) rotate(-5deg); }
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    );
  }

  // Login Form View
  const currentRole = roles[selectedRole];
  
  return (
    <div style={{
      minHeight: '100vh',
      background: currentRole.gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        top: '-300px',
        right: '-300px',
        animation: 'float 20s ease-in-out infinite'
      }} />

      {/* Login Card */}
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: 'rgba(255,255,255,0.98)',
        borderRadius: '32px',
        padding: '48px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.8s ease-out'
      }}>
        {/* Back Button */}
        <button
          onClick={() => setSelectedRole(null)}
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            background: currentRole.lightGradient,
            border: 'none',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          ←
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            background: currentRole.gradient,
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            margin: '0 auto 24px',
            boxShadow: `0 12px 32px ${currentRole.color}40`,
            animation: 'bounce 2s ease-in-out infinite'
          }}>
            {currentRole.icon}
          </div>
          
          <h2 style={{
            margin: '0 0 12px 0',
            fontSize: '32px',
            fontWeight: '800',
            background: currentRole.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {currentRole.title} Login
          </h2>
          
          <p style={{
            margin: 0,
            color: '#6b7280',
            fontSize: '15px'
          }}>
            Enter your credentials to continue
          </p>
        </div>

        {/* Demo Credentials Banner */}
        <div style={{
          background: currentRole.lightGradient,
          padding: '16px 20px',
          borderRadius: '14px',
          marginBottom: '28px',
          border: `2px solid ${currentRole.color}20`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{
              margin: '0 0 4px 0',
              fontSize: '12px',
              fontWeight: '700',
              color: currentRole.color,
              textTransform: 'uppercase'
            }}>
              Demo Account
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>
              Click to auto-fill →
            </p>
          </div>
          <button
            onClick={fillDemoCredentials}
            style={{
              padding: '10px 20px',
              background: currentRole.gradient,
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              boxShadow: `0 4px 16px ${currentRole.color}40`
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Use Demo
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '20px'
              }}>
                📧
              </span>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                placeholder="your@email.com"
                required
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 52px',
                  border: `2px solid ${currentRole.color}20`,
                  borderRadius: '14px',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  background: 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = currentRole.color;
                  e.target.style.boxShadow = `0 0 0 4px ${currentRole.color}10`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = `${currentRole.color}20`;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '20px'
              }}>
                🔒
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '16px 52px 16px 52px',
                  border: `2px solid ${currentRole.color}20`,
                  borderRadius: '14px',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  background: 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = currentRole.color;
                  e.target.style.boxShadow = `0 0 0 4px ${currentRole.color}10`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = `${currentRole.color}20`;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '4px'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px',
            fontSize: '14px'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              color: '#6b7280'
            }}>
              <input type="checkbox" style={{ cursor: 'pointer' }} />
              Remember me
            </label>
            <a href="#" style={{
              color: currentRole.color,
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '18px',
              background: isLoading ? '#9ca3af' : currentRole.gradient,
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isLoading ? 'none' : `0 8px 24px ${currentRole.color}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 12px 32px ${currentRole.color}50`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 8px 24px ${currentRole.color}40`;
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Logging in...
              </>
            ) : (
              <>
                Login to Dashboard
                <span>→</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p style={{
          marginTop: '28px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#6b7280'
        }}>
          Don't have an account? <a href="#" style={{ color: currentRole.color, fontWeight: '600', textDecoration: 'none' }}>Sign up</a>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}