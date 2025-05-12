import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.stem import WordNetLemmatizer
from sklearn.decomposition import TruncatedSVD
import pickle
import nltk
import re
from nltk.corpus import wordnet 

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    print("Downloading wordnet...")
    nltk.download('wordnet', quiet=True)
try:
    nltk.data.find('corpora/omw-1.4')
except LookupError:
    print("Downloading omw-1.4...")
    nltk.download('omw-1.4', quiet=True)


print('Dependencies Imported and NLTK resources checked.')

class CFRecommender:
    def __init__(self, n_components=100, random_state=42, max_features=5000):
        self.n_components = n_components
        self.random_state = random_state
        self.max_features = max_features
        self.lemmatizer = WordNetLemmatizer()
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=self.max_features)
        self.svd = TruncatedSVD(n_components=self.n_components, random_state=self.random_state)
        
        self.data = None
        self.cleaned_course_names = None # To store cleaned course names for matching
        self.similarity_matrix = None
        self.fitted = False

    def _clean_text(self, text):
        if pd.isna(text):
            return ""
        text = str(text)
        text = re.sub(r'"+"', '', text)  # Remove repeated quotes
        text = re.sub(r'[^\x00-\x7F]+', '', text)  # Remove non-ASCII
        text = re.sub(r'[^a-zA-Z\s]', '', text)  # Remove non-letter/space
        text = text.lower()  # Lowercase
        text = ' '.join([self.lemmatizer.lemmatize(word) for word in text.split()])  # Lemmatize
        return text.strip()  # Remove leading/trailing whitespace

    def _normalize_rating(self, rating_str):
        try:
            return (float(rating_str) - 0) / (5 - 0)  # Normalize to 0-1
        except ValueError:
            return 0 # Default for missing or invalid ratings

    def fit(self, df):
        """
        Fits the recommender model to the provided DataFrame.
        The DataFrame should contain 'Course Name', 'University', 'Difficulty Level',
        'Course Rating', 'Course URL', 'Course Description', and 'Skills' columns.
        """
        if not isinstance(df, pd.DataFrame):
            raise ValueError("Input must be a pandas DataFrame.")

        print("Starting fitting process...")
        # 1. Preprocess data
        self.data = df.copy()
        self.data = self.data.drop_duplicates(
            subset=['Course Name', 'University', 'Difficulty Level', 'Course Rating', 'Course URL', 'Course Description']
        )
        self.data.reset_index(drop=True, inplace=True) # Important for indexing later

        print(f"Data shape after dropping duplicates: {self.data.shape}")

        # 2. Clean text features and create 'tags'
        # Store original course names before cleaning for display/mapping
        self.original_course_names = self.data['Course Name'].copy()
        
        # Clean 'Course Name' for matching and for tag generation
        # self.data['Cleaned Course Name'] will be used for matching input course_name
        self.data['Cleaned Course Name'] = self.data['Course Name'].apply(self._clean_text)

       
        cleaned_course_names_for_tags = self.data['Cleaned Course Name'].copy() # Already cleaned
        cleaned_descriptions = self.data['Course Description'].apply(self._clean_text)
        cleaned_skills = self.data['Skills'].apply(self._clean_text)
        
        self.data['tags'] = cleaned_course_names_for_tags + ' ' + cleaned_descriptions + ' ' + cleaned_skills
        
        print("Text cleaning and 'tags' creation complete.")

        # 3. TF-IDF Vectorization
        # We use 'tags' for TF-IDF
        tfidf_matrix_transformed = self.vectorizer.fit_transform(self.data['tags'])
        print(f"TF-IDF matrix shape: {tfidf_matrix_transformed.shape}")

        # 4. Dimensionality Reduction with Truncated SVD
        # Check if n_components is less than the number of features in tfidf_matrix
        if self.n_components >= tfidf_matrix_transformed.shape[1]:
            print(f"Warning: n_components ({self.n_components}) is >= number of features ({tfidf_matrix_transformed.shape[1]}). "
                  f"SVD will not reduce dimensions. Setting n_components to {tfidf_matrix_transformed.shape[1] -1}")
            self.svd.n_components = tfidf_matrix_transformed.shape[1] -1
            if self.svd.n_components <=0: #Edge case for very small feature sets
                 print("Error: Cannot perform SVD with n_components <= 0. Check your data/max_features.")
                 self.fitted = False
                 return

        tfidf_matrix_reduced = self.svd.fit_transform(tfidf_matrix_transformed)
        print(f"Reduced TF-IDF matrix shape: {tfidf_matrix_reduced.shape}")

        # 5. Compute Cosine Similarity Matrix
        self.similarity_matrix = cosine_similarity(tfidf_matrix_reduced)
        print(f"Similarity matrix shape: {self.similarity_matrix.shape}")
        if self.similarity_matrix.shape[0] > 1:
             print(f"Example similarity (course 0 and 1): {self.similarity_matrix[0][1]}")
        
        self.fitted = True
        print("Fitting process complete.")

    def get_recommendations(self, course_name_input, top_n=5, rating_weight=0.05):
        if not self.fitted:
            raise RuntimeError("The recommender model has not been fitted yet. Call fit() first.")
        if self.data is None or self.similarity_matrix is None:
            raise RuntimeError("Data or similarity matrix is not available. Fit the model.")

        # Clean the input course name just like the training data course names
        cleaned_input_course_name = self._clean_text(course_name_input)

        # Find the index of the course
        # Match against the 'Cleaned Course Name' column
        matched_courses = self.data[self.data['Cleaned Course Name'] == cleaned_input_course_name]

        if matched_courses.empty:
            # Fallback: try partial match if exact cleaned name not found
            # This can be slow on large datasets if not optimized
            print(f"Exact match for '{course_name_input}' (cleaned: '{cleaned_input_course_name}') not found. Trying partial match...")
            partial_matches = self.data[self.data['Cleaned Course Name'].str.contains(cleaned_input_course_name, case=False, na=False)]
            if partial_matches.empty:
                print(f"No course found matching '{course_name_input}'. Please check the course name.")
                return []
            # If multiple partial matches, pick the first one for simplicity, or implement more sophisticated logic
            course_idx = partial_matches.index[0]
            print(f"Found partial match: {self.data.loc[course_idx, 'Course Name']}")
        else:
            course_idx = matched_courses.index[0]

        if course_idx >= self.similarity_matrix.shape[0]:
             print(f"Error: Course index {course_idx} is out of bounds for the similarity matrix of shape {self.similarity_matrix.shape}.")
             return[]

        similarity_scores = list(enumerate(self.similarity_matrix[course_idx]))

        # Sort by similarity, then get top_n (add 1 to top_n because the course itself will be most similar)
        # Ensure we don't exceed the number of available courses
        num_courses_to_consider = min(len(similarity_scores), top_n + 1)
        
        recommendations = []
        # Iterate through sorted scores, skipping the first one if it's the course itself
        for idx, similarity_score in sorted(similarity_scores, key=lambda x: x[1], reverse=True)[:num_courses_to_consider]:
            if idx == course_idx: # Skip the input course itself
                continue
            if len(recommendations) >= top_n: # Stop if we have enough recommendations
                break

            course_data_row = self.data.iloc[idx]
            normalized_rating = self._normalize_rating(course_data_row.get('Course Rating', '0'))

            recommendations.append({
                "course_name": self.original_course_names.iloc[idx], # Use original name for display
                "course_url": course_data_row.get('Course URL', ''),
                "rating": course_data_row.get('Course Rating', 'Not Rated'),
                "institution": course_data_row.get('University', 'Unknown'),
                "difficulty_level": course_data_row.get('Difficulty Level', 'Unknown'),
                "similarity_score": similarity_score, # Raw similarity
                "final_score": similarity_score * (1 - rating_weight) + normalized_rating * rating_weight
            })
        
        # Sort final recommendations by the combined score
        return sorted(recommendations, key=lambda x: x['final_score'], reverse=True)

    def save_model(self, filepath="cf_recommender_model.pkl"):
        if not self.fitted:
            print("Warning: Model has not been fitted. Saving an unfitted model.")
        with open(filepath, 'wb') as f:
            pickle.dump(self, f)
        print(f"Model saved to {filepath}")

    @staticmethod
    def load_model(filepath="cf_recommender_model.pkl"):
        with open(filepath, 'rb') as f:
            model = pickle.load(f)
        print(f"Model loaded from {filepath}")
        return model

# --- Example Usage ---
if __name__ == '__main__':
    # Load your data
    try:
        raw_data = pd.read_csv('Coursera.csv') # Make sure Coursera.csv is in the same directory or provide full path
        print("Coursera.csv loaded successfully.")
        print("Initial data shape:", raw_data.shape)
        raw_data.info()

        # --- Check for essential columns before proceeding ---
        required_columns = ['Course Name', 'University', 'Difficulty Level', 'Course Rating',
                            'Course URL', 'Course Description', 'Skills']
        missing_columns = [col for col in required_columns if col not in raw_data.columns]
        if missing_columns:
            raise ValueError(f"Missing essential columns in CSV: {', '.join(missing_columns)}")


        # Initialize and fit the recommender
        recommender = CFRecommender(n_components=100, random_state=42) # n_components can be tuned
        recommender.fit(raw_data)

        if recommender.fitted:
            # Save the model
            recommender.save_model("cf_recommender.pkl")

            # Load the model (example)
            loaded_recommender = CFRecommender.load_model("cf_recommender.pkl")

            # Get recommendations using the loaded model
            # Try with a course name that you expect to be in your dataset
            # Ensure the course name exists and is spelled correctly as in your 'Course Name' column
            example_course_name = raw_data['Course Name'].iloc[0] # Get the first course name as an example
            print(f"\nGetting recommendations for: '{example_course_name}'")
            
            recommendations = loaded_recommender.get_recommendations(example_course_name, top_n=3)

            if recommendations:
                print("\nTop Recommendations:")
                for rec in recommendations:
                    print(f"  Course: {rec['course_name']}")
                    print(f"    URL: {rec['course_url']}")
                    print(f"    Institution: {rec['institution']}")
                    print(f"    Rating: {rec['rating']}")
                    print(f"    Difficulty: {rec['difficulty_level']}")
                    print(f"    Final Score: {rec['final_score']:.4f} (Similarity: {rec['similarity_score']:.4f})")
            else:
                print("No recommendations found for this course.")
            
            # Example with a course name that might not exist or needs cleaning
            print(f"\nGetting recommendations for: 'Introduction to machine learning'")
            recommendations_ml = loaded_recommender.get_recommendations("Introduction to machine learning", top_n=3)
            if recommendations_ml:
                print("\nTop ML Recommendations:")
                for rec in recommendations_ml:
                     print(f"  Course: {rec['course_name']}, Final Score: {rec['final_score']:.4f}")
            else:
                print("No recommendations found for 'Introduction to machine learning'.")

        else:
            print("Model fitting failed. Cannot proceed with recommendations or saving.")

    except FileNotFoundError:
        print("Error: Coursera.csv not found. Please make sure the file is in the correct directory.")
    except ValueError as ve:
        print(f"ValueError: {ve}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")