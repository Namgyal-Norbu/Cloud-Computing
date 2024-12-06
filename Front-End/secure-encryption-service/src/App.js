import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PurposePage from './components/PurposePage';
import StoredFilesPage from './components/StoredFilesPage';
import DashboardPage from './components/DashboardPage';
import HomePage from './components/HomePage';
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
    try {
      const res = await fetch('http://localhost:5000/encrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Router>
      <div>
        {/* Navbar */}
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/purpose">Purpose</Link>
            </li>
            <li>
              <Link to="/stored-files">Stored Files</Link>
            </li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                isLoggedIn={isLoggedIn}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
                handleUpload={handleUpload}
                handleEncrypt={handleEncrypt}
                files={files}
                response={response}
              />
            }
          />
          <Route path="/purpose" element={<PurposePage />} />
          <Route path="/stored-files" element={<StoredFilesPage files={files} />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
