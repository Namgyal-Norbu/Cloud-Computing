
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
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
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleUpload = (file, password) => {
    // Simulate file encryption and upload
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
            {!isLoggedIn && (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/signup">Sign Up</Link>
                </li>
              </>
            )}
            {isLoggedIn && (
              <>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/stored-files">Stored Files</Link>
                </li>
                <li className="logout-container">
                  <Link to="/" onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="/purpose">Purpose</Link>
            </li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <DashboardPage
                  handleUpload={handleUpload}
                  handleEncrypt={handleEncrypt}
                  files={files}
                  response={response}
                />
              ) : (
                <p>Please log in to access the dashboard.</p>
              )
            }
          />
          <Route path="/purpose" element={<PurposePage />} />
          <Route
            path="/stored-files"
            element={
              isLoggedIn ? (
                <StoredFilesPage files={files} />
              ) : (
                <p>Please log in to view stored files.</p>
              )
            }
          />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
