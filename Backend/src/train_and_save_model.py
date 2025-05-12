# File: D:\Django\CourseMate\Backend\src\train_and_save_model.py

import pandas as pd
import os
import sys

# This ensures that 'recommender_model.cfrecommender' can be found
# when running this script from D:\Django\CourseMate\Backend\src\
# Usually, Django's manage.py context handles this, but for a standalone
# script, explicit path adjustment might be needed if imports fail.
# However, if 'recommender_model' is a package (has __init__.py) and
# this script is in its parent dir ('src'), direct import should work.
try:
    from recommender_model.cfrecommender import CFRecommender
except ModuleNotFoundError:
    print("Error: Could not import CFRecommender. Ensure this script is run from "
          "D:\\Django\\CourseMate\\Backend\\src\\ and the path to recommender_model is correct.")
    sys.exit(1)

def main():
    print("Starting model training and saving process...")
    # Adjust the path to your Coursera.csv file as needed.
    # This path should be relative to where you run this script,
    # or an absolute path.
    # Example: if Coursera.csv is in D:\Django\CourseMate\Backend\src\data\Coursera.csv
    # data_path = os.path.join("data", "Coursera.csv")
    # Or, if it's in the same directory as manage.py (src):
    data_path = "Coursera.csv" # Make sure this path is correct

    try:
        raw_data = pd.read_csv(data_path)
        print(f"Successfully loaded data from {data_path}")
    except FileNotFoundError:
        print(f"Error: Data file not found at {data_path}. Please check the path.")
        return
    except Exception as e:
        print(f"Error loading data: {e}")
        return

    # --- Check for essential columns ---
    required_columns = ['Course Name', 'University', 'Difficulty Level', 'Course Rating',
                        'Course URL', 'Course Description', 'Skills']
    missing_columns = [col for col in required_columns if col not in raw_data.columns]
    if missing_columns:
        print(f"Error: Missing essential columns in CSV: {', '.join(missing_columns)}")
        return

    print("Initializing CFRecommender...")
    recommender = CFRecommender(n_components=100, random_state=42) # Or your preferred params

    print("Fitting the model...")
    recommender.fit(raw_data) # The fit method in CFRecommender should handle prints

    if recommender.fitted:
        # Define the model directory and path
        # This will save to D:\Django\CourseMate\Backend\src\recommender_model\cf_recommender.pkl
        model_dir = "recommender_model"
        if not os.path.exists(model_dir):
            os.makedirs(model_dir)
            print(f"Created directory: {model_dir}")

        model_pkl_path = os.path.join(model_dir, "cf_recommender.pkl") # Corrected variable name for clarity

        print(f"Saving model to {model_pkl_path}...")
        recommender.save_model(model_pkl_path) # CFRecommender.save_model takes the full path
        print(f"Model successfully saved to {model_pkl_path}")
    else:
        print("Model fitting failed. Model not saved.")

if __name__ == '__main__':
    main()