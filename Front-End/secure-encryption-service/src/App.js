import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import PurposePage from './components/PurposePage';
import StoredFilesPage from './components/StoredFilesPage';
import DashboardPage from './components/DashboardPage';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [files, setFiles] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // Store user profile, including picture
  const [response, setResponse] = useState(null);

  const CLIENT_ID = "1008769288778-aqgtegvr1v0go0vkv1kv34o47pe9n3h0.apps.googleusercontent.com"; // Replace with your actual Google OAuth client ID

  // Check for persistent login
  useEffect(() => {
    const storedLogin = JSON.parse(localStorage.getItem('isLoggedIn'));
    const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (storedLogin && storedProfile) {
      setIsLoggedIn(storedLogin);
      setUserProfile(storedProfile);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [isLoggedIn, userProfile]);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
      );
      const userData = await response.json();
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
    setFiles([]);
    setUserProfile(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userProfile');
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
                  <img
                    src={userProfile?.picture}
                    alt="User Profile"
                    className="profile-picture"
                  />
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
                    handleEncrypt={handleEncrypt}
                    files={files}
                    response={response}
                  />
                ) : (
                  <div>
                    <p>Please log in to access the dashboard.</p>
                    <GoogleLogin
                      onSuccess={handleGoogleLoginSuccess}
                      onError={handleGoogleLoginFailure}
                      text="signin_with"
                      className="google-login-button"
                    />
                  </div>
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
                  <div>
                    <p>Please log in to view stored files.</p>
                    <GoogleLogin
                      onSuccess={handleGoogleLoginSuccess}
                      onError={handleGoogleLoginFailure}
                      text="signin_with"
                      className="google-login-button"
                    />
                  </div>
                )
              }
            />
          </Routes>

          <Footer />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
