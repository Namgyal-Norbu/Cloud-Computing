import React, { useEffect, useState } from 'react';

const StoredFilesPage = ({ userEmail }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`http://localhost:5001/fetch-files?email=${userEmail}`);
      const data = await response.json();
      if (data.success) {
        setFiles(data.files);
      } else {
        throw new Error(data.error || 'Failed to fetch files.');
      }
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Failed to fetch files.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filename) => {
    console.log('Downloading file:', filename); // Debugging log
    try {
      const response = await fetch(`http://localhost:5001/download-file?filename=${encodeURIComponent(filename)}`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to download file: ${errorText}`);
      }
  
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert(`Failed to download the file: ${error.message}`);
    }
  };
  
  

  useEffect(() => {
    if (userEmail) {
      fetchFiles();
    }
  }, [userEmail, fetchFiles]);

  if (loading) return <p>Loading your files...</p>;
  if (error) return <p className="error-message">{error}</p>;

  if (files.length === 0) {
    return <p>No files found for your account. Upload one to get started!</p>;
  }

  return (
    <div className="stored-files-page">
      <h2>Your Stored Files</h2>
      <ul className="file-list">
        {files.map((file) => (
          <li key={file.id} className="file-item">
            <p>
              <strong>File Name:</strong> {file.filename}
            </p>
            <p>
              <strong>Uploaded At:</strong>{' '}
              {(() => {
  if (file.uploadTimestamp) {
    if (file.uploadTimestamp.seconds) {
      // Firestore Timestamp
      return new Date(file.uploadTimestamp.seconds * 1000).toLocaleString();
    } else if (typeof file.uploadTimestamp === 'string' || file.uploadTimestamp instanceof Date) {
      // String or Date
      return new Date(file.uploadTimestamp).toLocaleString();
    }
  }
  return 'Unknown'; // Fallback if timestamp is invalid or undefined
})()}

            </p>
            <button onClick={() => handleDownload(file.filename)} className="download-button">
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoredFilesPage;
