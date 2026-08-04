import pytest
from pydantic import ValidationError

from app.constants import FEATURE_BOUNDS, FEATURE_KEYS
from app.schemas.predict import PredictRequest, PredictResponse


def _valid_payload():
    return {key: (lo + hi) / 2 for key, (lo, hi) in FEATURE_BOUNDS.items()}


def test_request_exposes_exactly_22_required_fields():
    fields = PredictRequest.model_fields
    assert set(fields) == set(FEATURE_KEYS)
    for name, field in fields.items():
        assert field.is_required(), name


def test_request_accepts_boundary_values():
    payload = {key: lo for key, (lo, hi) in FEATURE_BOUNDS.items()}
    payload["texture_mean"] = FEATURE_BOUNDS["texture_mean"][1]
    assert PredictRequest(**payload)


def test_request_rejects_missing_field():
    payload = _valid_payload()
    del payload["area_se"]
    with pytest.raises(ValidationError):
        PredictRequest(**payload)


def test_request_rejects_unknown_field():
    payload = _valid_payload()
    payload["mystery_feature"] = 1.0
    with pytest.raises(ValidationError):
        PredictRequest(**payload)


def test_request_rejects_out_of_range_value():
    payload = _valid_payload()
    payload["texture_mean"] = -5.0
    with pytest.raises(ValidationError):
        PredictRequest(**payload)


def test_response_serializes_to_contract():
    response = PredictResponse(
        prediction="Benign",
        probability={"benign": 97.4, "malignant": 2.6},
    )
    assert response.model_dump() == {
        "prediction": "Benign",
        "probability": {"benign": 97.4, "malignant": 2.6},
    }
