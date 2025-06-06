// src/pages/CourseDetailPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchCourseById, fetchRecommendedCourses } from '../services/api';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Alert from '../components/UI/Alert';
import CourseCard from '../components/Course/CourseCard';
import { BackArrowIcon } from '../components/Icons';

function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourse = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [courseData, recommendedData] = await Promise.all([
          fetchCourseById(courseId),
          fetchRecommendedCourses(courseId),
        ]);
        setCourse(courseData);
        setRecommendedCourses(recommendedData);
      } catch (err) {
        setError(err.message || `Failed to fetch course (ID: ${courseId}).`);
        if (err.status === 404) {
          setError(`Course with ID ${courseId} not found.`);
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const handleEnroll = useCallback(() => {
    if (course && course.url) {
      window.location.href = course.url;
    }
  }, [course]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Alert message={error} type="error" />
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center text-gray-600 bg-white shadow-lg rounded-lg mt-6 max-w-4xl mx-auto">
        <p className="mt-4">Course not found.</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-12 max-w-5xl mx-auto bg-white shadow-xl rounded-lg mt-6 mb-12 border border-gray-200">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
        aria-label="Back to previous page"
      >
        <BackArrowIcon className="h-5 w-5 mr-1" />
        Back
      </button>
      <div className="md:flex md:space-x-8">
        <div className="md:w-1/3 mb-6 md:mb-0 flex-shrink-0">
          <img
            src={
              "https://media.canva.com/v2/image-resize/format:JPG/height:452/quality:92/uri:ifs%3A%2F%2FM%2F1be0603b-7fee-4564-a028-d6757b986d4c/watermark:F/width:800?csig=AAAAAAAAAAAAAAAAAAAAAOd9MchUpDklyYL6-terL-VBJyGG1VZdsEzmABmnk85v&exp=1746920390&osig=AAAAAAAAAAAAAAAAAAAAAHjc50Dcuyd740fTmuZKJ_w_dGNrAFDnmQ3pY31q-XJF&signer=media-rpc&x-canva-quality=screen" ||
              `https://placehold.co/800x400/cccccc/ffffff?text=${encodeURIComponent(course.title)}`
            }
            alt={`${course.title} course image`}
            className="w-full h-auto rounded-lg shadow-md object-cover border border-gray-200 mb-6"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/800x400/cccccc/ffffff?text=Image+Error';
            }}
          />
          <div className="space-y-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-md border">
            <p>
              <strong className="font-medium text-gray-800">Instructor:</strong>{' '}
              {course.university || course.instructor || 'N/A'}
            </p>
            <p>
              <strong className="font-medium text-gray-800">Difficulty Level:</strong>{' '}
              {course.difficultyLevel || 'N/A'}
            </p>
            <p>
              <strong className="font-medium text-gray-800">Rating:</strong>{' '}
              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">
                {course.rating || course.category || 'General'}
              </span>
            </p>
            <p className="text-2xl font-bold text-indigo-600 pt-2 border-t mt-3">
              {course.price ? `$${Number(course.price).toFixed(2)}` : 'Free'}
            </p>
          </div>
          <div className="mt-6">
            <Button onClick={handleEnroll} variant="primary" className="w-full text-lg py-3">
              View Course
            </Button>
          </div>
        </div>
        <div className="md:w-2/3">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {course.name || course.title || 'Course Title'}
          </h1>
          <p className="text-lg text-gray-700 mb-6">{course.skills || 'No short description available.'}</p>
          <div className="prose prose-indigo max-w-none text-gray-800">
            <h2 className="text-xl font-semibold mb-2">Course Details</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: course.description || course.detailedDescription || '<p>No detailed description available.</p>',
              }}
            />
          </div>
        </div>
      </div>

      {/* Recommended Courses Section */}
      {recommendedCourses.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recommended Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendedCourses.map((recCourse) => (
              <CourseCard key={recCourse.id} course={recCourse} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetailPage;