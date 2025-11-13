# Quick Start Guide

## Running with Docker (Recommended - 5 minutes)

1. **Prerequisites**
   - Docker and Docker Compose installed
   - 2GB free disk space

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

4. **Stop the application**
   ```bash
   docker-compose down
   ```

## Running Manually (Development)

### Backend (Terminal 1)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on: http://localhost:8000

### Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

## Using the Application

### Step 1: Upload Data
1. Click on "Upload Data" tab
2. Drag and drop `backend/sample_data.csv` or click to browse
3. Click "Upload and Process"
4. View data preview and statistics

### Step 2: Visualize Data
1. Click "Visualize" tab
2. View scatter plots, box plots, histograms, and correlation heatmap

### Step 3: Train Model
1. Click "Train Model" tab
2. Select algorithm:
   - **Linear Regression**: Fast, simple (R² ≈ 0.90)
   - **Random Forest**: Best accuracy (R² ≈ 0.88)
   - **XGBoost**: Good balance (R² ≈ 0.80)
3. Adjust test size (default 20%)
4. Click "Train Model"
5. View metrics: R², MAE, RMSE, and feature importance

### Step 4: Make Predictions
1. Click "Predict" tab
2. **Single Prediction**:
   - Enter years of experience (e.g., 5.5)
   - Click "Predict Salary"
3. **Batch Prediction**:
   - Enter comma-separated values (e.g., 1, 3, 5, 10)
   - Click "Predict Salaries"

### Step 5: View Insights
1. Click "Insights" tab
2. View:
   - Average and median salaries
   - Salary percentiles (25th, 50th, 75th, 90th)
   - Salary by experience brackets
3. Get salary benchmark for specific experience level
4. Export reports (CSV/Excel) or download trained model

## Sample Predictions

With the sample data and Random Forest model:

| Experience (years) | Predicted Salary |
|-------------------|------------------|
| 1.0               | $39,471          |
| 3.0               | $60,109          |
| 5.0               | $61,115          |
| 10.0              | $116,933         |

## Troubleshooting

### Backend won't start
- Check if port 8000 is available
- Verify all dependencies are installed
- Check Python version (3.11+ required)

### Frontend won't start
- Check if port 5173 is available
- Run `npm install` to ensure all packages are installed
- Clear browser cache

### CORS errors
- Verify backend is running on port 8000
- Check ALLOWED_ORIGINS in backend/.env

### File upload fails
- Ensure file is CSV format
- Check file size is under 10MB
- Verify file has 'Experience' and 'Salary' columns

## API Testing

Run the automated test suite:

```bash
chmod +x test_api.sh
./test_api.sh
```

This tests all major endpoints and validates model performance.

## Production Deployment

For production deployment with Docker:

1. Update environment variables:
   - Set `DEBUG=False` in backend
   - Update `ALLOWED_ORIGINS` with your domain
   - Update `VITE_API_URL` in frontend

2. Build and deploy:
   ```bash
   docker-compose up -d --build
   ```

3. Use a reverse proxy (nginx/Apache) for SSL and domain configuration

## Support

For issues or questions:
- Check the main README.md for detailed documentation
- Review API docs at http://localhost:8000/docs
- Test with the provided sample_data.csv first
