from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    PredictionRequest, 
    PredictionResponse,
    BatchPredictionRequest,
    BatchPredictionResponse
)
from app.services.model_service import ModelService

router = APIRouter()
model_service = ModelService()

@router.post("/single", response_model=PredictionResponse)
async def predict_single(request: PredictionRequest):
    """Make a single salary prediction"""
    try:
        # Create feature dict - assuming Experience is the main feature
        features = {"Experience": request.experience}
        
        # Make prediction
        predicted_salary = model_service.predict(features)
        
        return PredictionResponse(
            experience=request.experience,
            predicted_salary=predicted_salary
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error making prediction: {str(e)}")

@router.post("/batch", response_model=BatchPredictionResponse)
async def predict_batch(request: BatchPredictionRequest):
    """Make batch salary predictions"""
    try:
        # Prepare features
        features_list = [{"Experience": pred.experience} for pred in request.predictions]
        
        # Make predictions
        predicted_salaries = model_service.predict_batch(features_list)
        
        # Prepare response
        predictions = [
            PredictionResponse(
                experience=request.predictions[i].experience,
                predicted_salary=predicted_salaries[i]
            )
            for i in range(len(predicted_salaries))
        ]
        
        return BatchPredictionResponse(predictions=predictions)
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error making batch predictions: {str(e)}")
