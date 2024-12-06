import React, { useState } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import FileManagement from './components/FileManagement';
import CryptoTest from './components/CryptoText';
import Footer from './components/Footer';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [files, setFiles] = useState([]);
  const [response, setResponse] = useState(null);

  const handleLogin = () => {
    alert('Google Sign-In to be implemented');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    alert('Google Sign-Out to be implemented');
    setIsLoggedIn(false);
  };

  const handleUpload = (file, password) => {
    alert(`File ${file.name} encrypted with password ${password}`);
    setFiles([...files, { name: file.name }]);
  };

  const handleEncrypt = async (inputText) => {
    try{
      const res = await fetch ('http://localhost:5000/encrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({text: inputText}),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error){
      console.error('Error:', error);
    }
  }

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} handleLogin={handleLogin} handleLogout={handleLogout} />
      {isLoggedIn ? (
        <>
          <UploadSection onUpload={handleUpload} />
          <FileManagement files={files} />
          <CryptoTest onEncrypt={handleEncrypt} />
          {response && (
            <div style={{marginTop: '20px'}}>
              <h3>Encrypted Data</h3>
              <p><strong>Encrypted Text:</strong> {response.encrypted}</p>
              <p><strong>Key:</strong> {response.key}</p>
              <p><strong>IV:</strong> {response.iv}</p>
            </div>
          )}
        </>
      ) : (
        <p>Please log in to upload and manage files.</p>
      )}
      <Footer />
    </div>
  );
}

export default App;

