import React, { useState, useEffect, useCallback } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore configuration
import UploadSection from './UploadSection';

const DashboardPage = ({ handleUpload, handleEncrypt, response, userProfile }) => {
  const [loading, setLoading] = useState(false);

  // Save file metadata to Firestore
  const saveFileMetadata = async (fileMetadata) => {
    try {
      const docRef = await addDoc(collection(db, 'uploads'), fileMetadata);
      console.log('File metadata saved with ID:', docRef.id);
    } catch (error) {
      console.error('Error saving file metadata to Firestore:', error);
      alert('Failed to save file metadata. Please try again.');
    }
  };

  // Handle file upload and save metadata
  const handleFileUpload = (file, password) => {
    const fileMetadata = {
      filename: file.name,
      encryptionPassword: password,
      uploadTimestamp: new Date(),
      email: userProfile.email, // Associate file with the logged-in user
    };
    saveFileMetadata(fileMetadata);
    handleUpload(file, password); // Call the original upload handler
  };

  return (
    <div className="dashboard-page">
      <h2>Welcome to Your Dashboard, {userProfile?.name || 'User'}!</h2>
      <p>Encrypt your sensitive data and securely store it in the cloud:</p>

      {/* Upload Section */}
      <UploadSection onUpload={handleFileUpload} userEmail={userProfile?.email} />
    </div>
  );
};

export default DashboardPage;
