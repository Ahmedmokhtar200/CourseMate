// src/pages/HomePage.jsx
import React, { useState, useCallback, useEffect } from 'react';
import CourseCard from '../components/Course/CourseCard';
import { fetchCourses } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Alert from '../components/UI/Alert';
import { SearchIcon, ClearIcon, NoCoursesIcon } from '../components/Icons';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  // Fetch courses for the current page
  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const coursesData = await fetchCourses(currentPage, searchTerm);
        setDisplayedCourses(coursesData.results.courses);
        setPagination({
          count: coursesData.count,
          next: coursesData.next,
          previous: coursesData.previous,
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch courses.');
        setDisplayedCourses([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadCourses();
  }, [currentPage, searchTerm]);

  // Handle search logic
  const handleSearch = useCallback(() => {
    setCurrentPage(1); // Reset to page 1 on new search
    // Search is already included in fetchCourses via searchTerm
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1); // Reset to page 1
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle pagination navigation
  const handleNextPage = () => {
    if (pagination.next) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.previous) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (isLoading && displayedCourses.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white">
      <div className="mb-8 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow border border-gray-200">
        <label htmlFor="course-search" className="block text-lg font-medium text-gray-800 mb-2">
          Find Your Next Course
        </label>
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="course-search"
            type="search"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Search by title, category, or keyword..."
            className="block w-full pl-10 pr-20 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            aria-label="Search Courses"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-10 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <ClearIcon className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={handleSearch}
            className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-indigo-600 hover:text-indigo-800 rounded-r-md border-l border-gray-300 bg-gray-50 hover:bg-gray-100"
            aria-label="Submit search"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {error && <Alert message={error} type="error" onClose={() => setError(null)} />}

      <h2 className="text-2xl font-semibold text-gray-800 mb-6 px-1">Featured Courses</h2>
      {isLoading && displayedCourses.length === 0 && <LoadingSpinner />}
      {!isLoading && displayedCourses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              onClick={handlePreviousPage}
              disabled={!pagination.previous}
              className={`p-2 rounded-md ${
                pagination.previous
                  ? 'text-indigo-600 hover:bg-indigo-100'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Previous page"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {Math.ceil(pagination.count / 10)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={!pagination.next}
              className={`p-2 rounded-md ${
                pagination.next ? 'text-indigo-600 hover:bg-indigo-100' : 'text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Next page"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        !isLoading && (
          <div className="text-center py-10 px-4 bg-white rounded-lg shadow border border-gray-200">
            <NoCoursesIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No Courses Found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No courses matched your search criteria.' : 'No courses available at the moment.'}
            </p>
          </div>
        )
      )}
    </div>
  );
}

export default HomePage;