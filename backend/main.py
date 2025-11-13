from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

from app.routes import upload, visualization, model, prediction, insights

load_dotenv()

app = FastAPI(
    title="Employee Salary Prediction API",
    description="API for predicting employee salaries using machine learning",
    version="1.0.0"
)

# CORS Configuration
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create necessary directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("temp", exist_ok=True)
os.makedirs("models", exist_ok=True)

# Include routers
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(visualization.router, prefix="/api/visualization", tags=["Visualization"])
app.include_router(model.router, prefix="/api/model", tags=["Model"])
app.include_router(prediction.router, prefix="/api/prediction", tags=["Prediction"])
app.include_router(insights.router, prefix="/api/insights", tags=["Insights"])

@app.get("/")
async def root():
    return {
        "message": "Employee Salary Prediction API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
