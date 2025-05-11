// src/components/Sidebar.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClearIcon,UserIcon, HistoryIcon, StarIcon, ChatBubbleLeftIcon, LogoutIcon, AppLogoIcon } from './Icons'; // Adjust path as needed
import { fetchUserViewHistory, fetchUserRatings, fetchUserReviews } from '../services/api';
import { formatDistanceToNow } from 'date-fns';

function Sidebar({ user, onLogout, isOpen, onClose }) {
    const [activeSection, setActiveSection] = useState('profile');
    const [viewHistory, setViewHistory] = useState([]);
    const [ratingHistory, setRatingHistory] = useState([]);
    const [reviewHistory, setReviewHistory] = useState([]);

    const navigate = useNavigate();

    const menuItems = useMemo(() => [
        { id: 'profile', label: 'Profile', icon: <UserIcon /> },
        { id: 'history', label: 'View History', icon: <HistoryIcon /> },
        { id: 'rating', label: 'Ratings', icon: <StarIcon /> },
        { id: 'review', label: 'Reviews', icon: <ChatBubbleLeftIcon /> },
    ], []);

    const handleNavigation = (path) => {
        navigate(path);
        // Potentially close sidebar on mobile after navigation, if not handled by MainLayout
        if (window.innerWidth < 1024 && onClose) {
            onClose();
        }
    };
  
    useEffect(() => {
        fetchUserViewHistory().then(setViewHistory);
    }, []);


    const renderSectionContent = useCallback(() => {
        if (!user) return <p className="text-sm text-gray-400 p-2">Loading user data...</p>;
        switch (activeSection) {
            case 'profile':
                return (
                    <div className="p-3 space-y-2">
                        <h3 className="text-base font-semibold mb-2 text-white">Profile Details</h3>
                        <p className="text-sm"><strong className="font-medium text-gray-300">Username:</strong> {user.username}</p>
                        <p className="text-sm"><strong className="font-medium text-gray-300">Email:</strong> {user.email}</p>
                        <button className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 hover:underline focus-visible:ring-1 focus-visible:ring-white rounded px-1">
                            Edit Profile (Not functional)
                        </button>
                    </div>
                );
            case 'history':
                return (
                    <div className="p-1 space-y-3">
                        <h3 className="text-base font-semibold mb-2 text-white px-2">View History</h3>
                        {viewHistory && viewHistory.length > 0 ? (
                            <ul className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                {viewHistory.map(item => (
                                    <li key={`hist-${item.id}`} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700/50 transition-colors duration-150 cursor-pointer" onClick={() => navigate(`/course/${item.id}`)}>
                                        {/* <img src={item.thumbnail} alt="" className="w-12 h-8 object-cover rounded flex-shrink-0" aria-hidden="true"/> */}
                                        <div className="text-xs overflow-hidden">
                                            <span className="font-medium block truncate text-gray-200">{item.course.name}</span>
                                            <span className="text-gray-400">Viewed: {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="text-sm text-gray-400 px-2">No viewing history.</p>}
                    </div>
                );
             case 'rating':
                return (
                    <div className="p-1 space-y-2">
                        <h3 className="text-base font-semibold mb-2 text-white px-2">Rating History</h3>
                        {ratingHistory && ratingHistory.length > 0 ? (
                            <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {ratingHistory.map(item => (
                                    <li key={`rate-${item.id}`} className="text-xs p-2 rounded hover:bg-gray-700/50 transition-colors duration-150 cursor-pointer" onClick={() => navigate(`/course/${item.id}`)}>
                                        <span className="font-medium block truncate text-gray-200">{item.title}</span>
                                        <span className="text-yellow-400">{ '★'.repeat(item.rating) }{ '☆'.repeat(5 - item.rating) }</span>
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="text-sm text-gray-400 px-2">No ratings submitted yet.</p>}
                    </div>
                );
            case 'review':
                return (
                    <div className="p-1 space-y-3">
                        <h3 className="text-base font-semibold mb-2 text-white px-2">Review History</h3>
                         {user.reviewHistory && user.reviewHistory.length > 0 ? (
                            <ul className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                {user.reviewHistory.map((item, index) => (
                                    <li key={`rev-${item.id}-${index}`} className="text-xs p-2 rounded border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors duration-150 cursor-pointer" onClick={() => navigate(`/course/${item.id}`)}>
                                        <span className="font-medium block truncate text-gray-200">{item.title}</span>
                                        <p className="text-gray-300 mt-1 italic">"{item.review}"</p>
                                    </li>
                                ))}
                            </ul>
                         ) : <p className="text-sm text-gray-400 px-2">You haven't reviewed any courses.</p>}
                    </div>
                );
            default: return null;
        }
    }, [activeSection, user, navigate]);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isOpen && onClose) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    return (
       <>
            {isOpen && (
                 <div
                   className="fixed inset-0 bg-black bg-opacity-60 z-10 lg:hidden backdrop-blur-sm"
                   onClick={onClose}
                   aria-hidden="true"
                 ></div>
            )}
            <aside
                id="main-sidebar"
                className={`w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col h-screen ${
                    isOpen ? 'fixed inset-y-0 left-0 z-50' : 'fixed inset-y-0 -left-64 z-50'
                } lg:relative lg:left-0 lg:z-0 transition-all duration-300 ease-in-out`}
                aria-label="Main Navigation"
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                     <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigation('/')}>
                        <AppLogoIcon className="h-8 w-8 text-indigo-400" />
                        <span className="text-xl font-semibold text-white">CourseMate</span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white lg:hidden p-1 rounded focus-visible:ring-2 focus-visible:ring-white" aria-label="Close menu">
                        <ClearIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <nav className="flex-none p-4 space-y-2">
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                                    activeSection === item.id ? 'bg-indigo-600 text-white shadow-inner' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                                aria-current={activeSection === item.id ? 'page' : undefined}
                            >
                                <span className="mr-3 h-5 w-5">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </nav>
                    <div className="flex-1 p-4 border-t border-gray-700 bg-gray-800/50 overflow-y-auto">
                        {renderSectionContent()}
                    </div>
                    <div className="flex-none p-4 border-t border-gray-700">
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-800 hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-white focus-visible:bg-red-800"
                        >
                            <LogoutIcon className="mr-3"/>
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
       </>
    );
}
export default Sidebar;

