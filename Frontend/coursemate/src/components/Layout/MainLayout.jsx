// src/components/Layout/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import LoadingSpinner from '../UI/LoadingSpinner';

const MainLayout = ({ children, auth, location }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change (for mobile)
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (auth.isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      {auth.isLoggedIn && auth.currentUser && (
        <Sidebar
          user={auth.currentUser}
          onLogout={auth.logout}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
      )}

      {/* Backdrop for mobile when sidebar is open */}
      {auth.isLoggedIn && isSidebarOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main Content Container */}
      <div
        className={`flex-1 flex flex-col transition-transform duration-300 ease-in-out bg-white z-20 relative lg:ml-0 ${
          isSidebarOpen && window.innerWidth < 1024 ? 'translate-x-0' : 'translate-x-0'
        } ${auth.isLoggedIn && window.innerWidth >= 1024 ? 'lg:ml-64' : 'lg:ml-0'}`}
      >
        {/* Mobile Header */}
        {auth.isLoggedIn && (
          <header className="bg-white shadow-sm p-3 flex justify-between items-center sticky top-0 z-20 border-b border-gray-200 lg:hidden">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isSidebarOpen}
              aria-controls="main-sidebar"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <span className="text-lg font-semibold text-indigo-700">CourseMate</span>
            <div className="w-8"></div>
          </header>
        )}

        {/* Main Content Area */}
        <main className="flex-grow overflow-y-auto bg-white">
          {children}
        </main>

        
      </div>
    </div>
  );
};

export default MainLayout;