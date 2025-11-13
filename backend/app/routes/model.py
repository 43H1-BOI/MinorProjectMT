from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.models.schemas import ModelTrainRequest, ModelTrainResponse, ModelMetrics
from app.services.data_service import DataService
from app.services.model_service import ModelService
import os

router = APIRouter()
data_service = DataService()
model_service = ModelService()

@router.post("/train", response_model=ModelTrainResponse)
async def train_model(request: ModelTrainRequest):
    """Train a machine learning model"""
    try:
        # Get prepared data
        X, y = data_service.prepare_features()
        
        # Train model
        result = model_service.train_model(
            X, y, 
            algorithm=request.algorithm,
            test_size=request.test_size
        )
        
        # Save model
        model_service.save_model()
        
        return ModelTrainResponse(**result)
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error training model: {str(e)}")

@router.get("/info")
async def get_model_info():
    """Get information about the current model"""
    try:
        info = model_service.get_model_info()
        return info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting model info: {str(e)}")

@router.get("/metrics")
async def get_model_metrics():
    """Get current model metrics"""
    try:
        metrics = model_service.get_metrics()
        if metrics is None:
            raise HTTPException(status_code=400, detail="No model trained yet")
        return {"metrics": metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting metrics: {str(e)}")

@router.get("/download")
async def download_model():
    """Download the trained model"""
    try:
        model_path = "models/salary_model.pkl"
        if not os.path.exists(model_path):
            raise HTTPException(status_code=404, detail="No trained model found")
        
        return FileResponse(
            model_path,
            media_type="application/octet-stream",
            filename="salary_model.pkl"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error downloading model: {str(e)}")

@router.get("/algorithms")
async def get_available_algorithms():
    """Get list of available algorithms"""
    return {
        "algorithms": [
            {
                "id": "linear",
                "name": "Linear Regression",
                "description": "Simple linear regression model"
            },
            {
                "id": "random_forest",
                "name": "Random Forest",
                "description": "Ensemble learning method using decision trees"
            },
            {
                "id": "xgboost",
                "name": "XGBoost",
                "description": "Gradient boosting framework"
            }
        ]
    }
