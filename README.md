# 🩺 Breast Cancer Prediction

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Streamlit](https://img.shields.io/badge/Streamlit-1.23.0+-red.svg)
![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-orange.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

A machine learning web application for predicting whether a breast mass is **Benign** or **Malignant** based on measurements from digitized images of fine needle aspirate (FNA) of breast masses.

## 📋 Table of Contents

- [Overview](#overview)
- [Dataset](#dataset)
- [Features](#features)
- [Model Performance](#model-performance)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Notebooks](#notebooks)
- [Disclaimer](#disclaimer)

## 🔍 Overview

This project implements a complete machine learning pipeline for breast cancer classification:

1. **Data Exploration** - Understanding the dataset characteristics and distributions
2. **Data Preprocessing** - Handling missing values, feature scaling, and multicollinearity removal
3. **Model Training** - Training and comparing multiple ML algorithms
4. **Hyperparameter Tuning** - Optimizing model parameters for best performance
5. **Web Application** - Interactive Streamlit app for real-time predictions

## 📊 Dataset

The dataset used is the **Wisconsin Breast Cancer Dataset** containing:

- **569 samples** of breast mass measurements
- **30 features** computed from digitized FNA images
- **2 classes**: Malignant (M) and Benign (B)

### Features Include:
- **Mean values**: radius, texture, perimeter, area, smoothness, compactness, concavity, concave points, symmetry, fractal dimension
- **Standard Error (SE)**: for each of the above measurements
- **Worst values**: largest mean values for each measurement

## ✨ Features

- **Interactive Web Interface**: Streamlit-based dashboard with real-time predictions
- **Radar Chart Visualization**: Visual representation of cell nuclei measurements
- **Probability Scores**: Shows confidence levels for both Benign and Malignant predictions
- **Adjustable Parameters**: Sidebar sliders to modify input measurements

## 📈 Model Performance

After extensive evaluation and hyperparameter tuning, **Logistic Regression** was selected as the best model:

| Metric | Score |
|--------|-------|
| **Accuracy** | 97.37% |
| **Precision** | 97.56% |
| **Recall** | 95.24% |
| **F1-Score** | 96.39% |
| **ROC-AUC** | 99.04% |

### Model Comparison (Cross-Validation F1-Score)

| Model | CV F1-Score |
|-------|-------------|
| **Logistic Regression** | 96.33% |
| SVM | 94.86% |
| Random Forest | 94.53% |
| Gradient Boosting | 94.16% |
| KNN | 93.31% |
| Naive Bayes | 90.79% |
| Decision Tree | 89.52% |

### Top 5 Important Features

1. `concave points_worst` (19.65%)
2. `area_worst` (17.30%)
3. `concave points_mean` (14.07%)
4. `area_se` (12.82%)
5. `concavity_worst` (8.07%)

## 📁 Project Structure

```
breast-cancer-prediction/
├── app/
│   └── main.py              # Streamlit web application
├── data/
│   ├── raw/
│   │   └── breast_cancer.csv    # Original dataset
│   └── processed/
│       ├── final_scaled.csv             # Scaled features
│       └── removed_multicollinearity.csv # Features after VIF analysis
├── models/
│   ├── final_model_logistic_regression.pkl  # Best trained model
│   ├── final_model_random_forest.pkl
│   ├── baseline_logistic_regression.pkl
│   ├── baseline_random_forest.pkl
│   └── scaler.pkl                           # Feature scaler
├── notebook/
│   ├── exploration.ipynb    # Data exploration & visualization
│   ├── preprocessing.ipynb  # Data cleaning & feature engineering
│   └── modeling.ipynb       # Model training & evaluation
├── results/
│   ├── model_comparison.csv      # All models performance metrics
│   ├── model_summary.csv         # Best model summary
│   ├── feature_importance.csv    # Feature importance rankings
│   ├── confusion_matrix.csv      # Confusion matrix results
│   ├── cross_validation_scores.csv
│   ├── tuning_comparison.csv
│   └── test_predictions.csv
├── requirements.txt
└── README.md
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/breast-cancer-prediction.git
   cd breast-cancer-prediction
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## 🚀 Usage

### Running the Web Application

```bash
cd app
streamlit run main.py
```

The app will open in your default browser at `http://localhost:8501`

### Using the App

1. Adjust the cell nuclei measurements using the sliders in the sidebar
2. View the radar chart visualization of your input values
3. See the prediction result (Benign/Malignant) with probability scores

## 📓 Notebooks

The project includes three Jupyter notebooks documenting the complete ML pipeline:

1. **[exploration.ipynb](notebook/exploration.ipynb)** - Exploratory Data Analysis
   - Data overview and statistics
   - Distribution analysis
   - Correlation analysis
   - Visualization of features

2. **[preprocessing.ipynb](notebook/preprocessing.ipynb)** - Data Preprocessing
   - Missing value handling
   - Feature scaling
   - Multicollinearity removal using VIF
   - Train-test split

3. **[modeling.ipynb](notebook/modeling.ipynb)** - Model Development
   - Baseline model training
   - Model comparison
   - Hyperparameter tuning
   - Final model evaluation
   - Model persistence

## ⚙️ Technologies Used

- **Python 3.8+**
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing
- **Scikit-learn** - Machine learning
- **Matplotlib & Seaborn** - Data visualization
- **Plotly** - Interactive charts
- **Streamlit** - Web application
- **Joblib** - Model serialization

## ⚠️ Disclaimer

> **This application is intended for educational and informational purposes only.** It should NOT be used as a substitute for professional medical diagnosis, advice, or treatment. Always consult a qualified healthcare provider for proper diagnosis and treatment decisions.