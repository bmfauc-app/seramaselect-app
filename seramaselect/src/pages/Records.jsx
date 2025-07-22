import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TopToolBar from '../components/TopToolBar';
import Footer from '../components/Footer';
import { useTraitData } from '../contexts/TraitContext';
import { useTheme } from '../App';
import { FaEdit, FaTrash, FaPlus, FaSort, FaSortUp, FaSortDown, FaEye } from 'react-icons/fa';

export default function Records() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { records, loadRecord, deleteRecord, clearTraitData, updateRecordPhoto } = useTraitData();
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // Check for duplicate bird IDs
  const duplicateIds = useMemo(() => {
    const idCounts = {};
    const duplicates = new Set();
    
    records.forEach(record => {
      const id = record.name?.toLowerCase().trim();
      if (id) {
        idCounts[id] = (idCounts[id] || 0) + 1;
        if (idCounts[id] > 1) {
          duplicates.add(id);
        }
      }
    });
    
    return duplicates;
  }, [records]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';

      // Special handling for age calculation
      if (sortField === 'age') {
        aVal = calculateAge(a);
        bVal = calculateAge(b);
        // Convert 'Unknown' to -1 for sorting
        aVal = aVal === 'Unknown' ? -1 : parseInt(aVal);
        bVal = bVal === 'Unknown' ? -1 : parseInt(bVal);
      }

      // Convert to string for consistent comparison
      aVal = aVal.toString().toLowerCase();
      bVal = bVal.toString().toLowerCase();

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  }, [records, sortField, sortDirection]);

  const handleEdit = (record) => {
    loadRecord(record);
    navigate('/traits');
  };

  const handleDelete = (recordId) => {
    setRecordToDelete(recordId);
  };

  const confirmDelete = async () => {
    if (recordToDelete) {
      try {
        await deleteRecord(recordToDelete);
        setRecordToDelete(null);
      } catch (error) {
        console.error('Error deleting record:', error);
        setRecordToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setRecordToDelete(null);
  };

  const handleAddNew = () => {
    clearTraitData();
    navigate('/traits');
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const calculateAge = (record) => {
    if (!record.dateOfBirth) return 'Unknown';

    const now = new Date();
    const birthDate = new Date(record.dateOfBirth);
    const diffInMonths = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24 * 30.44));
    return diffInMonths >= 0 ? diffInMonths : 'Unknown';
  };

  return (
    <div>
      <TopToolBar />
      <main style={{ padding: '1rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h1>Bird Records</h1>
            <button
              onClick={handleAddNew}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
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
              <FaPlus /> Add New Record
            </button>
          </div>

          {/* Duplicate ID Warning */}
          {duplicateIds.size > 0 && (
            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <div>
                <strong style={{ color: '#856404' }}>Duplicate Bird IDs Detected</strong>
                <p style={{ margin: '0.25rem 0 0 0', color: '#856404', fontSize: '0.9rem' }}>
                  Found {duplicateIds.size} duplicate ID{duplicateIds.size > 1 ? 's' : ''}: {Array.from(duplicateIds).join(', ')}
                </p>
              </div>
            </div>
          )}

          {records.length === 0 ? (
            <div style={{
              backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff',
              padding: '3rem',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.6)' : '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              <h3>No records found</h3>
              <p>Start by adding your first bird record using the trait selector.</p>
              <button
                onClick={handleAddNew}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                Get Started
              </button>
            </div>
          ) : (
            <div>
              {/* Desktop Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '80px 2fr 1fr 1fr 1fr 2fr 160px',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
                borderBottom: `2px solid ${isDarkMode ? '#404040' : '#e0e0e0'}`,
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}
              className="desktop-header"
              >
                <div>Photo</div>
                <div 
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onClick={() => handleSort('name')}
                >
                  ID {getSortIcon('name')}
                </div>
                <div 
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onClick={() => handleSort('sex')}
                >
                  Sex {getSortIcon('sex')}
                </div>
                <div 
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onClick={() => handleSort('age')}
                >
                  Age {getSortIcon('age')}
                </div>
                <div 
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onClick={() => handleSort('projectId')}
                >
                  Project {getSortIcon('projectId')}
                </div>
                <div 
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onClick={() => handleSort('cv')}
                >
                  Color {getSortIcon('cv')}
                </div>
                <div>Actions</div>
              </div>

              {/* Mobile Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '80px 2fr 160px',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
                borderBottom: `2px solid ${isDarkMode ? '#404040' : '#e0e0e0'}`,
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}
              className="mobile-header"
              >
                <div>Photo</div>
                <div 
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onClick={() => handleSort('name')}
                >
                  ID {getSortIcon('name')}
                </div>
                <div>Actions</div>
              </div>

              {/* Desktop Table Rows */}
              {sortedRecords.map((record) => {
                const age = calculateAge(record);
                return (

                  <div key={record.id}>
                    {/* Desktop Row */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 2fr 1fr 1fr 1fr 2fr 160px',
                        gap: '1rem',
                        padding: '1rem',
                        borderBottom: `1px solid ${isDarkMode ? '#404040' : '#e0e0e0'}`,
                        transition: 'background-color 0.2s ease',
                        cursor: 'pointer',
                        backgroundColor: duplicateIds.has(record.name?.toLowerCase().trim()) ? 
                          (isDarkMode ? 'rgba(255, 193, 7, 0.1)' : 'rgba(255, 243, 205, 0.5)') : 
                          'transparent'
                      }}
                      className="desktop-row"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isDarkMode ? '#333' : '#f0f0f0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Photo */}
                      <div>
                        <img
                          src={record.imageUrl || '/assets/ss.png'}
                          alt={record.name}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            backgroundColor: '#f0f0f0'
                          }}
                          onError={(e) => {
                            e.target.src = '/assets/ss.png';
                          }}
                        />
                      </div>

                      {/* ID */}
                      <div style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: '500',
                        color: isDarkMode ? '#fff' : '#333',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        {record.name}
                        {duplicateIds.has(record.name?.toLowerCase().trim()) && (
                          <span 
                            style={{ 
                              color: '#ff6b35', 
                              fontSize: '1rem',
                              fontWeight: 'bold'
                            }}
                            title="Duplicate ID detected"
                          >
                            ⚠️
                          </span>
                        )}
                      </div>

                      {/* Sex */}
                      <div style={{ 
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {record.sex}
                      </div>

                      {/* Age */}
                      <div style={{ 
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {age === 'Unknown' ? 'Unknown' : `${age}m`}
                      </div>

                      {/* Project */}
                      <div style={{ 
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {record.projectId || 'General'}
                      </div>

                      {/* Color (CV) */}
                      <div style={{ 
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {record.cv || 'N/A'}
                      </div>

                      {/* Actions */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.3rem',
                        alignItems: 'center'
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = async (event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                try {
                                  await updateRecordPhoto(record.id, file);
                                } catch (error) {
                                  alert('Failed to upload photo: ' + error.message);
                                }
                              }
                            };
                            input.click();
                          }}
                          style={{
                            padding: '0.4rem',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                          title="Upload photo"
                        >
                          📷
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(record);
                          }}
                          style={{
                            padding: '0.4rem',
                            backgroundColor: '#17a2b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                          title="View details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(record);
                          }}
                          style={{
                            padding: '0.4rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                          title="Edit record"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id);
                          }}
                          style={{
                            padding: '0.4rem',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                          title="Delete record"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {/* Mobile Row */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 2fr 160px',
                        gap: '1rem',
                        padding: '1rem',
                        borderBottom: `1px solid ${isDarkMode ? '#404040' : '#e0e0e0'}`,
                        transition: 'background-color 0.2s ease',
                        cursor: 'pointer',
                        backgroundColor: duplicateIds.has(record.name?.toLowerCase().trim()) ? 
                          (isDarkMode ? 'rgba(255, 193, 7, 0.1)' : 'rgba(255, 243, 205, 0.5)') : 
                          'transparent'
                      }}
                      className="mobile-row"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isDarkMode ? '#333' : '#f0f0f0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Photo */}
                      <div>
                        <img
                          src={record.imageUrl || '/assets/ss.png'}
                          alt={record.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            backgroundColor: '#f0f0f0'
                          }}
                          onError={(e) => {
                            e.target.src = '/assets/ss.png';
                          }}
                        />
                      </div>

                      {/* ID */}
                      <div style={{ 
                        fontSize: '1rem', 
                        fontWeight: '500',
                        color: isDarkMode ? '#fff' : '#333',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        {record.name}
                        {duplicateIds.has(record.name?.toLowerCase().trim()) && (
                          <span 
                            style={{ 
                              color: '#ff6b35', 
                              fontSize: '1.1rem',
                              fontWeight: 'bold'
                            }}
                            title="Duplicate ID detected"
                          >
                            ⚠️
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.3rem',
                        alignItems: 'center'
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = async (event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                try {
                                  await updateRecordPhoto(record.id, file);
                                } catch (error) {
                                  alert('Failed to upload photo: ' + error.message);
                                }
                              }
                            };
                            input.click();
                          }}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                          title="Upload photo"
                        >
                          📷
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(record);
                          }}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#17a2b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                          title="View details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(record);
                          }}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                          title="Edit record"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id);
                          }}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                          title="Delete record"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Detail Modal */}
          {selectedRecord && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem'
            }}>
              <div style={{
                backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto',
                position: 'relative'
              }}>
                <button
                  onClick={() => setSelectedRecord(null)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: isDarkMode ? '#fff' : '#333'
                  }}
                >
                  ×
                </button>

                <h3 style={{ marginBottom: '1.5rem' }}>
                  Bird Details: {selectedRecord.name}
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                  <img
                    src={selectedRecord.imageUrl || '/assets/ss.png'}
                    alt={selectedRecord.name}
                    style={{
                      width: '100%',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      backgroundColor: '#f0f0f0'
                    }}
                    onError={(e) => {
                      e.target.src = '/assets/ss.png';
                    }}
                  />
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <strong>Bird Name/ID:</strong> {selectedRecord.name}
                  </div>
                  <div>
                    <strong>Sex:</strong> {selectedRecord.sex}
                  </div>
                  <div>
                    <strong>Weight:</strong> {selectedRecord.weight} oz
                  </div>
                  <div>
                    <strong>Status:</strong> {selectedRecord.status === 'Other' ? `${selectedRecord.otherStatus} (${selectedRecord.otherCategory})` : selectedRecord.status}
                  </div>
                  <div>
                    <strong>Date Recorded:</strong> {formatDate(selectedRecord.timestamp)}
                  </div>
                  <div>
                    <strong>Age:</strong> {calculateAge(selectedRecord) === 'Unknown' ? 'Unknown' : `${calculateAge(selectedRecord)} months old`}
                  </div>
                  {selectedRecord.dateOfBirth && (
                    <div>
                      <strong>Date of Birth:</strong> {new Date(selectedRecord.dateOfBirth).toLocaleDateString()}
                    </div>
                  )}
                  <div>
                    <strong>Project ID:</strong> {selectedRecord.projectId || 'General'}
                  </div>
                </div>

                {/* Classification Results */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>Classification Results</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      CT: {selectedRecord.ct}
                    </span>
                    <span style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      PT: {selectedRecord.pt}
                    </span>
                    <span style={{
                      backgroundColor: '#ffc107',
                      color: '#333',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      Color: {selectedRecord.cv}
                    </span>
                  </div>
                </div>

                {/* Warnings */}
                {selectedRecord.warnings && selectedRecord.warnings.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#dc3545' }}>
                      ⚠️ Warnings ({selectedRecord.warnings.length})
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                      {selectedRecord.warnings.map((warning, index) => (
                        <li key={index} style={{ color: '#dc3545', fontSize: '0.9rem' }}>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
        {recordToDelete && (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }}>
            <div style={{
                backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '400px',
                width: '100%',
                textAlign: 'center'
            }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Delete Confirmation</h3>
                <p style={{ marginBottom: '2rem' }}>Are you sure you want to delete this record?</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        onClick={confirmDelete}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        Yes, Delete
                    </button>
                    <button
                        onClick={cancelDelete}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )}
    </div>
  );
}