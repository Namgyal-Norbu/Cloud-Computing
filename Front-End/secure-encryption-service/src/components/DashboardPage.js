import React, { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore configuration
import UploadSection from './UploadSection';
import FileManagement from './FileManagement';

const DashboardPage = ({ handleUpload, handleEncrypt, response, userProfile }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Wrap fetchFiles in useCallback
  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'uploads'));
      const fetchedFiles = [];
      querySnapshot.forEach((doc) => {
        const fileData = doc.data();
        if (fileData.email === userProfile.email) {
          fetchedFiles.push({ id: doc.id, ...fileData });
        }
      });
      setFiles(fetchedFiles);
    } catch (error) {
      console.error('Error fetching files from Firestore:', error);
      alert('Failed to fetch your files. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [userProfile.email]); // Add dependency

  // Save file metadata to Firestore
  const saveFileMetadata = async (fileMetadata) => {
    try {
      const docRef = await addDoc(collection(db, 'uploads'), fileMetadata);
      console.log('File metadata saved with ID:', docRef.id);
      fetchFiles(); // Refresh the file list after saving
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

  // Fetch files on component mount
  useEffect(() => {
    if (userProfile?.email) {
      fetchFiles();
    }
  }, [userProfile, fetchFiles]); // Add fetchFiles to dependencies

  return (
    <div className="dashboard-page">
      <h2>Welcome to Your Dashboard, {userProfile?.name || 'User'}!</h2>
      <p>Manage your files and encrypt your sensitive data below:</p>

      {/* Upload Section */}
      <UploadSection onUpload={handleFileUpload} userEmail={userProfile?.email} />

      {/* Loading Indicator */}
      {loading && <p>Loading your files...</p>}

      {/* File Management Section */}
      {files.length > 0 ? (
        <FileManagement files={files} />
      ) : (
        !loading && <p>No files found for your account. Upload one to get started!</p>
      )}

    </div>
  );
};

export default DashboardPage;
