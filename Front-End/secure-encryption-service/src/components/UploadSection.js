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
    }
  };

  return (
    <section>
      <h2>Upload & Encrypt File</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Set encryption password"
          required
        />
        <button type="submit">Encrypt & Upload</button>
      </form>
    </section>
  );
};

export default UploadSection;
