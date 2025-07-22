import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopToolBar from '../components/TopToolBar';
import Footer from '../components/Footer';
import { useTraitData } from '../contexts/TraitContext';
import { useTheme } from '../App';
import { FaSave, FaArrowLeft, FaExclamationTriangle, FaCamera } from 'react-icons/fa';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { traitData, results, saveRecord } = useTraitData();
  const [showSavedMessage, setShowSavedMessage] = React.useState(false);

  

  const handleSave = async () => {
    try {
      console.log('🔄 Preparing to save record...');

      const record = await saveRecord(null, null);

      // Show success message
      setShowSavedMessage(true);
      
      // Navigate to records after showing success message
      setTimeout(() => {
        navigate('/records');
      }, 2000);
    } catch (error) {
      console.error('Failed to save record:', error);
      // Silent error handling - error logged to console only
    }
  };

  const handleBack = () => {
    navigate('/traits');
  };

  return (
    <div>
      {/* Success Message Overlay */}
      {showSavedMessage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'fadeIn 0.3s ease-in'
        }}>
          <div style={{
            backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            animation: 'bounceIn 0.4s ease-out'
          }}>
            <h3 style={{
              color: '#28a745',
              margin: '0 0 0.5rem 0',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              ✓ Bird Saved!
            </h3>
            <p style={{
              color: isDarkMode ? '#aaa' : '#666',
              margin: 0,
              fontSize: '0.95rem'
            }}>
              Record saved to your collection.
            </p>
          </div>
        </div>
      )}
      
      <TopToolBar />
      <main style={{ padding: '1rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            marginBottom: '2rem' 
          }}>
            <button
              onClick={handleBack}
              style={{
                padding: '0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                color: isDarkMode ? '#ffffff' : '#333',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1>
                {results?.mode === 'basic' ? 'Bird Record Saved' : 'Classification Results'}
              </h1>
              {results?.mode === 'basic' && (
                <p style={{ 
                  margin: '0.25rem 0 0 0', 
                  color: isDarkMode ? '#aaa' : '#666',
                  fontSize: '0.9rem'
                }}>
                  Basic record saved. You can add full classification details later by editing this record.
                </p>
              )}
            </div>
          </div>

          {/* Bird Information */}
          <div style={{
            backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.6)' : '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaCamera /> Bird Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <strong>Name:</strong> {traitData.name || 'Unnamed'}
              </div>
              <div>
                <strong>Sex:</strong> {traitData.sex}
              </div>
              <div>
                <strong>Weight:</strong> {traitData.weight} oz
              </div>
              {traitData.dateOfBirth && (
                <div>
                  <strong>Date of Birth:</strong> {new Date(traitData.dateOfBirth).toLocaleDateString()}
                </div>
              )}
              <div>
                <strong>Status:</strong> {traitData.status === 'Other' ? `${traitData.otherStatus} (${traitData.otherCategory})` : traitData.status}
              </div>
            </div>

            
          </div>

          {/* Classification Results */}
          <div style={{
            backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.6)' : '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <h2>Classification Results</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div style={{
                padding: '1rem',
                backgroundColor: isDarkMode ? '#404040' : '#f8f9fa',
                borderRadius: '8px'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#007bff' }}>Class Type (CT)</h3>
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
                  {results.ct || 'Not determined'}
                </p>
              </div>
              <div style={{
                padding: '1rem',
                backgroundColor: isDarkMode ? '#404040' : '#f8f9fa',
                borderRadius: '8px'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#28a745' }}>Plumage Type (PT)</h3>
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
                  {results.pt || 'Not determined'}
                </p>
              </div>
              <div style={{
                padding: '1rem',
                backgroundColor: isDarkMode ? '#404040' : '#f8f9fa',
                borderRadius: '8px'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#ffc107' }}>Color Variety (CV)</h3>
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
                  {results.cv || 'Not determined'}
                </p>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {results.warnings && results.warnings.length > 0 && (
            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#856404', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaExclamationTriangle /> Warnings
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                {results.warnings.map((warning, index) => (
                  <li key={index} style={{ color: '#856404', marginBottom: '0.5rem' }}>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleSave}
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
            >
              <FaSave /> Save to Records
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}