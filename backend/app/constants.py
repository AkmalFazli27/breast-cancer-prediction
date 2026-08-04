from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
MODEL_DIR = REPO_ROOT / "models"
SCALER_PATH = MODEL_DIR / "scaler.pkl"
MODEL_PATH = MODEL_DIR / "final_model_logistic_regression.pkl"

# Model feature order — must match data/processed/removed_multicollinearity.csv
# (verified by tests/test_constants.py) and frontend FEATURE_META keys.
FEATURE_KEYS = [
    "texture_mean",
    "smoothness_mean",
    "compactness_mean",
    "concave points_mean",
    "symmetry_mean",
    "fractal_dimension_mean",
    "texture_se",
    "area_se",
    "smoothness_se",
    "compactness_se",
    "concavity_se",
    "concave points_se",
    "symmetry_se",
    "fractal_dimension_se",
    "texture_worst",
    "area_worst",
    "smoothness_worst",
    "compactness_worst",
    "concavity_worst",
    "concave points_worst",
    "symmetry_worst",
    "fractal_dimension_worst",
]

# Dataset min/max per feature — mirrors frontend FEATURE_META (src/constants/features.js).
FEATURE_BOUNDS = {
    "texture_mean": (9.71, 39.28),
    "smoothness_mean": (0.0526, 0.1634),
    "compactness_mean": (0.0194, 0.3454),
    "concave points_mean": (0.0, 0.2012),
    "symmetry_mean": (0.106, 0.304),
    "fractal_dimension_mean": (0.05, 0.0974),
    "texture_se": (0.3602, 4.885),
    "area_se": (6.802, 542.2),
    "smoothness_se": (0.0017, 0.0311),
    "compactness_se": (0.0023, 0.1354),
    "concavity_se": (0.0, 0.396),
    "concave points_se": (0.0, 0.0528),
    "symmetry_se": (0.0079, 0.079),
    "fractal_dimension_se": (0.0009, 0.0298),
    "texture_worst": (12.02, 49.54),
    "area_worst": (185.2, 4254.0),
    "smoothness_worst": (0.0712, 0.2226),
    "compactness_worst": (0.0273, 1.058),
    "concavity_worst": (0.0, 1.252),
    "concave points_worst": (0.0, 0.291),
    "symmetry_worst": (0.1565, 0.6638),
    "fractal_dimension_worst": (0.055, 0.2075),
}

# Model class index (0/1) to API label.
LABEL_MAP = {0: "Benign", 1: "Malignant"}