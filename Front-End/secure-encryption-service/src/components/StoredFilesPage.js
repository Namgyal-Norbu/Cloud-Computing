import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firestore instance

const StoredFilesPage = ({ userEmail }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch files from Firestore for the logged-in user
  const fetchFiles = async () => {
    try {
      const q = query(collection(db, 'uploads'), where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);

      const fetchedFiles = [];
      querySnapshot.forEach((doc) => {
        fetchedFiles.push({ id: doc.id, ...doc.data() });
      });

      setFiles(fetchedFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
      alert('Failed to fetch files from Firestore.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchFiles();
    }
  }, [userEmail]);

  return (
    <div className="stored-files-page">
      <h2>Your Stored Files</h2>
      {loading ? (
        <p>Loading your files...</p>
      ) : files.length > 0 ? (
        <ul>
          {files.map((file) => (
            <li key={file.id}>
              <a href={file.url} download={file.filename} className="download-link">
                {file.filename}
              </a>
              <p>
                <strong>Uploaded At:</strong> {new Date(file.uploadTimestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No files found for your account. Upload one to get started!</p>
      )}
    </div>
  );
};

export default StoredFilesPage;
