import React, { useState } from 'react';

const UploadSection = ({ onUpload, userEmail }) => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userEmail) {
      alert('User email is required for file upload.');
      return;
    }

    if (file && password) {
      onUpload(file, password, userEmail); // Pass file, password, and userEmail to parent
      setFile(null); // Clear the file input after submission
      setPassword(''); // Clear the password input after submission
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
