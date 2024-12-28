import React, { useState } from 'react';

const SignUpPage = ({ handleSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
    } else {
      handleSignUp(email, password); // Simulate sign-up action
      alert(`Account created for: ${email}`);
    }
  };

  return (
    <div className="signup-page">
      <h2>Create Your CryptoCloud Account</h2>
      <form onSubmit={handleSubmit} className="signup-form">
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
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>
        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>
      <p className="login-link">
        Already have an account? <a href="/login">Log In</a>
      </p>
    </div>
  );
};

export default SignUpPage;