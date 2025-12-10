import React, { useState } from 'react';
import { AuthProvider } from './AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import UploadCard from './components/UploadCard';
import QuotationCard from './components/QuotationCard';
import HomeLanding from './components/HomeLanding';
import AdminDashboard from './components/AdminDashboard';
import SalesDashboard from './components/SalesDashboard';
import CustomerView from './components/CustomerView';
import LoginPage from './components/LoginPage';

export default function App() {
  const [selectedPage, setSelectedPage] = useState('upload');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedName, setUploadedName] = useState('');
  const [extractedItems, setExtractedItems] = useState(null);
  const [quotation, setQuotation] = useState(null);
  const [message, setMessage] = useState('');
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthProvider>
        <LoginPage onLogin={(selectedRole) => {
          setRole(selectedRole);
          setIsAuthenticated(true);
        }} />
      </AuthProvider>
    );
  }

  // ADMIN DASHBOARD
  if (role === "admin") {
    return (
      <AuthProvider>
        <AdminDashboard onLogout={() => {
          setRole(null);
          setIsAuthenticated(false);
          localStorage.removeItem('sessionId');
          localStorage.removeItem('role');
        }} />
      </AuthProvider>
    );
  }

  // SALES EXECUTIVE DASHBOARD
  if (role === "sales") {
    return (
      <AuthProvider>
        <SalesDashboard
          onStartQuotation={() => setSelectedPage("upload")}
          onLogout={() => {
            setRole(null);
            setIsAuthenticated(false);
            localStorage.removeItem('sessionId');
            localStorage.removeItem('role');
          }}
        />
      </AuthProvider>
    );
  }

  // CUSTOMER DASHBOARD
  if (role === "customer") {
    return (
      <AuthProvider>
        <CustomerView onLogout={() => {
          setRole(null);
          setIsAuthenticated(false);
          localStorage.removeItem('sessionId');
          localStorage.removeItem('role');
        }} />
      </AuthProvider>
    );
  }

  // Called by UploadCard when file/text is ready to send
  async function handleSendToBackend({ file, text }) {
    setProcessing(true);
    setProgress(0);
    setMessage('Uploading...');

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
          setExtractedItems(resp.items || []);
          setQuotation(resp.quotation || null);
          setUploadedName(resp.fileName || (text ? 'pasted text' : 'uploaded'));
          setMessage('Processing complete.');
          setSelectedPage('quotation');
        } else {
          setMessage('Server error: ' + xhr.status);
        }
        setProcessing(false);
        setProgress(100);
      };

      xhr.onerror = () => {
        setMessage('Network error.');
        setProcessing(false);
      };

      const form = new FormData();
      if (file) form.append('file', file);
      if (text) form.append('text', text);
      xhr.send(form);
    } catch (err) {
      setMessage('Send error: ' + err.message);
      setProcessing(false);
    }
  }

  return (
    <AuthProvider>
      <div className="app-root">
        <Sidebar selected={selectedPage} onSelect={setSelectedPage} />
        <div className="main-area">
          <Topbar siteTitle="AI ERP – Interior Quoter" userName="User" />
          <div className="content">
            <div className="left-column">
              {selectedPage === 'home' && (
                <HomeLanding onTryUpload={() => setSelectedPage('upload')} />
              )}
              {selectedPage === 'upload' && (
                <UploadCard
                  onSubmit={handleSendToBackend}
                  processing={processing}
                  progress={progress}
                  message={message}
                />
              )}

              {selectedPage === 'quotation' && (
                <QuotationCard
                  items={extractedItems}
                  quotation={quotation}
                  fileName={uploadedName}
                  onBack={() => setSelectedPage('upload')}
                />
              )}
            </div>

            <aside className="right-column">
              <div className="card">
                <h3>Quick Info</h3>
                <p className="muted">Supported: JPG/PNG/PDF/TXT. Recommended: clear photos or exported PDFs.</p>
              </div>

              <div className="card">
                <h3>Status</h3>
                <div>{processing ? 'Processing...' : 'Idle'}</div>
                <div className="muted">{message}</div>
              </div>

              <div className="card">
                <h3>Tips</h3>
                <ul>
                  <li>Photos: capture from eye level</li>
                  <li>For text, paste or upload a .txt/.docx export</li>
                  <li>Use good lighting for images</li>
                </ul>
              </div>
            </aside>
          </div>

          <footer className="footer">© {new Date().getFullYear()} AI ERP</footer>
        </div>
      </div>
    </AuthProvider>
  );
}