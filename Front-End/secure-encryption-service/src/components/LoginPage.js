import React, { useState } from 'react';

const LoginPage = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      // Call the login handler (e.g., API call or state update)
      handleLogin();
      alert(`Logged in as: ${email}`);
    } else {
      alert('Please enter your email and password.');
    }
  };

  return (
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
      <p className="signup-link">
        Don’t have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default LoginPage;
