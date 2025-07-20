import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { EnquiryProvider } from './context/EnquiryContext';
import { AuthProvider } from './context/AuthContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <EnquiryProvider>
        <App />
      </EnquiryProvider>
    </AuthProvider>
  </React.StrictMode>
);