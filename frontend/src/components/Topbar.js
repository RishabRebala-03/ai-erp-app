import React from 'react';

export default function Topbar({ siteTitle, userName }) {
  return (
    <header className="topbar">
      <div className="site-title">{siteTitle}</div>
      <div className="user-area">Hello, <strong>{userName}</strong></div>
    </header>
  );
}