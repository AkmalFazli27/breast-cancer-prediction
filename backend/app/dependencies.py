from app.services.inference import InferenceService

_service = InferenceService()


def get_service() -> InferenceService:
    # FastAPI dependency
    return _service
