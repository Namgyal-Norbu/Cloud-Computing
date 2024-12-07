import React, { useState } from 'react';

const UploadSection = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file && password) {
      onUpload(file, password);
      setFile(null);
      setPassword('');
      alert(`File "${file.name}" has been encrypted and uploaded.`);
    } else {
      alert('Please select a file and provide a password.');
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
        <button type="submit" className="submit-button">
          Encrypt & Upload
        </button>
      </form>
    </section>
  );
};

export default UploadSection;
