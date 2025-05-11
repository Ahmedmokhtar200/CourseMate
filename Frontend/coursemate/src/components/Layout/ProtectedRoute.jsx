
// src/components/Layout/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// ProtectedRoute component checks if the user is logged in
// If not, it redirects to the login page, saving the intended destination
const ProtectedRoute = ({ isLoggedIn, children }) => {
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // Render the children (the protected page)
};

export default ProtectedRoute;
