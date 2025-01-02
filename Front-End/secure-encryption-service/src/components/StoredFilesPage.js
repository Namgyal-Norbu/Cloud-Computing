import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore instance

const StoredFilesPage = ({ userEmail }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFiles = async () => {
    try {
      const q = query(collection(db, 'uploads'), where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);

      const fetchedFiles = [];
      querySnapshot.forEach((doc) => {
        fetchedFiles.push({ id: doc.id, ...doc.data() });
      });

      setFiles(fetchedFiles);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Failed to fetch files from Firestore.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchFiles();
    }
  }, [userEmail]);

  if (loading) {
    return <p>Loading your files...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (files.length === 0) {
    return <p>No files found for your account. Upload one to get started!</p>;
  }

  return (
    <div className="stored-files-page">
      <h2>Your Stored Files</h2>
      <ul className="file-list">
        {files.map((file) => (
          <li key={file.id} className="file-item">
            <a
              href={file.url || '#'}
              download={file.filename || 'Unnamed File'}
              className="download-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {file.filename || 'Unnamed File'}
            </a>
            <p>
              <strong>Uploaded At:</strong>{' '}
              {file.uploadTimestamp
                ? new Date(file.uploadTimestamp.toDate()).toLocaleString()
                : 'Unknown'}
            </p>
            {file.encryptionKey && (
              <p>
                <strong>Encryption Key:</strong> {file.encryptionKey}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoredFilesPage;
