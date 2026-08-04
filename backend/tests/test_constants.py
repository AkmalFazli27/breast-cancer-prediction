import csv

from app.constants import FEATURE_BOUNDS, FEATURE_KEYS, LABEL_MAP, REPO_ROOT


def _csv_feature_keys():
    path = REPO_ROOT / "data" / "processed" / "removed_multicollinearity.csv"
    with open(path, newline="", encoding="utf-8") as f:
        header = next(csv.reader(f))
    return [c for c in header if c not in ("id", "diagnosis")]


def test_feature_keys_match_processed_csv():
    assert FEATURE_KEYS == _csv_feature_keys()


def test_feature_keys_are_22_unique():
    assert len(FEATURE_KEYS) == 22
    assert len(set(FEATURE_KEYS)) == 22


def test_feature_bounds_cover_all_keys():
    assert list(FEATURE_BOUNDS) == FEATURE_KEYS


def test_feature_bounds_min_leq_max():
    for key, (lo, hi) in FEATURE_BOUNDS.items():
        assert lo <= hi, key


def test_label_map_is_bijective():
    assert LABEL_MAP == {0: "Benign", 1: "Malignant"}