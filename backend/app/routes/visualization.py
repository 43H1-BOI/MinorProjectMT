from fastapi import APIRouter, HTTPException
from app.services.data_service import DataService
from app.services.visualization_service import VisualizationService
from typing import Dict

router = APIRouter()
data_service = DataService()
viz_service = VisualizationService()

@router.get("/all")
async def get_all_visualizations():
    """Get all visualizations for the uploaded data"""
    try:
        data = data_service.get_data()
        visualizations = viz_service.create_all_visualizations(data)
        
        return {
            "message": "Visualizations created successfully",
            "visualizations": visualizations
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating visualizations: {str(e)}")

@router.get("/scatter")
async def get_scatter_plot(x_column: str = None, y_column: str = None):
    """Get scatter plot"""
    try:
        data = data_service.get_data()
        
        # Auto-detect columns if not provided
        numeric_cols = data.select_dtypes(include=['number']).columns.tolist()
        
        if not x_column and len(numeric_cols) > 0:
            x_column = numeric_cols[0]
        if not y_column and len(numeric_cols) > 1:
            y_column = numeric_cols[1]
        
        if not x_column or not y_column:
            raise ValueError("Not enough numeric columns for scatter plot")
        
        image = viz_service.create_scatter_plot(data, x_column, y_column)
        
        return {
            "image": image,
            "x_column": x_column,
            "y_column": y_column
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating scatter plot: {str(e)}")

@router.get("/boxplot")
async def get_box_plot(column: str = None):
    """Get box plot"""
    try:
        data = data_service.get_data()
        
        # Auto-detect column if not provided
        if not column:
            numeric_cols = data.select_dtypes(include=['number']).columns.tolist()
            if len(numeric_cols) > 0:
                column = numeric_cols[-1]  # Use last numeric column (likely target)
            else:
                raise ValueError("No numeric columns found")
        
        image = viz_service.create_box_plot(data, column)
        
        return {
            "image": image,
            "column": column
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating box plot: {str(e)}")

@router.get("/heatmap")
async def get_heatmap():
    """Get correlation heatmap"""
    try:
        data = data_service.get_data()
        image = viz_service.create_heatmap(data)
        
        return {
            "image": image
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating heatmap: {str(e)}")

@router.get("/histogram")
async def get_histogram(column: str = None, bins: int = 30):
    """Get histogram"""
    try:
        data = data_service.get_data()
        
        # Auto-detect column if not provided
        if not column:
            numeric_cols = data.select_dtypes(include=['number']).columns.tolist()
            if len(numeric_cols) > 0:
                column = numeric_cols[-1]  # Use last numeric column (likely target)
            else:
                raise ValueError("No numeric columns found")
        
        image = viz_service.create_histogram(data, column, bins)
        
        return {
            "image": image,
            "column": column,
            "bins": bins
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating histogram: {str(e)}")
