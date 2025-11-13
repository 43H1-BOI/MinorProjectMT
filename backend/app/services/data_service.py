import pandas as pd
import numpy as np
from typing import Dict, List, Any, Tuple
import os

class DataService:
    """Service for handling data operations"""
    
    _instance = None
    _data = None
    _original_data = None
    _filename = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DataService, cls).__new__(cls)
        return cls._instance
    
    def load_data(self, filepath: str) -> pd.DataFrame:
        """Load data from CSV file"""
        try:
            self._filename = os.path.basename(filepath)
            df = pd.read_csv(filepath)
            self._original_data = df.copy()
            self._data = df.copy()
            return df
        except Exception as e:
            raise ValueError(f"Error loading data: {str(e)}")
    
    def clean_data(self) -> pd.DataFrame:
        """Clean the data by handling missing values and outliers"""
        if self._data is None:
            raise ValueError("No data loaded")
        
        df = self._data.copy()
        
        # Handle missing values
        numeric_columns = df.select_dtypes(include=[np.number]).columns
        for col in numeric_columns:
            if df[col].isnull().any():
                df[col].fillna(df[col].median(), inplace=True)
        
        # Remove rows with any remaining missing values
        df.dropna(inplace=True)
        
        # Remove outliers using IQR method for numeric columns
        for col in numeric_columns:
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            df = df[(df[col] >= lower_bound) & (df[col] <= upper_bound)]
        
        self._data = df
        return df
    
    def get_data(self) -> pd.DataFrame:
        """Get the current data"""
        if self._data is None:
            raise ValueError("No data loaded")
        return self._data.copy()
    
    def get_original_data(self) -> pd.DataFrame:
        """Get the original unmodified data"""
        if self._original_data is None:
            raise ValueError("No data loaded")
        return self._original_data.copy()
    
    def get_stats(self) -> Dict[str, Any]:
        """Get statistics about the data"""
        if self._data is None:
            raise ValueError("No data loaded")
        
        df = self._data
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()
        
        missing_values = df.isnull().sum().to_dict()
        
        return {
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "missing_values": missing_values,
            "numeric_columns": numeric_cols,
            "categorical_columns": categorical_cols
        }
    
    def get_preview(self, rows: int = 5) -> List[Dict[str, Any]]:
        """Get a preview of the data"""
        if self._data is None:
            raise ValueError("No data loaded")
        
        preview_df = self._data.head(rows)
        return preview_df.to_dict(orient='records')
    
    def get_column_names(self) -> List[str]:
        """Get column names"""
        if self._data is None:
            raise ValueError("No data loaded")
        return self._data.columns.tolist()
    
    def prepare_features(self, target_column: str = 'Salary') -> Tuple[pd.DataFrame, pd.Series]:
        """Prepare features and target for ML"""
        if self._data is None:
            raise ValueError("No data loaded")
        
        df = self._data.copy()
        
        # Identify feature columns (all numeric columns except target)
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        
        if target_column not in numeric_cols:
            raise ValueError(f"Target column '{target_column}' not found or not numeric")
        
        feature_cols = [col for col in numeric_cols if col != target_column]
        
        if not feature_cols:
            # If no other numeric columns, look for 'Experience' or similar
            if 'Experience' in df.columns:
                feature_cols = ['Experience']
            else:
                raise ValueError("No suitable feature columns found")
        
        X = df[feature_cols]
        y = df[target_column]
        
        return X, y
    
    def reset_data(self):
        """Reset data to original state"""
        if self._original_data is not None:
            self._data = self._original_data.copy()
