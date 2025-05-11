
// src/pages/HomePage.jsx (Updated)
import React, { useState, useCallback, useEffect } from 'react';
import CourseCard from '../components/Course/CourseCard';
import { fetchCourses } from '../services/api'; // API call
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Alert from '../components/UI/Alert';
import { SearchIcon, ClearIcon, NoCoursesIcon } from '../components/Icons';

function HomePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [allCourses, setAllCourses] = useState([]); // Store all fetched courses
    const [displayedCourses, setDisplayedCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch initial courses
    useEffect(() => {
        const loadCourses = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const coursesData = await fetchCourses(); // Initial fetch without search term
                setAllCourses(coursesData.results.courses);
                setDisplayedCourses(coursesData.results.courses);
            } catch (err) {
                setError(err.message || "Failed to fetch courses.");
                setAllCourses([]); // Ensure it's an array on error
                setDisplayedCourses([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadCourses();
    }, []);

    // Handle search logic (client-side filtering for now)
    // For backend search, fetchCourses would take searchTerm
    const handleSearch = useCallback(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
        if (!lowerCaseSearchTerm) {
            setDisplayedCourses(allCourses);
        } else {
            // If backend search is implemented in fetchCourses:
            // const loadSearchedCourses = async () => {
            //   setIsLoading(true); setError(null);
            //   try {
            //     const coursesData = await fetchCourses(lowerCaseSearchTerm);
            //     setDisplayedCourses(coursesData);
            //   } catch (err) { setError(err.message); setDisplayedCourses([]); }
            //   finally { setIsLoading(false); }
            // };
            // loadSearchedCourses();

            // Client-side filtering:
            const results = allCourses.results.cou.filter(course =>
                course.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                (course.category && course.category.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (course.description && course.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (course.instructor && course.instructor.toLowerCase().includes(lowerCaseSearchTerm))
            );
            setDisplayedCourses(results);
        }
    }, [searchTerm, allCourses]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        setDisplayedCourses(allCourses); // Reset to all fetched courses
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    if (isLoading && allCourses.length === 0) { // Show loader only on initial load
        return <LoadingSpinner />;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-8 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow border border-gray-200">
                <label htmlFor="course-search" className="block text-lg font-medium text-gray-800 mb-2">Find Your Next Course</label>
                <div className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="course-search" type="search" value={searchTerm} onChange={handleInputChange}
                        onKeyPress={handleKeyPress} placeholder="Search by title, category, or keyword..."
                        className="block w-full pl-10 pr-20 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        aria-label="Search Courses"
                    />
                    {searchTerm && (
                        <button onClick={handleClearSearch} className="absolute inset-y-0 right-10 pr-3 flex items-center text-gray-400 hover:text-gray-600" aria-label="Clear search">
                            <ClearIcon className="h-5 w-5" />
                        </button>
                    )}
                     <button onClick={handleSearch} className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-indigo-600 hover:text-indigo-800 rounded-r-md border-l border-gray-300 bg-gray-50 hover:bg-gray-100" aria-label="Submit search">
                        <SearchIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {error && <Alert message={error} type="error" onClose={() => setError(null)} />}
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 px-1">Featured Courses</h2>
            {isLoading && displayedCourses.length === 0 && <LoadingSpinner />} {/* Loader for search results */}
            {!isLoading && displayedCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayedCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            ) : (
                !isLoading && <div className="text-center py-10 px-4 bg-white rounded-lg shadow border border-gray-200">
                    <NoCoursesIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No Courses Found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchTerm ? "No courses matched your search criteria." : "No courses available at the moment."}
                    </p>
                </div>
            )}
        </div>
    );
}
export default HomePage;