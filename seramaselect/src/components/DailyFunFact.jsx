
import React from 'react';
import { useTheme } from '../App';
import { FaLightbulb } from 'react-icons/fa';
import { getDailyFact } from '../data/seramaFacts';

export default function DailyFunFact() {
  const { isDarkMode } = useTheme();
  const dailyFact = getDailyFact();

  return (
    <div style={{
      backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
      padding: '1.5rem',
      borderRadius: '12px',
      margin: '1.5rem 0',
      border: `2px solid ${isDarkMode ? '#404040' : '#e9ecef'}`,
      boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.6)' : '0 4px 12px rgba(0,0,0,0.15)',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        <FaLightbulb style={{ 
          color: '#ffc107',
          fontSize: '1.5rem'
        }} />
        <h3 style={{
          margin: 0,
          color: isDarkMode ? '#ffffff' : '#333',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}>
          Daily Serama Fact
        </h3>
      </div>
      <p style={{
        margin: 0,
        color: isDarkMode ? '#e0e0e0' : '#555',
        fontSize: '1rem',
        lineHeight: '1.6',
        fontStyle: 'italic'
      }}>
        "{dailyFact}"
      </p>
    </div>
  );
}
