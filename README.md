# CourseMate: Course Recommender System

## Overview
**CourseMate** is a web-based platform designed to aggregate online courses from Coursera and provide personalized course recommendations based on a user's career goals (e.g., "Data Scientist," "Software Engineer"). Built using two Kaggle datasets—"Course Reviews on Coursera" (1.45 million reviews) and "Coursera Courses Dataset 2021" (3,522 courses)—the system employs a hybrid recommendation approach:
- **Knowledge-Based Recommendations**: Matches courses to career-relevant skills using course metadata.
- **Collaborative Filtering**: Enhances recommendations by prioritizing high-quality courses based on user ratings.

Additional features include skill gap analysis, learning path generation, and community feedback summaries, inspired by platforms like Coursera and Udemy. CourseMate aims to empower learners by delivering tailored, high-quality course suggestions to achieve their career aspirations.

## Features
- **Career-Based Recommendations**: Users input their career (e.g., "Data Scientist"), and the system suggests relevant courses based on a career-to-skills mapping and course skills.
- **Quality Filtering**: Courses are ranked by average ratings from reviews, ensuring high-quality recommendations.
- **Search and Filters**: Filter courses by difficulty, rating, or platform.
- **Skill Gap Analysis**: Identifies missing skills for a user’s career and recommends courses to bridge gaps.
- **Learning Path Generator**: Sequences courses (e.g., Beginner → Intermediate) for structured learning.
- **Community Feedback**: Displays summarized reviews for each course to foster engagement.

## Datasets
The project leverages two Kaggle datasets:
1. **[Coursera Courses Dataset 2021](https://www.kaggle.com/datasets/khusheekapoor/coursera-courses-dataset-2021)**:
   - 3,522 courses with metadata (e.g., `course_title`, `description`, `skills`, `difficulty_level`, `course_url`).
   - Used for knowledge-based recommendations by matching course skills to career requirements.
2. **[Course Reviews on Coursera](https://www.kaggle.com/datasets/imuhammad/course-reviews-on-coursera)**:
   - 1.45 million reviews with fields (e.g., `course_id`, `rating`, `review_text`, `date`).
   - Used for collaborative filtering and quality ranking based on ratings.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Axios
- **Backend**: Django, Django REST Framework (API development)
- **Database**: PostgreSQL (course metadata, review summaries, career-to-skills mapping)
- **Libraries**:
  - Python: pandas, scikit-learn, spaCy, fuzzywuzzy (for skill matching), TF-IDF (content-based filtering)
  - Collaborative Filtering: SVD (matrix factorization)
- **DevOps**: Docker (containerization), AWS (deployment)
- **Tools**: Git, npm, pip

## Installation

### Prerequisites
- Python (>=3.8)
- Docker (optional, for containerized deployment)
- Git

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/coursemate.git
   cd coursemate
   ```

2. **Set Up Backend**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Create a virtual environment and activate it:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows: venv\Scripts\activate
     ```
   - Install Python dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Set up PostgreSQL:
     - Install and start PostgreSQL locally or use a cloud service (e.g., AWS RDS).
     - Create a database named `coursemate`.
     - Update `backend/coursemate/settings.py` with your database configuration:
       ```python
       DATABASES = {
           'default': {
               'ENGINE': 'django.db.backends.postgresql',
               'NAME': 'coursemate',
               'USER': 'your_postgres_user',
               'PASSWORD': 'your_postgres_password',
               'HOST': 'localhost',
               'PORT': '5432',
           }
       }
       ```
   - Run migrations to set up the database schema:
     ```bash
     python manage.py migrate
     ```

3. **Set Up Frontend**:
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```

4. **Download and Preprocess Datasets**:
   - Download datasets from Kaggle:
     - [Coursera Courses Dataset 2021](https://www.kaggle.com/datasets/khusheekapoor/coursera-courses-dataset-2021)
     - [Course Reviews on Coursera](https://www.kaggle.com/datasets/imuhammad/course-reviews-on-coursera)
   - Place them in `backend/data/`.
   - Run preprocessing script to clean datasets and load into PostgreSQL:
     ```bash
     cd backend
     python manage.py runscript preprocess
     ```
     This cleans datasets, standardizes skills, computes average ratings, and populates the database.

5. **Configure Environment**:
   - Create a `.env` file in `backend/` with:
     ```env
     DATABASE_URL=postgresql://your_postgres_user:your_postgres_password@localhost:5432/coursemate
     SECRET_KEY=your_django_secret_key
     DEBUG=True
     ```
   - Update `frontend/.env` with:
     ```env
     REACT_APP_API_URL=http://localhost:8000/api
     ```

6. **Run the Application**:
   - Start the Django backend:
     ```bash
     cd backend
     python manage.py runserver
     ```
   - Start the frontend:
     ```bash
     cd frontend
     npm start
     ```
   - Access the app at `http://localhost:3000`.

7. **Optional: Deploy with Docker**:
   - Build and run Docker containers:
     ```bash
     docker-compose up --build
     ```

## Usage
1. **Access the Web App**:
   - Open `http://localhost:3000` in your browser.
2. **Select a Career**:
   - Enter a career (e.g., "Data Scientist") in the input form.
3. **View Recommendations**:
   - The system displays a list of Coursera courses matching the career’s skills, ranked by average rating.
4. **Apply Filters**:
   - Filter by difficulty (e.g., Beginner, Intermediate) or minimum rating.
5. **Explore Additional Features**:
   - Use skill gap analysis to input current skills and identify courses for missing skills.
   - View learning paths for structured career progression.
   - Check community feedback for review summaries.

## Project Structure
```
coursemate/
├── backend/
│   ├── coursemate/      # Django project settings
│   ├── api/            # Django REST Framework app for APIs
│   ├── data/           # Raw and preprocessed datasets
│   ├── scripts/        # Preprocessing and recommendation scripts
│   ├── requirements.txt # Python dependencies
│   └── manage.py       # Django management script
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page layouts
│   │   └── App.js      # Main React app
│   ├── public/         # Static assets
│   └── package.json    # Frontend dependencies
├── docker-compose.yml  # Docker configuration
└── README.md           # Project documentation
```

## Recommendation System
- **Knowledge-Based**:
  - Uses a career-to-skills mapping (stored in `backend/data/career_skills.json`) to match user career inputs to course skills from the "Coursera Courses Dataset 2021."
  - Implements content-based filtering with TF-IDF on course descriptions and fuzzy matching for skills.
- **Collaborative Filtering**:
  - Uses ratings from the "Course Reviews on Coursera" dataset to rank courses by quality.
  - Applies SVD for sparse rating matrices to enhance recommendations.
- **Hybrid Approach**:
  - Matches courses to career skills via Django REST Framework APIs, then ranks them by average rating or popularity (review count).

## API Endpoints
- `GET /api/courses/`: Retrieve all courses with metadata.
- `POST /api/recommend/`: Submit career input and receive recommended courses.
- `GET /api/courses/{id}/`: Get details for a specific course, including average rating.
- `GET /api/reviews/`: Retrieve review summaries for courses.

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md) and report issues via the [Issues](https://github.com/yourusername/coursemate/issues) tab.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Datasets provided by Kaggle: [Coursera Courses Dataset 2021](https://www.kaggle.com/datasets/khusheekapoor/coursera-courses-dataset-2021) and [Course Reviews on Coursera](https://www.kaggle.com/datasets/imuhammad/course-reviews-on-coursera).
- Inspired by e-Learning platforms like Coursera and Udemy.
- Built with open-source tools and libraries, including Django REST Framework.

## Contact
For questions or feedback, reach out via [GitHub Issues](https://github.com/Ahmedmokhtar200) or email at ahmedmokhtar2407@gmail.com.
