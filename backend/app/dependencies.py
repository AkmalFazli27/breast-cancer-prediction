from app.services.inference import InferenceService

_service = InferenceService()


def get_service() -> InferenceService:
    """FastAPI dependency; override in tests via app.dependency_overrides."""
    return _service
