
// src/components/Course/CourseCard.jsx
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUserViewHistory } from '../../services/api';
import { fetchUserViewHistory } from '../../services/api';

function CourseCard({ course }) {
    const navigate = useNavigate();
    
    const handleClick = () => {
        addUserViewHistory(course.id);
        navigate(`/course/${course.id}`);
        
    
    };

    const handleKeyPress = useCallback((event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            handleClick();
        }
    }, [handleClick]);

    return (
        <div
          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col group focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
          onClick={handleClick}
          role="button"
          tabIndex="0"
          onKeyPress={handleKeyPress}
          aria-label={`View details for ${course.title}`}
        >
            <div className="relative">
                <img
                    src="https://media.canva.com/v2/image-resize/format:JPG/height:452/quality:92/uri:ifs%3A%2F%2FM%2F1be0603b-7fee-4564-a028-d6757b986d4c/watermark:F/width:800?csig=AAAAAAAAAAAAAAAAAAAAAOd9MchUpDklyYL6-terL-VBJyGG1VZdsEzmABmnk85v&exp=1746920390&osig=AAAAAAAAAAAAAAAAAAAAAHjc50Dcuyd740fTmuZKJ_w_dGNrAFDnmQ3pY31q-XJF&signer=media-rpc&x-canva-quality=screen"
                    alt={`${course.title} thumbnail`}
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x300/cccccc/ffffff?text=Image+Error'; }}
                 />
                 <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     {course.category}
                 </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-indigo-700 transition-colors duration-200">{course.title}</h3>
                <p className="text-sm text-gray-600 flex-grow mb-3">{course.name}</p>
                <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
                     <span className="text-xs text-gray-500">{course.university}</span>
                     <span className="text-sm font-bold text-indigo-600">{course.difficultyLevel}</span>
                </div>
            </div>
        </div>
    );
}
export default CourseCard;