import React from 'react';

const Header = ({ isLoggedIn, handleLogin, handleLogout }) => {
  return (
    <header>
      <h1>Secure File Encryption Service</h1>
      <nav>
        {!isLoggedIn ? (
          <button onClick={handleLogin}>Login with Google</button>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </nav>
    </header>
  );
};

export default Header;
