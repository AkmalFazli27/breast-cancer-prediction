# Backend — Breast Cancer Prediction API

FastAPI inference service wrapping the trained Logistic Regression model
(`models/final_model_logistic_regression.pkl`) and scaler (`models/scaler.pkl`)
from the repo root. Never retrain.

## Run (always from `backend/`)

The package is named `app`, which collides with the legacy Streamlit `app/`
folder at the repo root — run every command from this directory.

```powershell
uv sync
uv run uvicorn app.main:app --reload
```

## Test

```powershell
uv run pytest
```

## API

- `POST /api/v1/predict` — body: the 22 model feature keys (spaces preserved,
  e.g. `concave points_worst`). Returns `{prediction, probability:{benign, malignant}}`.
- `GET /health` — `{"status": "ok"}`.

CORS origins come from the `CORS_ORIGINS` env var (comma-separated);
default `http://localhost:5173`.
