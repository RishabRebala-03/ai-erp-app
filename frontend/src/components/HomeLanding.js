export default function HomeLanding({ onSelectRole }) {
  return (
    <div className="home-landing" style={{ padding: "40px", minHeight: "100vh" }}>
      
      {/* Hero Section */}
      <div 
        className="panel" 
        style={{ 
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9))",
          padding: "60px 40px",
          marginBottom: "40px"
        }}
      >
        <div style={{ 
          fontSize: "56px",
          marginBottom: "16px",
          animation: "float 3s ease-in-out infinite"
        }}>
          ⚡
        </div>
        <h1 style={{ 
          margin: "0 0 16px 0",
          fontSize: "42px",
          fontWeight: "800",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-1px"
        }}>
          ERP-AI Dashboard
        </h1>
        <p className="muted" style={{ 
          marginTop: 12, 
          fontSize: "18px",
          maxWidth: "600px",
          margin: "0 auto",
          lineHeight: "1.7"
        }}>
          Transform your workflow with AI-powered quotations, intelligent inventory management, 
          and seamless collaboration tools. Choose your role to get started.
        </p>
        
        <div style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          marginTop: "32px",
          flexWrap: "wrap"
        }}>
          <div style={{
            padding: "12px 24px",
            background: "rgba(102, 126, 234, 0.1)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span style={{ fontSize: "20px" }}>⚡</span>
            <span style={{ fontWeight: "600", color: "#667eea" }}>AI-Powered</span>
          </div>
          <div style={{
            padding: "12px 24px",
            background: "rgba(118, 75, 162, 0.1)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span style={{ fontSize: "20px" }}>🔒</span>
            <span style={{ fontWeight: "600", color: "#764ba2" }}>Secure</span>
          </div>
          <div style={{
            padding: "12px 24px",
            background: "rgba(102, 126, 234, 0.1)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span style={{ fontSize: "20px" }}>🚀</span>
            <span style={{ fontWeight: "600", color: "#667eea" }}>Fast</span>
          </div>
        </div>
      </div>

      {/* Role Selection Title */}
      <h2 style={{
        textAlign: "center",
        marginBottom: "32px",
        fontSize: "28px",
        fontWeight: "700",
        color: "white",
        textShadow: "0 2px 10px rgba(0,0,0,0.2)"
      }}>
        Select Your Role
      </h2>

      {/* Role Cards */}
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "32px",
          marginBottom: "40px"
        }}
      >
        {/* Admin Card */}
        <div 
          className="card role-card" 
          onClick={() => onSelectRole("admin")}
          style={{
            cursor: "pointer",
            position: "relative"
          }}
        >
          <div style={{
            width: "64px",
            height: "64px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            marginBottom: "20px",
            boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)"
          }}>
            👨‍💼
          </div>
          
          <h3 style={{ 
            marginTop: 0,
            marginBottom: "12px",
            fontSize: "24px"
          }}>
            Admin
          </h3>
          
          <p className="muted" style={{ marginBottom: "24px", fontSize: "15px" }}>
            Complete control over inventory, users, and system settings
          </p>
          
          <div style={{ 
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            fontSize: "14px"
          }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              padding: "10px",
              background: "rgba(102, 126, 234, 0.05)",
              borderRadius: "8px"
            }}>
              <span style={{ fontSize: "20px" }}>📦</span>
              <span>Manage Inventory</span>
            </div>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              padding: "10px",
              background: "rgba(102, 126, 234, 0.05)",
              borderRadius: "8px"
            }}>
              <span style={{ fontSize: "20px" }}>📊</span>
              <span>Update Stock Levels</span>
            </div>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              padding: "10px",
              background: "rgba(102, 126, 234, 0.05)",
              borderRadius: "8px"
            }}>
              <span style={{ fontSize: "20px" }}>⚙️</span>
              <span>System Configuration</span>
            </div>
          </div>
          
          <div style={{
            marginTop: "24px",
            padding: "12px",
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
            borderRadius: "10px",
            textAlign: "center",
            fontWeight: "600",
            color: "#667eea"
          }}>
            Click to Access Admin Portal →
          </div>
        </div>

        {/* Sales Executive Card */}
        <div 
          className="card role-card" 
          onClick={() => onSelectRole("sales")}
          style={{
            cursor: "pointer",
            position: "relative"
          }}
        >
          <div style={{
            width: "64px",
            height: "64px",
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            marginBottom: "20px",
            boxShadow: "0 8px 24px rgba(240, 147, 251, 0.3)"
          }}>
            💼
          </div>
          
          <h3 style={{ 
            marginTop: 0,
            marginBottom: "12px",
            fontSize: "24px"
          }}>
            Sales Executive
          </h3>
          
          <p className="muted" style={{ marginBottom: "24px", fontSize: "15px" }}>
            AI-powered quotation creation and document processing
          </p>
          
          <div style={{ 
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            fontSize: "14px"
          }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              padding: "10px",
              background: "rgba(240, 147, 251, 0.05)",
              borderRadius: "8px"
            }}>
              <span style={{ fontSize: "20px" }}>🤖</span>
              <span>AI Quotation Generator</span>
            </div>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              padding: "10px",
              background: "rgba(240, 147, 251, 0.05)",
              borderRadius: "8px"
            }}>
              <span style={{ fontSize: "20px" }}>📄</span>
              <span>Smart Document Upload</span>
            </div>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              padding: "10px",
              background: "rgba(240, 147, 251, 0.05)",
              borderRadius: "8px"
            }}>
              <span style={{ fontSize: "20px" }}>📈</span>
              <span>View Sales History</span>
            </div>
          </div>
          
          <div style={{
            marginTop: "24px",
            padding: "12px",
            background: "linear-gradient(135deg, rgba(240, 147, 251, 0.1), rgba(245, 87, 108, 0.1))",
            borderRadius: "10px",
            textAlign: "center",
            fontWeight: "600",
            color: "#f5576c"
          }}>
            Click to Start Creating →
          </div>
        </div>

        {/* Customer Card */}
        <div 
          className="card role-card" 
          onClick={() => onSelectRole("customer")}
          style={{
            cursor: "pointer",
            position: "relative"
          }}
        >
          <div style={{
            width: "64px",
            height: "64px",
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            marginBottom: "20px",
            boxShadow: "0 8px 24px rgba(79, 172, 254, 0.3)"
          }}>
            👤
          </div>
          
          <h3 style={{ 
            marginTop: 0,
            marginBottom: "12px",
            fontSize: "24px"
          }}>
            Customer
          </h3>
          
          <p className="muted" style={{ marginBottom: "24px", fontSize: "15px" }}>
            Review quotations and approve your interior design projects
          </p>
          
          <div style={{ 
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            fontSize: "14px"
          }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              padding: "10px",
              background: "rgba(79, 172, 254, 0.05)",
              borderRadius: "8px"
            }}>
              <span style={{ fontSize: "20px" }}>👁️</span>
              <span>View Quotations</span>
            </div>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              padding: "10px",
              background: "rgba(79, 172, 254, 0.05)",
              borderRadius: "8px"
            }}>
              <span style={{ fontSize: "20px" }}>✅</span>
              <span>Approve Projects</span>
            </div>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              padding: "10px",
              background: "rgba(79, 172, 254, 0.05)",
              borderRadius: "8px"
            }}>
              <span style={{ fontSize: "20px" }}>💬</span>
              <span>Request Changes</span>
            </div>
          </div>
          
          <div style={{
            marginTop: "24px",
            padding: "12px",
            background: "linear-gradient(135deg, rgba(79, 172, 254, 0.1), rgba(0, 242, 254, 0.1))",
            borderRadius: "10px",
            textAlign: "center",
            fontWeight: "600",
            color: "#4facfe"
          }}>
            Click to View Portal →
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        background: "rgba(255,255,255,0.95)",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
        marginBottom: "40px"
      }}>
        <h2 style={{
          textAlign: "center",
          marginBottom: "32px",
          fontSize: "28px",
          fontWeight: "700",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Why Choose ERP-AI?
        </h2>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px"
        }}>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚡</div>
            <h4 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "700" }}>Lightning Fast</h4>
            <p className="muted" style={{ fontSize: "14px" }}>Process quotations in seconds with AI automation</p>
          </div>
          
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎯</div>
            <h4 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "700" }}>Accurate</h4>
            <p className="muted" style={{ fontSize: "14px" }}>99.9% accuracy in document processing and pricing</p>
          </div>
          
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
            <h4 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "700" }}>Secure</h4>
            <p className="muted" style={{ fontSize: "14px" }}>Enterprise-grade security for all your data</p>
          </div>
          
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
            <h4 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "700" }}>Analytics</h4>
            <p className="muted" style={{ fontSize: "14px" }}>Real-time insights and reporting dashboard</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: "center", 
        color: "white",
        fontSize: "14px",
        padding: "20px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "12px",
        backdropFilter: "blur(10px)"
      }}>
        <p style={{ margin: 0, fontWeight: "600" }}>ERP-AI System • Version 1.0</p>
        <p style={{ margin: "8px 0 0 0", opacity: 0.8 }}>© 2024 All Rights Reserved</p>
      </div>
    </div>
  );
}