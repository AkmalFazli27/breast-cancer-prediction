from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, create_model

from app.constants import FEATURE_BOUNDS

_fields = {
    key: (float, Field(ge=lo, le=hi))
    for key, (lo, hi) in FEATURE_BOUNDS.items()
}

PredictRequest = create_model(
    "PredictRequest",
    __config__=ConfigDict(extra="forbid"),
    **_fields,
)


class Probabilities(BaseModel):
    benign: float
    malignant: float


class PredictResponse(BaseModel):
    prediction: Literal["Benign", "Malignant"]
    probability: Probabilities
