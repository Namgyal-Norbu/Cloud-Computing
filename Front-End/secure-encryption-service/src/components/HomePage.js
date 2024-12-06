import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to CryptoCloud</h1>
      <p>Your secure solution for encrypting and managing files in the cloud.</p>

      <div className="home-actions">
        <Link to="/login" className="home-link">
          Login
        </Link>
        <Link to="/dashboard" className="home-link">
          Go to Dashboard
        </Link>
        <Link to="/purpose" className="home-link">
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
