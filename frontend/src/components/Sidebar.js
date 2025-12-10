import React from 'react';

export default function Sidebar({ selected, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="logo">AI-ERP</div>

      <nav className="menu">
        <button
          className={`nav-item ${selected === 'home' ? 'active' : ''}`}
          onClick={() => onSelect('home')}
        >
          Home
        </button>

        <button
          className={`nav-item ${selected === 'upload' ? 'active' : ''}`}
          onClick={() => onSelect('upload')}
        >
          
          Quotation
        </button>

        <button
          className={`nav-item ${selected === 'history' ? 'active' : ''}`}
          onClick={() => onSelect('history')}
        >
          History
        </button>
      </nav>

      <div className="sidebar-footer">v1.0</div>
    </aside>
  );
}

