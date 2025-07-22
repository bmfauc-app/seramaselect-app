import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../App';
import { useTraitData } from '../contexts/TraitContext';
import { signInWithGoogle, auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { FaSun, FaMoon, FaFileAlt, FaDna, FaEgg, FaImages, FaBars } from 'react-icons/fa';

export default function TopToolBar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useTraitData();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign-in failed:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.5rem 1rem',
      backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff',
      marginBottom: '2rem',
      borderRadius: '12px',
      boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.6)' : '0 4px 12px rgba(0,0,0,0.15)',
      position: 'relative'
    }}>
      {/* Logo */}
      <Link to="/" style={{ flex: '0 0 auto' }}>
        <img 
          src="/assets/ss.png"
          alt="Serama Select Home"
          style={{ 
            height: '60px', 
            width: 'auto',
            aspectRatio: 'auto',
            objectFit: 'contain',
            filter: isDarkMode ? 'none' : 'invert(1) hue-rotate(180deg)',
            display: 'block'
          }}
        />
      </Link>

      {/* Center My Records Button */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexGrow: 1
      }}>
        <Link to="/records" className="records-button" style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#0056b3';
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 12px rgba(0, 123, 255, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#007bff';
          e.target.style.transform = 'translateY(0px)';
          e.target.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.3)';
        }}>
          <FaFileAlt /> <span className="records-text-full">My Records</span><span className="records-text-short">Records</span>
        </Link>
      </div>

      {/* Right side controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Auth Section */}
            <div style={{ 
              borderTop: `1px solid ${isDarkMode ? '#444' : '#eee'}`,
              paddingTop: '1rem',
              marginTop: '1rem'
            }}>
              {user ? (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                    padding: '0.5rem',
                    backgroundColor: isDarkMode ? '#404040' : '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    {user.photoURL && (
                      <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '2px solid #007bff'
                        }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        color: isDarkMode ? '#fff' : '#333',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {user.displayName || 'User'}
                      </p>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.8rem',
                        color: isDarkMode ? '#aaa' : '#666',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                >
                  Sign In with Google
                </button>
              )}
            </div>

        <button 
          onClick={toggleTheme}
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#444';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 5px 12px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#333';
            e.target.style.transform = 'translateY(0px)';
            e.target.style.boxShadow = '0 3px 8px rgba(0,0,0,0.3)';
          }}
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Hamburger Menu Button - always visible */}
        <button 
          onClick={toggleMenu}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: isDarkMode ? 'white' : '#333',
            padding: '0.5rem'
          }}
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '1rem',
          backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff',
          boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.6)' : '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: '8px',
          padding: '1rem',
          zIndex: 1000,
          minWidth: '150px'
        }}>
          <Link to="/traits" onClick={() => setMenuOpen(false)} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginBottom: '0.75rem', 
            color: isDarkMode ? 'white' : '#333', 
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = isDarkMode ? '#404040' : '#f0f0f0'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
            <FaDna /> Log
          </Link>
          <Link to="/hatching" onClick={() => setMenuOpen(false)} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginBottom: '0.75rem', 
            color: isDarkMode ? 'white' : '#333', 
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = isDarkMode ? '#404040' : '#f0f0f0'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
            <FaEgg /> Hatching
          </Link>
          <Link to="/gallery" onClick={() => setMenuOpen(false)} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: isDarkMode ? 'white' : '#333', 
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = isDarkMode ? '#404040' : '#f0f0f0'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
            <FaImages /> Gallery
          </Link>
        </div>
      )}
    </nav>
  );
}