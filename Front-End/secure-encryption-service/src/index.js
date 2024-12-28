import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = '1008769288778-aqgtegvr1v0go0vkv1kv34o47pe9n3h0.apps.googleusercontent.com';

ReactDOM.render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>,
  document.getElementById('root')
);
