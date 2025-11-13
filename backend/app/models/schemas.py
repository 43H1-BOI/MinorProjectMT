from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class DataUploadResponse(BaseModel):
    message: str
    filename: str
    rows: int
    columns: int
    column_names: List[str]
    preview: List[Dict[str, Any]]
    
class DataStats(BaseModel):
    total_rows: int
    total_columns: int
    missing_values: Dict[str, int]
    numeric_columns: List[str]
    categorical_columns: List[str]
    
class ModelTrainRequest(BaseModel):
    algorithm: str = Field(..., description="Algorithm to use: linear, random_forest, or xgboost")
    test_size: float = Field(0.2, ge=0.1, le=0.5, description="Test set size (0.1 to 0.5)")
    
class ModelMetrics(BaseModel):
    r2_score: float
    mae: float
    rmse: float
    mse: float
    
class ModelTrainResponse(BaseModel):
    message: str
    algorithm: str
    metrics: ModelMetrics
    training_time: float
    feature_importance: Optional[Dict[str, float]] = None
    
class PredictionRequest(BaseModel):
    experience: float = Field(..., ge=0, description="Years of experience")
    
class BatchPredictionRequest(BaseModel):
    predictions: List[PredictionRequest]
    
class PredictionResponse(BaseModel):
    experience: float
    predicted_salary: float
    
class BatchPredictionResponse(BaseModel):
    predictions: List[PredictionResponse]
    
class InsightsResponse(BaseModel):
    average_salary: float
    median_salary: float
    salary_by_experience: Dict[str, float]
    percentiles: Dict[str, float]
    total_employees: int
