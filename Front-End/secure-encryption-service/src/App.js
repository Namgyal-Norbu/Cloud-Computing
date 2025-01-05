import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import PurposePage from './components/PurposePage';
import DashboardPage from './components/DashboardPage';
import HomePage from './components/HomePage';
import StoredFilesPage from './components/StoredFilesPage';
import UploadSection from './components/UploadSection'; // Import UploadSection
import Footer from './components/Footer';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [files, setFiles] = useState([]);

  const CLIENT_ID = '137566307653-bg4rhf116kn6prqrpcqphebef6v40hn2.apps.googleusercontent.com';

  // Persistent login and fetching user files
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

  // Google Login Success Handler
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
      const userData = await response.json();

      setUserProfile({
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
      });

      setIsLoggedIn(true);
      alert(`Logged in successfully as ${userData.name}`);
    } catch (error) {
      console.error('Google Login Error:', error);
      alert('Google login failed. Please try again.');
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google Login Failure:', error);
    alert('Google login failed. Please try again.');
  };

  // Logout Handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    setFiles([]);
    localStorage.clear();
    alert('Logged out successfully!');
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <div>
          {/* Navbar */}
          <nav className="navbar">
            <ul className="navbar-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/purpose">Purpose</Link></li>
              {isLoggedIn && (
                <>
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li><Link to="/stored-files">Stored Files</Link></li>
                 
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
                  <DashboardPage userProfile={userProfile} />
                ) : (
                  <p>Please log in to access the dashboard.</p>
                )
              }
            />
            <Route
              path="/stored-files"
              element={
                isLoggedIn ? (
                  <StoredFilesPage userEmail={userProfile?.email} />
                ) : (
                  <p>Please log in to view stored files.</p>
                )
              }
            />
            <Route
              path="/upload"
              element={
                isLoggedIn ? (
                  <UploadSection userEmail={userProfile?.email} />
                ) : (
                  <p>Please log in to upload files.</p>
                )
              }
            /> {/* Add Upload Section Route */}
            <Route path="/purpose" element={<PurposePage />} />
          </Routes>

          <Footer />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;