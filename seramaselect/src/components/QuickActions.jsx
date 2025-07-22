
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaDna, FaEgg, FaImages } from 'react-icons/fa';

export default function QuickActions() {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2>Quick Actions</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/records" style={{ 
          padding: '0.75rem 1.5rem', 
          backgroundColor: '#6c757d', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '8px',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(108, 117, 125, 0.3)',
          transition: 'all 0.3s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#5a6268';
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 12px rgba(108, 117, 125, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#6c757d';
          e.target.style.transform = 'translateY(0px)';
          e.target.style.boxShadow = '0 4px 8px rgba(108, 117, 125, 0.3)';
        }}>
          <FaFileAlt />
          My Records
        </Link>
        <Link to="/traits" style={{ 
          padding: '0.75rem 1.5rem', 
          backgroundColor: '#6c757d', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '8px',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(108, 117, 125, 0.3)',
          transition: 'all 0.3s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#5a6268';
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 12px rgba(108, 117, 125, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#6c757d';
          e.target.style.transform = 'translateY(0px)';
          e.target.style.boxShadow = '0 4px 8px rgba(108, 117, 125, 0.3)';
        }}>
          <FaDna />
          Log
        </Link>
        <Link to="/hatching" style={{ 
          padding: '0.75rem 1.5rem', 
          backgroundColor: '#6c757d', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '8px',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(108, 117, 125, 0.3)',
          transition: 'all 0.3s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#5a6268';
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 12px rgba(108, 117, 125, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#6c757d';
          e.target.style.transform = 'translateY(0px)';
          e.target.style.boxShadow = '0 4px 8px rgba(108, 117, 125, 0.3)';
        }}>
          <FaEgg />
          Hatching
        </Link>
        <Link to="/gallery" style={{ 
          padding: '0.75rem 1.5rem', 
          backgroundColor: '#6c757d', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '8px',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(108, 117, 125, 0.3)',
          transition: 'all 0.3s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#5a6268';
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 12px rgba(108, 117, 125, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#6c757d';
          e.target.style.transform = 'translateY(0px)';
          e.target.style.boxShadow = '0 4px 8px rgba(108, 117, 125, 0.3)';
        }}>
          <FaImages />
          Gallery
        </Link>
      </div>
    </section>
  );
}
