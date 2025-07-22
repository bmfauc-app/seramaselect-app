import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TopToolBar from '../components/TopToolBar';
import Footer from '../components/Footer';
import { useTraitData } from '../contexts/TraitContext';
import { useTheme } from '../App';
import { FaArrowRight, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { classifyBird } from '../utils/classify';
import { traitOptions } from '../data/traitOptions';

export default function TraitSelector() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { 
    traitData, 
    updateTraitData, 
    results, 
    updateResults, 
    saveRecord, 
    clearTraitData,
    records 
  } = useTraitData();

  const [mode, setMode] = useState('quick');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [saveAndNext, setSaveAndNext] = useState(false);

  const [formData, setFormData] = useState({
    name: traitData.name || '',
    sex: traitData.sex || '',
    weight: traitData.weight || '',
    dateOfBirth: traitData.dateOfBirth || '',
    bodyCarriage: traitData.traits.bodyCarriage || 'Upright', // Smart default
    backLength: traitData.traits.backLength || 'Short', // Smart default
    tailCarriage: traitData.traits.tailCarriage || '',
    wingPosition: traitData.traits.wingPosition || '',
    comb: traitData.comb || '',
    featherType: traitData.traits.featherType || 'Normal', // Smart default
    colorPattern: traitData.traits.colorPattern || 'Other', // Smart default
    status: traitData.status || '',
    otherStatus: traitData.otherStatus || '',
    otherCategory: traitData.otherCategory || '',
    projectId: traitData.projectId || '' // Added Project ID

  });

  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    // Load existing trait data if available
    if (traitData.id) {
      setFormData({
        name: traitData.name || '',
        sex: traitData.sex || '',
        weight: traitData.weight || '',
        dateOfBirth: traitData.dateOfBirth || '',
        bodyCarriage: traitData.traits.bodyCarriage || 'Upright',
        backLength: traitData.traits.backLength || 'Short',
        tailCarriage: traitData.tailCarriage || '',
        wingPosition: traitData.wingPosition || '',
        comb: traitData.comb || '',
        featherType: traitData.featherType || 'Normal',
        colorPattern: traitData.colorPattern || 'Other',
        status: traitData.status || '',
        otherStatus: traitData.otherStatus || '',
        otherCategory: traitData.otherCategory || '',
        projectId: traitData.projectId || '' // Added Project ID
      });
    }
  }, [traitData]);



  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnalyze = async () => {
    // Check for duplicate bird IDs (only for new records, not edits)
    if (!traitData.id) {
      const birdId = formData.name?.toLowerCase().trim();
      const existingRecord = records.find(record => 
        record.name?.toLowerCase().trim() === birdId
      );
      
      if (existingRecord) {
        alert(`⚠️ A bird with ID "${formData.name}" already exists. Please use a unique ID.`);
        return;
      }
    }

    if (mode === 'quick') {
      // Quick Log mode: Save directly without classification
      updateTraitData({
        id: traitData.id, // Preserve existing ID for updates
        name: formData.name,
        sex: formData.sex,
        weight: parseFloat(formData.weight) || 0,
        dateOfBirth: formData.dateOfBirth,
        traits: {},
        status: formData.status,
        otherStatus: formData.otherStatus,
        otherCategory: formData.otherCategory,
        projectId: formData.projectId
      });
      const quickLogData = {
        id: traitData.id || `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name,
        sex: formData.sex,
        weight: parseFloat(formData.weight) || 0,
        dateOfBirth: formData.dateOfBirth,
        status: formData.status,
        otherStatus: formData.otherStatus,
        otherCategory: formData.otherCategory,
        projectId: formData.projectId,
        traits: {},
        ct: '',
        pt: '',
        cv: '',
        warnings: []
      };

      try {
        console.log('🔄 Quick-saving record...');
        await saveRecord(quickLogData);
        console.log('✅ Record saved!');
        
        // Keep form populated after save - don't clear
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 1000);
      } catch (error) {
        console.error('Quick-save failed:', error);
        alert('Failed to save record. Please try again.');
      }
      return;
    } else {
      // Full Classification mode: Run classification and go to results
      const traits = {
        bodyCarriage: formData.bodyCarriage,
        backLength: formData.backLength,
        tailCarriage: formData.tailCarriage,
        wingPosition: formData.wingPosition,
        comb: formData.comb,
        featherType: formData.featherType,
        colorPattern: formData.colorPattern
      };

      updateTraitData({
        id: traitData.id, // Preserve existing ID for updates
        name: formData.name,
        sex: formData.sex,
        weight: parseFloat(formData.weight) || 0,
        dateOfBirth: formData.dateOfBirth,
        traits: traits,
        status: formData.status,
        otherStatus: formData.otherStatus,
        otherCategory: formData.otherCategory,
        projectId: formData.projectId
      });

      const classificationResults = classifyBird({
        bodyCarriage: formData.bodyCarriage,
        backLength: formData.backLength,
        featherType: formData.featherType,
        colorPattern: formData.colorPattern,
        weight: parseFloat(formData.weight) || 0,
        mode: 'detailed'
      });
      updateResults(classificationResults);
      navigate('/results');
    }
  };

  const handleClear = () => {
    clearTraitData();
    setFormData({
      name: '',
      sex: '',
      weight: '',
      dateOfBirth: '',
      bodyCarriage: 'Upright',
      backLength: 'Short',
      tailCarriage: '',
      wingPosition: '',
      comb: '',
      featherType: 'Normal',
      colorPattern: 'Other',
      status: '',
      otherStatus: '',
      otherCategory: '',
      projectId: '' // Added project ID
    });
    setMode('quick');

  };

  // Quick Log mode only requires essential fields
  const isQuickLogValid = formData.name && formData.sex && formData.weight && formData.status;
  // Full Classification mode requires all classification fields too
  const isFullClassificationValid = isQuickLogValid && formData.bodyCarriage && formData.backLength && formData.featherType && formData.colorPattern;

  const isFormValid = mode === 'quick' ? isQuickLogValid : isFullClassificationValid;

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
      <main style={{ 
        padding: '1rem', 
        minHeight: '90vh',
        paddingBottom: '120px' 
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1>Bird Entry</h1>

          {/* Mode Toggle */}
          <div style={{
            backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontWeight: 'bold' }}>Entry Mode:</span>
            <button
              onClick={() => setMode('quick')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: mode === 'quick' ? '#007bff' : 'transparent',
                color: mode === 'quick' ? 'white' : (isDarkMode ? '#fff' : '#333'),
                border: `1px solid ${mode === 'quick' ? '#007bff' : (isDarkMode ? '#555' : '#ddd')}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🚀 Quick Log
            </button>
            <button
              onClick={() => setMode('classification')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: mode === 'classification' ? '#28a745' : 'transparent',
                color: mode === 'classification' ? 'white' : (isDarkMode ? '#fff' : '#333'),
                border: `1px solid ${mode === 'classification' ? '#28a745' : (isDarkMode ? '#555' : '#ddd')}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🔬 Full Classification
            </button>
          </div>

          {/* Core Information (Always Shown) */}
          <div style={{
            backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.6)' : '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <h2>Core Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Bird Name/ID *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? '#404040' : '#fff',
                    color: isDarkMode ? '#fff' : '#333'
                  }}
                  placeholder="Enter bird name or ID"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Sex *
                </label>
                <select
                  value={formData.sex}
                  onChange={(e) => handleInputChange('sex', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? '#404040' : '#fff',
                    color: isDarkMode ? '#fff' : '#333'
                  }}
                >
                  <option value="">Select sex</option>
                  {traitOptions.sex.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Weight (ounces) *
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? '#404040' : '#fff',
                    color: isDarkMode ? '#fff' : '#333'
                  }}
                  placeholder="Enter weight in ounces"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? '#404040' : '#fff',
                    color: isDarkMode ? '#fff' : '#333'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Project ID
                </label>
                <input
                  type="text"
                  value={formData.projectId || ''}
                  onChange={(e) => handleInputChange('projectId', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? '#404040' : '#fff',
                    color: isDarkMode ? '#fff' : '#333'
                  }}
                  placeholder="Enter project identifier (optional)"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? '#404040' : '#fff',
                    color: isDarkMode ? '#fff' : '#333'
                  }}
                >
                  <option value="">Select status</option>
                  <optgroup label="Active">
                    <option value="Breeder">Breeder</option>
                    <option value="Growout">Growout</option>
                    <option value="Chick">Chick</option>
                    <option value="Brood Hen">Brood Hen</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Active">Active</option>
                  </optgroup>
                  <optgroup label="Inactive">
                    <option value="Sold">Sold</option>
                    <option value="Deceased">Deceased</option>
                    <option value="Pet Quality">Pet Quality</option>
                    <option value="For Sale">For Sale</option>
                    <option value="Retired">Retired</option>
                    <option value="Inactive Chick">Inactive Chick</option>
                    <option value="Inactive Growout">Inactive Growout</option>
                    <option value="Undecided">Undecided</option>
                  </optgroup>
                  <option value="Other">Other (Specify)</option>
                </select>
                {formData.status === 'Other' && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      value={formData.otherStatus}
                      onChange={(e) => handleInputChange('otherStatus', e.target.value)}
                      placeholder="Specify other status"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
                        borderRadius: '6px',
                        backgroundColor: isDarkMode ? '#404040' : '#fff',
                        color: isDarkMode ? '#fff' : '#333'
                      }}
                    />
                    <div style={{ marginTop: '0.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="radio"
                          name="otherCategory"
                          value="active"
                          checked={formData.otherCategory === 'active'}
                          onChange={(e) => handleInputChange('otherCategory', e.target.value)}
                        />
                        Active
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="radio"
                          name="otherCategory"
                          value="inactive"
                          checked={formData.otherCategory === 'inactive'}
                          onChange={(e) => handleInputChange('otherCategory', e.target.value)}
                        />
                        Inactive
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>


            </div>

          {/* Classification Details (Only in Full Classification Mode) */}
          {mode === 'classification' && (
            <div style={{
              backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.6)' : '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              <h2>Classification Details</h2>
              <p style={{ color: isDarkMode ? '#aaa' : '#666', marginBottom: '1.5rem' }}>
                Complete these fields for full breed classification (CT, PT, CV)
              </p>

              {/* Essential Classification Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Body Carriage *
                  </label>
                  <select
                    value={formData.bodyCarriage}
                    onChange={(e) => handleInputChange('bodyCarriage', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
                      borderRadius: '8px',
                      backgroundColor: isDarkMode ? '#404040' : '#fff',
                      color: isDarkMode ? '#fff' : '#333'
                    }}
                  >
                    {traitOptions.bodyCarriage.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Back Length *
                  </label>
                  <select
                    value={formData.backLength}
                    onChange={(e) => handleInputChange('backLength', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
                      borderRadius: '8px',
                      backgroundColor: isDarkMode ? '#404040' : '#fff',
                      color: isDarkMode ? '#fff' : '#333'
                    }}
                  >
                    {traitOptions.backLength.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Feather Type *
                  </label>
                  <select
                    value={formData.featherType}
                    onChange={(e) => handleInputChange('featherType', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
                      borderRadius: '8px',
                      backgroundColor: isDarkMode ? '#404040' : '#fff',
                      color: isDarkMode ? '#fff' : '#333'
                    }}
                  >
                    {traitOptions.featherType.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Color Pattern *
                  </label>
                  <select
                    value={formData.colorPattern}
                    onChange={(e) => handleInputChange('colorPattern', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
                      borderRadius: '8px',
                      backgroundColor: isDarkMode ? '#404040' : '#fff',
                      color: isDarkMode ? '#fff' : '#333'
                    }}
                  >
                    {traitOptions.colorPattern.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Extended Traits (Collapsible) */}
              <details>
                <summary style={{ 
                  cursor: 'pointer', 
                  fontWeight: 'bold', 
                  padding: '0.5rem',
                  backgroundColor: isDarkMode ? '#404040' : '#f8f9fa',
                  borderRadius: '6px',
                  marginBottom: '1rem'
                }}>
                  Extended Traits (Optional) ▼
                </summary>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Tail Carriage
                    </label>
                    <select
                      value={formData.tailCarriage}
                      onChange={(e) => handleInputChange('tailCarriage', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
                        borderRadius: '8px',
                        backgroundColor: isDarkMode ? '#404040' : '#fff',
                        color: isDarkMode ? '#fff' : '#333'
                      }}
                    >
                      <option value="">Select tail carriage</option>
                      {traitOptions.tailCarriage.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Wing Position
                    </label>
                    <select
                      value={formData.wingPosition}
                      onChange={(e) => handleInputChange('wingPosition', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
                        borderRadius: '8px',
                        backgroundColor: isDarkMode ? '#404040' : '#fff',
                        color: isDarkMode ? '#fff' : '#333'
                      }}
                    >
                      <option value="">Select wing position</option>
                      {traitOptions.wingPosition.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Comb Type
                    </label>
                    <select
                      value={formData.comb}
                      onChange={(e) => handleInputChange('comb', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
                        borderRadius: '8px',
                        backgroundColor: isDarkMode ? '#404040' : '#fff',
                        color: isDarkMode ? '#fff' : '#333'
                      }}
                    >
                      <option value="">Select comb type</option>
                      {traitOptions.comb.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </details>
            </div>
          )}

          {/* Mode-specific Information */}
          <div style={{
            backgroundColor: isDarkMode ? '#1e3d59' : '#e3f2fd',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: `1px solid ${isDarkMode ? '#2e5984' : '#bbdefb'}`
          }}>
            {mode === 'quick' ? (
              <div>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>🚀 Quick Log Mode:</strong> Minimal fields for rapid bird entry. Perfect for logging multiple birds quickly.
                </p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: isDarkMode ? '#aaa' : '#666' }}>
                  💡 <strong>Tip:</strong> Use "Save & Next" to quickly log multiple birds in sequence. 
                  Add classification details later by editing records.
                </p>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                <strong>🔬 Full Classification Mode:</strong> Complete breed analysis with automatic 
                CT (Class Type), PT (Plumage Type), and CV (Color Variety) determination.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleClear}
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FaTimes /> Clear Form
            </button>
            
            {mode === 'quick' && (
              <button
                onClick={() => {
                  setSaveAndNext(true);
                  handleAnalyze();
                }}
                disabled={!isFormValid}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: isFormValid ? '#17a2b8' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: isFormValid ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <FaArrowRight /> Save
              </button>
            )}
            
            <button
              onClick={() => {
                setSaveAndNext(false);
                handleAnalyze();
              }}
              disabled={!isFormValid}
              style={{
                padding: '1rem 2rem',
                backgroundColor: isFormValid ? (mode === 'quick' ? '#007bff' : '#28a745') : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: isFormValid ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
            >
              <FaArrowRight /> {mode === 'quick' ? 'Save Record' : 'Analyze & Classify'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}