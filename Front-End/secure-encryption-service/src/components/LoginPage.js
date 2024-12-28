import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const LoginPage = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const CLIENT_ID = "1008769288778-aqgtegvr1v0go0vkv1kv34o47pe9n3h0.apps.googleusercontent.com"; 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      handleLogin();
      alert(`Logged in as: ${email}`);
    } else {
      alert('Please enter your email and password.');
    }
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    console.log('Google Login Success:', credentialResponse);
    // Send the credential to your backend to verify and authenticate the user
    alert('Logged in with Google!');
    handleLogin();
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google Login Failure:', error);
    alert('Google login failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="login-page">
        <h2>Login to CryptoCloud</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
          />
        </div>

        <p className="signup-link">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
