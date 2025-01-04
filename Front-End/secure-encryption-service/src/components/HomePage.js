import React from 'react';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>CryptoCloud Guide</h1>
      <p>
        CryptoCloud is a secure platform where users can upload their files to encrypt and store them safely in the cloud. This ensures your sensitive data remains protected while being easily accessible whenever you need it. Follow the steps below to start using CryptoCloud.
      </p>

      <div className="home-guide">
        <h2>How to Use CryptoCloud</h2>
        <ol>
          <li>Register or log in to your CryptoCloud account.</li>
          <li>Navigate to the Dashboard after logging in.</li>
          <li>Click on the "Upload & Encrypt" option to upload your files.</li>
          <li>Set a strong password for encryption during the upload process.</li>
          <li>Once uploaded, your encrypted files will be stored securely in the cloud.</li>
          <li>To view or download your files, go to the "File Management" section on the Dashboard.</li>
          <li>Enjoy the peace of mind knowing your data is encrypted and secure!</li>
        </ol>
      </div>
    </div>
  );
};

export default HomePage;
