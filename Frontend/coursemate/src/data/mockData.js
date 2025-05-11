// src/data/mockData.js

// Course data
export const mockCourses = [
    { id: 'react101', title: "React Fundamentals", description: "Master the core concepts of React library.", thumbnail: "https://placehold.co/600x300/F0DB4F/000000?text=React", instructor: "Alice Johnson", duration: "6 hours", price: "$49.99", detailedDescription: "Learn about components, props, state, hooks (useState, useEffect), and basic routing in React. Perfect for beginners moving from vanilla JS or jQuery.", category: "Web Development" },
    { id: 'tailwind201', title: "Advanced Tailwind CSS", description: "Build modern UIs faster with Tailwind.", thumbnail: "https://placehold.co/600x300/38BDF8/FFFFFF?text=Tailwind", instructor: "Bob Williams", duration: "8 hours", price: "$69.99", detailedDescription: "Go beyond the basics. Explore customization, responsive design, dark mode, plugins, and integrating Tailwind into complex projects.", category: "Web Design" },
    { id: 'jsadv', title: "JavaScript: The Advanced Parts", description: "Deep dive into advanced JS concepts.", thumbnail: "https://placehold.co/600x300/F7DF1E/000000?text=JS", instructor: "Charlie Brown", duration: "12 hours", price: "$89.99", detailedDescription: "Understand closures, prototypes, async/await, event loop, functional programming patterns, and performance optimization in JavaScript.", category: "Web Development" },
    { id: 'uxdesign', title: "UX Design Principles", description: "Create user-centered digital products.", thumbnail: "https://placehold.co/600x300/A855F7/FFFFFF?text=UX", instructor: "Diana Miller", duration: "10 hours", price: "$79.99", detailedDescription: "Learn about user research, personas, journey mapping, wireframing, prototyping, usability testing, and accessibility best practices.", category: "Design" },
    { id: 'python_ds', title: "Python for Data Science", description: "Analyze and visualize data with Python.", thumbnail: "https://placehold.co/600x300/3776AB/FFFFFF?text=Python", instructor: "Ethan Davis", duration: "15 hours", price: "$99.99", detailedDescription: "Get hands-on experience with NumPy, Pandas, Matplotlib, and Scikit-learn for data manipulation, analysis, visualization, and basic machine learning.", category: "Data Science" },
    { id: 'node_api', title: "Node.js API Development", description: "Build robust backend APIs with Node.js.", thumbnail: "https://placehold.co/600x300/68A063/FFFFFF?text=Node.js", instructor: "Fiona Garcia", duration: "10 hours", price: "$79.99", detailedDescription: "Learn Express.js framework, RESTful API principles, database integration (MongoDB/PostgreSQL), authentication (JWT), and testing.", category: "Web Development" },
];

// User authentication data (simple simulation)
export const mockUsers = {
    "user@example.com": { name: "Test User", password: "password123" }
};

// User-specific data (history, ratings, etc.)
export const mockUserData = {
    "user@example.com": {
        profile: { name: "Test User", email: "user@example.com" },
        viewHistory: [
            { id: 'react101', title: "React Fundamentals", thumbnail: "https://placehold.co/120x60/F0DB4F/000000?text=React", dateViewed: "2025-05-01" },
            { id: 'jsadv', title: "JavaScript: The Advanced Parts", thumbnail: "https://placehold.co/120x60/F7DF1E/000000?text=JS", dateViewed: "2025-04-28" },
        ],
        ratingHistory: [
            { id: 'react101', title: "React Fundamentals", rating: 5 },
            { id: 'tailwind201', title: "Advanced Tailwind CSS", rating: 4 },
        ],
        reviewHistory: [
            { id: 'jsadv', title: "JavaScript: The Advanced Parts", review: "Very comprehensive, but challenging. Learned a lot!" },
        ]
    }
};
