
import React from 'react';
import { Link } from 'react-router-dom';

export default function TopToolBar() {
  return (
    <nav style={{ 
      padding: '1rem', 
      backgroundColor: '#f0f0f0', 
      marginBottom: '2rem',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h2>serama selext</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>Home</Link>
        <Link to="/records" style={{ textDecoration: 'none', color: '#333' }}>Records</Link>
        <Link to="/traits" style={{ textDecoration: 'none', color: '#333' }}>Traits</Link>
        <Link to="/hatching" style={{ textDecoration: 'none', color: '#333' }}>Hatching</Link>
        <Link to="/gallery" style={{ textDecoration: 'none', color: '#333' }}>Gallery</Link>
      </div>
    </nav>
  );
}
