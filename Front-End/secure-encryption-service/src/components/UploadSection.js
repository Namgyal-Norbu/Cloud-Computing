import React, { useState } from 'react';

const UploadSection = ({ userEmail }) => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [decryptFile, setDecryptFile] = useState(null);
  const [decryptPassword, setDecryptPassword] = useState('');
  const [decryptMessage, setDecryptMessage] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);

  // Handle Encryption Submission
  const handleEncryptSubmit = async (e) => {
    e.preventDefault();

    if (!userEmail) {
      setMessage('User email is required for file upload.');
      return;
    }

    if (!file || !password) {
      setMessage('Please select a file and provide a password.');
      return;
    }

    setIsUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', userEmail);
      formData.append('password', password);

      const response = await fetch('http://localhost:5001/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed.');
      }

      const result = await response.json();
      if (result.success) {
        setMessage(`Upload successful! File ID: ${result.metadata.id}`);
      } else {
        setMessage('Failed to upload file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('An error occurred during file upload.');
    } finally {
      setIsUploading(false);
      setFile(null);
      setPassword('');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // Handle Decryption Submission
  const handleDecryptSubmit = async (e) => {
    e.preventDefault();

    if (!decryptFile || !decryptPassword) {
      setDecryptMessage('Please select a file and provide a decryption password.');
      return;
    }

    setIsDecrypting(true);
    setDecryptMessage('');

    try {
      const formData = new FormData();
      formData.append('file', decryptFile);
      formData.append('password', decryptPassword);

      const response = await fetch('http://localhost:5001/decrypt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File decryption failed.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'decrypted_file';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      setDecryptMessage('File decrypted and downloaded successfully!');
    } catch (error) {
      console.error('Error decrypting file:', error);
      setDecryptMessage('An error occurred during file decryption.');
    } finally {
      setIsDecrypting(false);
      setDecryptFile(null);
      setDecryptPassword('');
    }
  };

  const handleDecryptFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setDecryptFile(selectedFile);
  };

  return (
    <section className="upload-section">
      {/* Encryption Section */}
      <h2>Upload & Encrypt File</h2>
      <form onSubmit={handleEncryptSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="file-input" className="custom-file-label">
            {file ? file.name : 'Choose File'}
          </label>
          <input
            type="file"
            id="file-input"
            className="file-input"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password-input">Encryption Password:</label>
          <input
            type="password"
            id="password-input"
            className="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Set encryption password"
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Encrypt & Upload'}
        </button>
      </form>
      {message && <p className="upload-message">{message}</p>}

      <hr />

      {/* Decryption Section */}
      <h2>Decrypt File</h2>
      <form onSubmit={handleDecryptSubmit} className="decrypt-form">
        <div className="form-group">
          <label htmlFor="decrypt-file-input" className="custom-file-label">
            {decryptFile ? decryptFile.name : 'Choose Encrypted File'}
          </label>
          <input
            type="file"
            id="decrypt-file-input"
            className="file-input"
            onChange={handleDecryptFileChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="decrypt-password-input">Decryption Password:</label>
          <input
            type="password"
            id="decrypt-password-input"
            className="password-input"
            value={decryptPassword}
            onChange={(e) => setDecryptPassword(e.target.value)}
            placeholder="Enter decryption password"
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={isDecrypting}>
          {isDecrypting ? 'Decrypting...' : 'Decrypt & Download'}
        </button>
      </form>
      {decryptMessage && <p className="decrypt-message">{decryptMessage}</p>}
    </section>
  );
};

export default UploadSection;