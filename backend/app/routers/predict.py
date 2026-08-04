from fastapi import APIRouter, Depends

from app.dependencies import get_service
from app.schemas.predict import PredictRequest, PredictResponse
from app.services.inference import InferenceService

router = APIRouter()


@router.post("/api/v1/predict", response_model=PredictResponse)
def predict(
    payload: PredictRequest,
    service: InferenceService = Depends(get_service),
) -> PredictResponse:
    return service.predict(payload.model_dump())


@router.get("/health")
def health() -> dict:
    return {"status": "ok"}
