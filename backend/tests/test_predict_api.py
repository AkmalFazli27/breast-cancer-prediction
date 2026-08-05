import pytest
from fastapi.testclient import TestClient

from app.dependencies import get_service
from app.main import app, cors_origin_regex
from tests.fixtures import GOLDEN_BENIGN_A, GOLDEN_MALIGNANT, GOLDEN_SAMPLES


def _assert_contract(response, expected_label):
    assert response.status_code == 200
    body = response.json()
    assert set(body) == {"prediction", "probability"}
    assert body["prediction"] == expected_label
    assert body["prediction"] in ("Benign", "Malignant")
    prob = body["probability"]
    assert set(prob) == {"benign", "malignant"}
    assert isinstance(prob["benign"], (int, float))
    assert isinstance(prob["malignant"], (int, float))
    assert prob["benign"] + prob["malignant"] == pytest.approx(100.0, abs=0.5)


def test_predict_valid_benign(client):
    resp = client.post("/api/v1/predict", json=GOLDEN_BENIGN_A)
    _assert_contract(resp, "Benign")
    assert resp.json()["probability"]["benign"] > resp.json()["probability"]["malignant"]


def test_predict_valid_malignant(client):
    resp = client.post("/api/v1/predict", json=GOLDEN_MALIGNANT)
    _assert_contract(resp, "Malignant")
    assert resp.json()["probability"]["malignant"] > resp.json()["probability"]["benign"]


def test_predict_golden_samples(client):
    for features, expected in GOLDEN_SAMPLES:
        resp = client.post("/api/v1/predict", json=features)
        _assert_contract(resp, expected)


def test_predict_missing_field_is_422(client):
    payload = dict(GOLDEN_BENIGN_A)
    del payload["area_se"]
    resp = client.post("/api/v1/predict", json=payload)
    assert resp.status_code == 422
    assert any("area_se" in str(item.get("loc")) for item in resp.json()["detail"])


def test_predict_extra_key_is_422(client):
    payload = dict(GOLDEN_BENIGN_A)
    payload["mystery_feature"] = 1.0
    resp = client.post("/api/v1/predict", json=payload)
    assert resp.status_code == 422


def test_predict_wrong_type_is_422(client):
    payload = dict(GOLDEN_BENIGN_A)
    payload["texture_mean"] = "not-a-number"
    resp = client.post("/api/v1/predict", json=payload)
    assert resp.status_code == 422


def test_predict_out_of_range_is_422(client):
    payload = dict(GOLDEN_BENIGN_A)
    payload["texture_mean"] = -5.0
    resp = client.post("/api/v1/predict", json=payload)
    assert resp.status_code == 422


def test_predict_above_max_is_422(client):
    payload = dict(GOLDEN_BENIGN_A)
    payload["texture_mean"] = 999.0
    resp = client.post("/api/v1/predict", json=payload)
    assert resp.status_code == 422


def test_health_returns_ok(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_predict_internal_error_is_500():
    class BoomService:
        def predict(self, features):
            raise RuntimeError("boom")

    app.dependency_overrides[get_service] = BoomService
    try:
        with TestClient(app, raise_server_exceptions=False) as c:
            resp = c.post("/api/v1/predict", json=GOLDEN_BENIGN_A)
    finally:
        app.dependency_overrides.clear()
    assert resp.status_code == 500
    assert resp.json() == {"detail": "internal-server-error"}


def test_cors_origin_regex_returns_none_when_unset(monkeypatch):
    monkeypatch.delenv("CORS_ORIGIN_REGEX", raising=False)
    assert cors_origin_regex() is None


def test_cors_origin_regex_returns_regex_when_set(monkeypatch):
    monkeypatch.setenv("CORS_ORIGIN_REGEX", "https://.*\\.vercel\\.app")
    assert cors_origin_regex() == "https://.*\\.vercel\\.app"


def test_cors_origin_regex_strips_whitespace(monkeypatch):
    monkeypatch.setenv("CORS_ORIGIN_REGEX", "  https://.*\\.vercel\\.app  ")
    assert cors_origin_regex() == "https://.*\\.vercel\\.app"