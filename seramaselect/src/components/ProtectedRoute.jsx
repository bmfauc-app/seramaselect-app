
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTraitData } from '../contexts/TraitContext';
import { useTheme } from '../App';

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useTraitData();
  const { isDarkMode } = useTheme();

  // Show loading spinner while auth state is being determined
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: `3px solid ${isDarkMode ? '#444' : '#ddd'}`,
            borderTop: '3px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ 
            color: isDarkMode ? '#aaa' : '#666',
            fontSize: '0.9rem'
          }}>
            Loading...
          </p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content if authenticated
  return children;
}
