import pytest

from app.constants import FEATURE_KEYS, SCALER_PATH
from app.services.inference import InferenceService
from tests.fixtures import GOLDEN_BENIGN_A, GOLDEN_MALIGNANT, GOLDEN_SAMPLES


@pytest.fixture(scope="module")
def service():
    svc = InferenceService()
    svc.load()
    return svc


def test_artifacts_expect_22_features(service):
    assert service._model.n_features_in_ == len(FEATURE_KEYS)
    assert service._scaler.n_features_in_ == len(FEATURE_KEYS)


def test_artifact_feature_names_match_constants():
    import joblib

    scaler = joblib.load(SCALER_PATH)
    assert hasattr(scaler, "feature_names_in_")
    assert list(scaler.feature_names_in_) == FEATURE_KEYS


def test_predict_returns_contract(service):
    result = service.predict(GOLDEN_BENIGN_A)
    assert result.prediction in ("Benign", "Malignant")
    assert result.probability.benign + result.probability.malignant == pytest.approx(100.0, abs=0.5)


def test_predict_is_invariant_to_key_order(service):
    shuffled = {key: GOLDEN_BENIGN_A[key] for key in reversed(list(GOLDEN_BENIGN_A))}
    assert service.predict(GOLDEN_BENIGN_A) == service.predict(shuffled)


def test_golden_samples_predict_correctly(service):
    for features, expected in GOLDEN_SAMPLES:
        result = service.predict(features)
        assert result.prediction == expected, features


def test_golden_malignant_probability_dominates(service):
    result = service.predict(GOLDEN_MALIGNANT)
    assert result.probability.malignant > result.probability.benign
