import React from 'react';
import Header from './Header';
import UploadSection from './UploadSection';
import FileManagement from './FileManagement';
import CryptoTest from './CryptoText';

const DashboardPage = ({
  isLoggedIn,
  handleLogin,
  handleLogout,
  handleUpload,
  handleEncrypt,
  files,
  response,
}) => {
  return (
    <div className="dashboard-page">
      <Header isLoggedIn={isLoggedIn} handleLogin={handleLogin} handleLogout={handleLogout} />
      <h2>Welcome to Your Dashboard</h2>
      <p>Manage your files and access key features below:</p>

      {isLoggedIn ? (
        <>
          {/* Upload Section */}
          <UploadSection onUpload={handleUpload} />

          {/* File Management Section */}
          <FileManagement files={files} />

          {/* Crypto Test Section */}
          <CryptoTest onEncrypt={handleEncrypt} />

          {/* Display Encrypted Data */}
          {response && (
            <div style={{ marginTop: '20px' }}>
              <h3>Encrypted Data</h3>
              <p>
                <strong>Encrypted Text:</strong> {response.encrypted}
              </p>
              <p>
                <strong>Key:</strong> {response.key}
              </p>
              <p>
                <strong>IV:</strong> {response.iv}
              </p>
            </div>
          )}
        </>
      ) : (
        <p>Please log in to upload and manage files.</p>
      )}
    </div>
  );
};

export default DashboardPage;
