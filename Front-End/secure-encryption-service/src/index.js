import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = '137566307653-bg4rhf116kn6prqrpcqphebef6v40hn2.apps.googleusercontent.com';

ReactDOM.render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>,
  document.getElementById('root')
);
