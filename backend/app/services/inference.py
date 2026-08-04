import threading
import warnings

import joblib
import numpy as np

from app.constants import FEATURE_KEYS, LABEL_MAP, MODEL_PATH, SCALER_PATH
from app.schemas.predict import PredictResponse


class InferenceService:
    """Loads scaler + model once and exposes predict(features) -> PredictResponse."""

    def __init__(self) -> None:
        self._scaler = None
        self._model = None
        self._lock = threading.Lock()

    def load(self) -> None:
        """Idempotent, thread-safe model/scaler load. Fails fast on artifact mismatch."""
        if self._model is not None:
            return
        with self._lock:
            if self._model is not None:
                return
            scaler = joblib.load(SCALER_PATH)
            model = joblib.load(MODEL_PATH)
            if model.n_features_in_ != 22 or scaler.n_features_in_ != 22:
                raise RuntimeError(
                    f"artifact feature count mismatch: model={model.n_features_in_}, "
                    f"scaler={scaler.n_features_in_}"
                )
            if hasattr(scaler, "feature_names_in_") and list(scaler.feature_names_in_) != FEATURE_KEYS:
                raise RuntimeError("scaler feature order does not match FEATURE_KEYS")
            self._scaler = scaler
            self._model = model

    def predict(self, features: dict) -> PredictResponse:
        self.load()
        row = np.array([[features[key] for key in FEATURE_KEYS]], dtype=float)
        with warnings.catch_warnings():
            warnings.filterwarnings(
                "ignore",
                message="X does not have valid feature names",
                category=UserWarning,
            )
            scaled = self._scaler.transform(row)
            label_idx = int(self._model.predict(scaled)[0])
            proba = self._model.predict_proba(scaled)[0]
        return PredictResponse(
            prediction=LABEL_MAP[label_idx],
            probability={
                "benign": round(float(proba[0]) * 100, 1),
                "malignant": round(float(proba[1]) * 100, 1),
            },
        )
