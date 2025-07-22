
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, auth } from '../firebase/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useTheme } from '../App';
import { FaGoogle, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

export default function LoginPage() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      navigate('/');
    } catch (error) {
      console.error('Email auth failed:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed. Please try again.';
      case 'auth/configuration-not-found':
        return 'Authentication configuration error. Please contact support.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: isDarkMode ? '0 8px 24px rgba(0,0,0,0.6)' : '0 8px 24px rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img 
            src="/assets/ss.png" 
            alt="Serama Select" 
            style={{ 
              maxWidth: '120px', 
              marginBottom: '1rem',
              filter: isDarkMode ? 'none' : 'invert(1) hue-rotate(180deg)'
            }} 
          />
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={{ 
            margin: 0, 
            color: isDarkMode ? '#aaa' : '#666',
            fontSize: '0.9rem'
          }}>
            {isSignUp ? 'Join the Serama Select community' : 'Sign in to your account'}
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.3s ease'
          }}
        >
          <FaGoogle /> {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '1rem 0',
          color: isDarkMode ? '#aaa' : '#666'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: isDarkMode ? '#444' : '#ddd' }}></div>
          <span style={{ padding: '0 1rem', fontSize: '0.9rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: isDarkMode ? '#444' : '#ddd' }}></div>
        </div>

        <form onSubmit={handleEmailAuth}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: isDarkMode ? '#404040' : '#f8f9fa',
              border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
              borderRadius: '8px',
              padding: '0.75rem'
            }}>
              <FaEnvelope style={{ color: isDarkMode ? '#aaa' : '#666', marginRight: '0.5rem' }} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: isDarkMode ? '#fff' : '#333',
                  fontSize: '1rem',
                  width: '100%',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: isDarkMode ? '#404040' : '#f8f9fa',
              border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
              borderRadius: '8px',
              padding: '0.75rem'
            }}>
              <FaLock style={{ color: isDarkMode ? '#aaa' : '#666', marginRight: '0.5rem' }} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: isDarkMode ? '#fff' : '#333',
                  fontSize: '1rem',
                  width: '100%',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: isSignUp ? '#28a745' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            <FaUser /> {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: 'none',
              border: 'none',
              color: isDarkMode ? '#4a90e2' : '#007bff',
              cursor: 'pointer',
              fontSize: '0.9rem',
              textDecoration: 'underline'
            }}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
