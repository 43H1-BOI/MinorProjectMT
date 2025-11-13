import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import joblib
import time
from typing import Dict, Any, Tuple, Optional
import os

class ModelService:
    """Service for handling ML model operations"""
    
    _instance = None
    _model = None
    _model_type = None
    _feature_names = None
    _metrics = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelService, cls).__new__(cls)
        return cls._instance
    
    def train_model(self, X: pd.DataFrame, y: pd.Series, algorithm: str, test_size: float = 0.2) -> Dict[str, Any]:
        """Train a machine learning model"""
        
        # Store feature names
        self._feature_names = X.columns.tolist()
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42
        )
        
        # Select and train model
        start_time = time.time()
        
        if algorithm == "linear":
            model = LinearRegression()
        elif algorithm == "random_forest":
            model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                n_jobs=-1
            )
        elif algorithm == "xgboost":
            model = XGBRegressor(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                random_state=42,
                n_jobs=-1
            )
        else:
            raise ValueError(f"Unknown algorithm: {algorithm}")
        
        # Train the model
        model.fit(X_train, y_train)
        
        training_time = time.time() - start_time
        
        # Make predictions
        y_pred = model.predict(X_test)
        
        # Calculate metrics
        metrics = {
            "r2_score": float(r2_score(y_test, y_pred)),
            "mae": float(mean_absolute_error(y_test, y_pred)),
            "rmse": float(np.sqrt(mean_squared_error(y_test, y_pred))),
            "mse": float(mean_squared_error(y_test, y_pred))
        }
        
        # Get feature importance if available
        feature_importance = None
        if hasattr(model, 'feature_importances_'):
            importance_dict = {}
            for idx, importance in enumerate(model.feature_importances_):
                importance_dict[self._feature_names[idx]] = float(importance)
            feature_importance = importance_dict
        elif hasattr(model, 'coef_'):
            importance_dict = {}
            for idx, coef in enumerate(model.coef_):
                importance_dict[self._feature_names[idx]] = float(abs(coef))
            feature_importance = importance_dict
        
        # Store model and metrics
        self._model = model
        self._model_type = algorithm
        self._metrics = metrics
        
        return {
            "message": "Model trained successfully",
            "algorithm": algorithm,
            "metrics": metrics,
            "training_time": training_time,
            "feature_importance": feature_importance
        }
    
    def predict(self, features: Dict[str, float]) -> float:
        """Make a single prediction"""
        if self._model is None:
            raise ValueError("No model trained")
        
        # Create DataFrame with correct feature order
        X = pd.DataFrame([features])[self._feature_names]
        prediction = self._model.predict(X)
        
        return float(prediction[0])
    
    def predict_batch(self, features_list: list) -> list:
        """Make batch predictions"""
        if self._model is None:
            raise ValueError("No model trained")
        
        # Create DataFrame with correct feature order
        X = pd.DataFrame(features_list)[self._feature_names]
        predictions = self._model.predict(X)
        
        return [float(pred) for pred in predictions]
    
    def save_model(self, filepath: str = "models/salary_model.pkl"):
        """Save the trained model"""
        if self._model is None:
            raise ValueError("No model trained")
        
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        model_data = {
            "model": self._model,
            "model_type": self._model_type,
            "feature_names": self._feature_names,
            "metrics": self._metrics
        }
        
        joblib.dump(model_data, filepath)
        return filepath
    
    def load_model(self, filepath: str = "models/salary_model.pkl"):
        """Load a trained model"""
        if not os.path.exists(filepath):
            raise ValueError(f"Model file not found: {filepath}")
        
        model_data = joblib.load(filepath)
        
        self._model = model_data["model"]
        self._model_type = model_data["model_type"]
        self._feature_names = model_data["feature_names"]
        self._metrics = model_data.get("metrics")
        
        return True
    
    def get_metrics(self) -> Optional[Dict[str, float]]:
        """Get current model metrics"""
        return self._metrics
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the current model"""
        if self._model is None:
            return {"status": "no_model"}
        
        return {
            "status": "trained",
            "model_type": self._model_type,
            "feature_names": self._feature_names,
            "metrics": self._metrics
        }
