import React, { useState } from 'react';

const UploadSection = ({ userEmail }) => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
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
      console.log('Upload result:', result);

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

  return (
    <section className="upload-section">
      <h2>Upload & Encrypt File</h2>
      <form onSubmit={handleSubmit} className="upload-form">
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
        <button
          type="submit"
          className="submit-button"
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Encrypt & Upload'}
        </button>
      </form>
      {message && <p className="upload-message">{message}</p>}
    </section>
  );
};

export default UploadSection;