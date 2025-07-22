
import React from 'react';
import { useTheme } from '../App';

export default function Footer() {
  const { isDarkMode } = useTheme();

  return (
    <footer style={{ 
      textAlign: 'center', 
      padding: '.5rem', 
      backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#333',
      borderRadius: '12px',
      marginTop: '2rem',
      boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.6)' : '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>Powered By:</p>
      <img 
        src="/assets/ss.png" 
        alt="Logo" 
        style={{ 
          maxWidth: '140px', 
          marginBottom: '0.5rem',
          filter: isDarkMode ? 'none' : 'invert(1) hue-rotate(180deg)'
        }} 
      />
      <p style={{ margin: '0.5rem 0', fontSize: '0.7rem' }}>&copy; 2024 All rights reserved</p>
    </footer>
  );
}
