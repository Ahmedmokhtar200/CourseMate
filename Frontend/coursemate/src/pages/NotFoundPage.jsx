
// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
      <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        Oops! The page you're looking for doesn't seem to exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
      >
        Go to Homepage
      </Link>
    </div>
  );
}
export default NotFoundPage;
