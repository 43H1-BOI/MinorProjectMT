from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.schemas import DataUploadResponse, DataStats
from app.services.data_service import DataService
import os
import shutil
from typing import List, Dict, Any

router = APIRouter()
data_service = DataService()

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

@router.post("/csv", response_model=DataUploadResponse)
async def upload_csv(file: UploadFile = File(...)):
    """Upload and process a CSV file"""
    
    # Validate file type
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    # Validate file size
    file.file.seek(0, 2)  # Move to end of file
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File size exceeds {MAX_FILE_SIZE} bytes")
    
    # Save uploaded file
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, file.filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Load and process data
        df = data_service.load_data(file_path)
        
        # Clean data
        df = data_service.clean_data()
        
        # Get preview
        preview = data_service.get_preview(5)
        
        return DataUploadResponse(
            message="File uploaded and processed successfully",
            filename=file.filename,
            rows=len(df),
            columns=len(df.columns),
            column_names=df.columns.tolist(),
            preview=preview
        )
    
    except Exception as e:
        # Clean up file on error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@router.get("/stats", response_model=DataStats)
async def get_data_stats():
    """Get statistics about the uploaded data"""
    try:
        stats = data_service.get_stats()
        return DataStats(**stats)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")

@router.get("/preview")
async def get_data_preview(rows: int = 10):
    """Get a preview of the uploaded data"""
    try:
        preview = data_service.get_preview(rows)
        return {"preview": preview, "count": len(preview)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting preview: {str(e)}")
