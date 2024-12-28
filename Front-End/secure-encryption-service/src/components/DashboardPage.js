import React from 'react';
import UploadSection from './UploadSection';
import FileManagement from './FileManagement';
import CryptoTest from './CryptoText';

const DashboardPage = ({
  handleUpload,
  handleEncrypt,
  files,
  response,
}) => {
  return (
    <div className="dashboard-page">
      <h2>Welcome to Your Dashboard</h2>
      <p>Manage your files and encrypt your sensitive data below:</p>

      {/* Upload Section */}
      <UploadSection onUpload={handleUpload} />

      {/* File Management Section */}
      {files && files.length > 0 && (
        <FileManagement files={files} />
      )}

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
    </div>
  );
};

export default DashboardPage;

