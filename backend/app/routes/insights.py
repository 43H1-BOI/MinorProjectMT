from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models.schemas import InsightsResponse
from app.services.data_service import DataService
import pandas as pd
import numpy as np
from io import BytesIO, StringIO
from typing import Dict, Any

router = APIRouter()
data_service = DataService()

@router.get("/summary", response_model=InsightsResponse)
async def get_insights_summary():
    """Get HR insights summary"""
    try:
        data = data_service.get_data()
        
        # Detect salary column (usually named 'Salary' or last numeric column)
        numeric_cols = data.select_dtypes(include=[np.number]).columns.tolist()
        salary_col = 'Salary' if 'Salary' in numeric_cols else numeric_cols[-1]
        experience_col = 'Experience' if 'Experience' in data.columns else numeric_cols[0]
        
        # Calculate statistics
        average_salary = float(data[salary_col].mean())
        median_salary = float(data[salary_col].median())
        
        # Salary by experience brackets
        if experience_col in data.columns:
            # Create experience brackets
            data['exp_bracket'] = pd.cut(
                data[experience_col], 
                bins=[0, 2, 5, 10, 20, 100],
                labels=['0-2 years', '2-5 years', '5-10 years', '10-20 years', '20+ years']
            )
            salary_by_exp = data.groupby('exp_bracket', observed=True)[salary_col].mean().to_dict()
            salary_by_exp = {str(k): float(v) for k, v in salary_by_exp.items()}
        else:
            salary_by_exp = {}
        
        # Percentiles
        percentiles = {
            "25th": float(data[salary_col].quantile(0.25)),
            "50th": float(data[salary_col].quantile(0.50)),
            "75th": float(data[salary_col].quantile(0.75)),
            "90th": float(data[salary_col].quantile(0.90))
        }
        
        return InsightsResponse(
            average_salary=average_salary,
            median_salary=median_salary,
            salary_by_experience=salary_by_exp,
            percentiles=percentiles,
            total_employees=len(data)
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating insights: {str(e)}")

@router.get("/benchmark")
async def get_salary_benchmark(experience: float):
    """Get salary benchmark for a given experience level"""
    try:
        data = data_service.get_data()
        
        # Detect columns
        numeric_cols = data.select_dtypes(include=[np.number]).columns.tolist()
        salary_col = 'Salary' if 'Salary' in numeric_cols else numeric_cols[-1]
        experience_col = 'Experience' if 'Experience' in data.columns else numeric_cols[0]
        
        # Filter data for similar experience (±1 year)
        similar_exp_data = data[
            (data[experience_col] >= experience - 1) & 
            (data[experience_col] <= experience + 1)
        ]
        
        if len(similar_exp_data) == 0:
            # Fall back to all data
            similar_exp_data = data
        
        benchmark = {
            "experience": experience,
            "average_salary": float(similar_exp_data[salary_col].mean()),
            "median_salary": float(similar_exp_data[salary_col].median()),
            "min_salary": float(similar_exp_data[salary_col].min()),
            "max_salary": float(similar_exp_data[salary_col].max()),
            "sample_size": len(similar_exp_data)
        }
        
        return benchmark
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting benchmark: {str(e)}")

@router.get("/export/csv")
async def export_report_csv():
    """Export insights report as CSV"""
    try:
        data = data_service.get_data()
        
        # Create summary statistics
        numeric_data = data.select_dtypes(include=[np.number])
        summary = numeric_data.describe()
        
        # Convert to CSV
        output = StringIO()
        summary.to_csv(output)
        output.seek(0)
        
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=salary_insights.csv"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting report: {str(e)}")

@router.get("/export/excel")
async def export_report_excel():
    """Export insights report as Excel"""
    try:
        data = data_service.get_data()
        
        # Create summary statistics
        numeric_data = data.select_dtypes(include=[np.number])
        summary = numeric_data.describe()
        
        # Convert to Excel
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            summary.to_excel(writer, sheet_name='Summary Statistics')
            data.to_excel(writer, sheet_name='Data', index=False)
        
        output.seek(0)
        
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=salary_insights.xlsx"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting report: {str(e)}")
