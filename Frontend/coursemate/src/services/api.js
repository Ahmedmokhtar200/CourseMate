// src/services/api.js


const BASE_URL = import.meta.env.VITE_BACKEND_URL; // Your backend API base URL

// Helper function to get the auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function for making API requests
const request = async (endpoint, method = 'GET', body = null, requiresAuth = true) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    } else if (requiresAuth) {
      // Handle cases where auth is required but no token is found
      // This might involve redirecting to login or simply letting the request fail
      console.warn('Auth token not found for a protected route:', endpoint);
      // Depending on your app's logic, you might throw an error here
      // or allow the request to proceed (backend will likely reject it)
    }
  }

  const config = {
    method: method,
    headers: headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      // Try to parse error response from backend
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON, use status text
        errorData = { message: response.statusText };
      }
      // Construct a more informative error
      const error = new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.data = errorData; // Attach full error data
      throw error;
    }

    // If response is 204 No Content, return null or an empty object
    if (response.status === 204) {
        return null;
    }

    return await response.json(); // Assuming backend always returns JSON
  } catch (error) {
    console.error('API call failed:', error);
    throw error; // Re-throw the error to be caught by the calling function
  }
};

// --- Authentication API Calls ---
export const  loginUser = (credentials) => {
  // credentials: { email, password }
  return request('/auth/login/', 'POST', credentials, false); // Login doesn't require prior auth
};

export const signupUser = (userData) => {
  // userData: { name, email, password }
  return request('/auth/register/', 'POST', userData, false); // Signup doesn't require prior auth
};

export const fetchAuthenticatedUser = () => {
  // Fetches user data if a token is present
  const token = getAuthToken();
  if (!token) return Promise.resolve(null); // No token, no user
  return request('/auth/profile/', 'GET', null, true);
};

export const logoutUser = () => {
    // Inform the backend about logout if necessary
    // This might invalidate the token on the server side
    // For simplicity, we'll assume the backend has a logout endpoint.
    // If not, just clearing the token locally is the main step.
    return request('/auth/logout/', 'POST', null, true)
      .catch(error => {
        // Even if backend logout fails, proceed to clear local token
        console.warn('Backend logout failed or no endpoint, clearing token locally.', error);
      })
      .finally(() => {
        localStorage.removeItem('authToken');
      });
};


// --- Course API Calls ---
// src/services/api.js
export const fetchCourses = async (page = 1, searchTerm = '') => {
    const url = `/courses/?page=${page}${searchTerm ? `&search=${searchTerm}` : ''}`;
    return request(url, 'GET', null, false);
};


export const fetchCourseById = (courseId) => {
  return request(`/courses/${courseId}/`, 'GET', null, false); // Fetching course details might not require auth
};

// --- User History/Data API Calls (Example - adjust to your backend) ---
// Assuming these are part of the user object fetched by fetchAuthenticatedUser
// or require separate endpoints.
// export const fetchUserViewHistory = () => request('/auth/user/history/', 'GET');
// export const fetchUserRatings = () => request('/auth/user/ratings/', 'GET');
// export const fetchUserReviews = () => request('/auth/user/reviews/', 'GET');

// --- User History/Data API Calls (Example - adjust to your backend) ---
// Assuming these are part of the user object fetched by fetchAuthenticatedUser
// or require separate endpoints.
export const fetchUserViewHistory = () => request('/courses/users/history/', 'GET');
export const fetchUserRatings = () => request('/courses/users/ratings/', 'GET');
export const fetchUserReviews = () => request('/courses/users/reviews/', 'GET');


export default request; // Export the base request function if needed elsewhere, or just specific methods
