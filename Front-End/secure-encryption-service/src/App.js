import React, { useState } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import FileManagement from './components/FileManagement';
import Footer from './components/Footer';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [files, setFiles] = useState([]);

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

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} handleLogin={handleLogin} handleLogout={handleLogout} />
      {isLoggedIn ? (
        <>
          <UploadSection onUpload={handleUpload} />
          <FileManagement files={files} />
        </>
      ) : (
        <p>Please log in to upload and manage files.</p>
      )}
      <Footer />
    </div>
  );
}

export default App;

