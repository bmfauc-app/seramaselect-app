import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, storage, auth } from '../firebase/firebase';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { compressImage } from '../utils/imageUtils';

const TraitContext = createContext();

export const useTraitData = () => {
  const context = useContext(TraitContext);
  if (!context) {
    throw new Error('useTraitData must be used within a TraitProvider');
  }
  return context;
};

export const TraitProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [traitData, setTraitData] = useState({
    id: null,
    name: '',
    sex: '',
    weight: 0,
    dateOfBirth: '',
    status: 'Active',
    otherStatus: '',
    otherCategory: 'active',
    projectId: '',
    traits: {}
  });

  const [results, setResults] = useState({
    ct: '',
    pt: '',
    cv: '',
    warnings: []
  });

  const [records, setRecords] = useState([]);

  // User-specific collection path
  const basePath = user
    ? collection(db, 'users', user.uid, 'records')
    : null;

  // Watch for auth changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      // Clear records when user signs out
      if (!u) {
        setRecords([]);
      }
    });
    return unsub;
  }, []);

  // Fetch only this user's records
  useEffect(() => {
    const fetchRecords = async () => {
      if (!basePath) return;
      try {
        const snapshot = await getDocs(basePath);
        const all = snapshot.docs.map(doc => doc.data());
        setRecords(all);
      } catch (error) {
        console.error('Error fetching user records:', error);
        setRecords([]);
      }
    };

    fetchRecords();
  }, [basePath]);

  const updateTraitData = (newData) => {
    setTraitData(prev => ({ ...prev, ...newData }));
  };

  const updateResults = (newResults) => {
    setResults(newResults);
  };

  const saveRecord = async (payload = null, imageFile = null) => {
    try {
      console.log('🔄 Preparing to save record...');

      let imageUrl = '';

      if (imageFile) {
        console.log('📸 Processing image...');
        const compressedImage = await compressImage(imageFile);
        const imageName = `${Date.now()}_${imageFile.name}`;
        const imageRef = ref(storage, `bird-images/${imageName}`);

        await uploadBytes(imageRef, compressedImage);
        imageUrl = await getDownloadURL(imageRef);
        console.log('✅ Image uploaded successfully');
      }

      // If a payload was provided, use its fields; else use context state
      const data = payload ?? {
        id: traitData.id || `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: traitData.name,
        sex: traitData.sex,
        weight: traitData.weight,
        dateOfBirth: traitData.dateOfBirth,
        status: traitData.status,
        otherStatus: traitData.otherStatus,
        otherCategory: traitData.otherCategory,
        projectId: traitData.projectId,
        traits: traitData.traits,
        ct: results.ct,
        pt: results.pt,
        cv: results.cv,
        warnings: results.warnings,
      };

      const record = {
        ...data,
        imageUrl,
        timestamp: new Date().toISOString()
      };

      if (!basePath) {
        throw new Error('User must be authenticated to save records');
      }
      await setDoc(doc(basePath, record.id), record);

      // Update local records
      setRecords(prev => {
        const filtered = prev.filter(r => r.id !== record.id);
        return [...filtered, record];
      });

      console.log('✅ Record saved successfully');
      return record;
    } catch (error) {
      console.error('❌ saveRecord failed:', error);
      alert(`Saving failed: ${error.message}`);
      throw error;
    }
  };

  const loadRecord = (record) => {
    setTraitData({
      id: record.id,
      name: record.name,
      sex: record.sex,
      weight: record.weight,
      dateOfBirth: record.dateOfBirth || '',
      status: record.status || 'Active',
      otherStatus: record.otherStatus || '',
      otherCategory: record.otherCategory || 'active',
      projectId: record.projectId || '',
      traits: record.traits
    });
    setResults({
      ct: record.ct,
      pt: record.pt,
      cv: record.cv,
      warnings: record.warnings
    });
  };

  const deleteRecord = async (id) => {
    if (!basePath) {
      throw new Error('User must be authenticated to delete records');
    }
    await deleteDoc(doc(basePath, id));
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const updateRecordPhoto = async (recordId, imageFile) => {
    try {
      console.log('🔄 Uploading new photo for record:', recordId);

      // Compress and upload image
      const compressedFile = await compressImage(imageFile, 800, 600, 0.8);
      const imageRef = ref(storage, `bird-images/${Date.now()}_${compressedFile.name}`);
      const snapshot = await uploadBytes(imageRef, compressedFile);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // Find the record and update it
      const record = records.find(r => r.id === recordId);
      if (!record) throw new Error('Record not found');

      // Delete old image if it exists and isn't the default
      if (record.imageUrl && !record.imageUrl.includes('/assets/ss.png')) {
        try {
          const oldImageRef = ref(storage, record.imageUrl);
          await deleteObject(oldImageRef);
        } catch (deleteError) {
          console.warn('Could not delete old image:', deleteError);
        }
      }

      // Update record with new image URL
      const updatedRecord = { ...record, imageUrl };
      if (!basePath) {
        throw new Error('User must be authenticated to update records');
      }
      await setDoc(doc(basePath, recordId), updatedRecord);

      // Update local state
      setRecords(prev => prev.map(r => r.id === recordId ? updatedRecord : r));

      console.log('✅ Photo updated successfully');
      return updatedRecord;
    } catch (error) {
      console.error('❌ Failed to update photo:', error);
      throw error;
    }
  };

  const clearTraitData = () => {
    setTraitData({
      id: null,
      name: '',
      sex: '',
      weight: 0,
      dateOfBirth: '',
      status: 'Active',
      otherStatus: '',
      otherCategory: 'active',
      projectId: '',
      traits: {}
    });
    setResults({
      ct: '',
      pt: '',
      cv: '',
      warnings: []
    });
  };

  return (
    <TraitContext.Provider value={{
      user,
      authLoading,
      traitData,
      results,
      records,
      updateTraitData,
      updateResults,
      saveRecord,
      loadRecord,
      deleteRecord,
      clearTraitData,
      updateRecordPhoto
    }}>
      {children}
    </TraitContext.Provider>
  );
};