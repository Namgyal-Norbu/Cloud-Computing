import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import PurposePage from './components/PurposePage';
import DashboardPage from './components/DashboardPage';
import HomePage from './components/HomePage';
import StoredFilesPage from './components/StoredFilesPage';
import Footer from './components/Footer';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [files, setFiles] = useState([]);
  const [encryptedText, setEncryptedText] = useState('');

  const CLIENT_ID = "1008769288778-aqgtegvr1v0go0vkv1kv34o47pe9n3h0.apps.googleusercontent.com";

  // Check for persistent login and files
  useEffect(() => {
    const storedLogin = JSON.parse(localStorage.getItem('isLoggedIn'));
    const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
    const storedFiles = JSON.parse(localStorage.getItem('files')) || [];
    if (storedLogin && storedProfile) {
      setIsLoggedIn(storedLogin);
      setUserProfile(storedProfile);
      setFiles(storedFiles);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    localStorage.setItem('files', JSON.stringify(files));
  }, [isLoggedIn, userProfile, files]);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      // Fetch user data from Google's tokeninfo endpoint
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
      );
      const userData = await response.json();

      // Log the API response to verify its content
      console.log('Google OAuth API Response:', userData);

      // Update the user profile
      setUserProfile({
        email: userData.email,
        name: userData.name,
        picture: userData.picture, // Profile picture URL
      });

      setIsLoggedIn(true);
      alert(`Logged in successfully as ${userData.name}`);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      alert('Google login failed. Please try again.');
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google Login Failure:', error);
    alert('Google login failed. Please try again.');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null); // Clear user profile state
    setFiles([]); // Clear files
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('files');
    alert('Logged out successfully!');
  };

  const handleEncryptText = async (text) => {
    if (!text) {
      alert('Please enter text to encrypt.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/encrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setEncryptedText(data.encryptedText); // Assuming the backend returns { encryptedText: "..." }
      alert('Text encrypted successfully!');
    } catch (error) {
      console.error('Error encrypting text:', error);
      alert('Failed to encrypt text. Please try again.');
    }
  };

  const handleUpload = (file, password) => {
    const newFile = {
      name: file.name,
      url: URL.createObjectURL(file), // Generate a downloadable URL
    };
    setFiles((prevFiles) => [...prevFiles, newFile]);
    alert(`File "${file.name}" encrypted with password "${password}" and uploaded successfully.`);
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <div>
          {/* Navbar */}
          <nav className="navbar">
            <ul className="navbar-list">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/purpose">Purpose</Link>
              </li>
              {isLoggedIn && (
                <>
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/stored-files">Stored Files</Link>
                  </li>
                </>
              )}
            </ul>
            <div className="navbar-right">
  {isLoggedIn ? (
    <>
      {userProfile?.picture && (
        <img
          src={userProfile.picture}
          alt={`${userProfile.name}'s Profile`}
          className="profile-picture"
        />
      )}
      <Link to="/" onClick={handleLogout} className="logout-button">
        Logout
      </Link>
    </>
  ) : (
    <GoogleLogin
      onSuccess={handleGoogleLoginSuccess}
      onError={handleGoogleLoginFailure}
      text="signin_with"
      className="google-login-button"
    />
  )}
</div>

          </nav>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/dashboard"
              element={
                isLoggedIn ? (
                  <DashboardPage
                    handleUpload={handleUpload}
                    handleEncryptText={handleEncryptText}
                    encryptedText={encryptedText}
                    files={files}
                  />
                ) : (
                  <div>
                    <p>Please log in to access the dashboard.</p>
                  </div>
                )
              }
            />
            <Route
              path="/stored-files"
              element={
                isLoggedIn ? (
                  <StoredFilesPage files={files} />
                ) : (
                  <div>
                    <p>Please log in to view stored files.</p>
                  </div>
                )
              }
            />
            <Route path="/purpose" element={<PurposePage />} />
          </Routes>

          <Footer />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
