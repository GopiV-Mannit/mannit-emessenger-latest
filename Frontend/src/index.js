import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './userContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
        <App />
    </UserProvider>
  </React.StrictMode>
);