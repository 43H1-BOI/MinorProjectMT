# Employee Salary Prediction Web Application

A full-stack web application for predicting employee salaries using machine learning. Built with FastAPI backend and React frontend.

## Features

### Data Management
- **CSV Upload**: Drag-and-drop or browse to upload salary data
- **Data Cleaning**: Automatic handling of missing values and outliers
- **Data Preview**: View uploaded data with statistics

### Visualizations
- **Scatter Plot**: Visualize salary vs experience
- **Box Plot**: Identify salary distribution and outliers
- **Heatmap**: Correlation analysis between features
- **Histogram**: Distribution of salary data

### Machine Learning
- **Multiple Algorithms**: 
  - Linear Regression
  - Random Forest
  - XGBoost
- **Model Metrics**: R², MAE, RMSE, MSE
- **Feature Importance**: Understand which features matter most
- **Target Accuracy**: R² > 0.85

### Predictions
- **Single Prediction**: Predict salary for individual experience
- **Batch Prediction**: Process multiple predictions at once
- **Real-time Results**: Instant predictions from trained models

### HR Insights
- **Salary Statistics**: Average, median, percentiles
- **Benchmark Analysis**: Compare salaries by experience level
- **Experience Brackets**: Salary trends across career stages
- **Report Export**: Download insights in CSV/Excel format
- **Model Export**: Save trained models for later use

### Security & Performance
- **Input Validation**: File size limits and type checking
- **Error Handling**: Comprehensive error messages
- **Fast API**: Optimized endpoints for quick responses
- **Responsive Design**: Mobile-friendly interface
- **CORS Support**: Secure cross-origin requests

## Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework
- **Python 3.11**: Latest Python features
- **scikit-learn**: Linear Regression, Random Forest
- **XGBoost**: Gradient boosting
- **Pandas**: Data manipulation
- **Matplotlib/Seaborn**: Visualizations
- **Pydantic**: Data validation

### Frontend
- **React**: UI library
- **Vite**: Fast build tool
- **Axios**: HTTP client
- **Tailwind CSS**: Styling framework
- **Recharts**: Chart library (optional)

### Deployment
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Frontend web server

## Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MinorProjectMT
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend**
   ```bash
   uvicorn main:app --reload
   ```
   Backend will run on http://localhost:8000

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:5173

## Usage Guide

### 1. Upload Data
- Click "Upload Data" tab
- Drag and drop or select a CSV file
- File should contain at least two columns: Experience and Salary
- Sample format:
  ```csv
  Experience,Salary
  1.1,39343
  1.3,46205
  2.0,43525
  ```

### 2. Visualize Data
- After upload, click "Visualize" tab
- View scatter plots, box plots, histograms, and heatmaps
- Understand data distribution and relationships

### 3. Train Model
- Click "Train Model" tab
- Select algorithm (Linear Regression, Random Forest, or XGBoost)
- Adjust test size (10-50%)
- Click "Train Model" button
- View metrics: R², MAE, RMSE
- See feature importance

### 4. Make Predictions
- After training, click "Predict" tab
- **Single Prediction**: Enter years of experience
- **Batch Prediction**: Enter comma-separated values (e.g., 1, 2.5, 5, 10)
- Get instant salary predictions

### 5. View Insights
- Click "Insights" tab
- View average and median salaries
- See salary percentiles
- Check salary by experience brackets
- Get benchmark for specific experience levels
- Export reports and models

## Sample Data

A sample dataset is provided in `backend/sample_data.csv` with 30 records of experience and salary data.

## API Endpoints

### Upload
- `POST /api/upload/csv` - Upload CSV file
- `GET /api/upload/stats` - Get data statistics
- `GET /api/upload/preview` - Get data preview

### Visualization
- `GET /api/visualization/all` - Get all visualizations
- `GET /api/visualization/scatter` - Get scatter plot
- `GET /api/visualization/boxplot` - Get box plot
- `GET /api/visualization/heatmap` - Get correlation heatmap

### Model
- `POST /api/model/train` - Train ML model
- `GET /api/model/info` - Get model information
- `GET /api/model/metrics` - Get model metrics
- `GET /api/model/download` - Download trained model
- `GET /api/model/algorithms` - List available algorithms

### Prediction
- `POST /api/prediction/single` - Single prediction
- `POST /api/prediction/batch` - Batch predictions

### Insights
- `GET /api/insights/summary` - Get insights summary
- `GET /api/insights/benchmark` - Get salary benchmark
- `GET /api/insights/export/csv` - Export report as CSV
- `GET /api/insights/export/excel` - Export report as Excel

## Configuration

### Backend (.env)
```
HOST=0.0.0.0
PORT=8000
DEBUG=True
MAX_UPLOAD_SIZE=10485760
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

## Project Structure

```
MinorProjectMT/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   └── schemas.py
│   │   ├── routes/
│   │   │   ├── upload.py
│   │   │   ├── visualization.py
│   │   │   ├── model.py
│   │   │   ├── prediction.py
│   │   │   └── insights.py
│   │   ├── services/
│   │   │   ├── data_service.py
│   │   │   ├── model_service.py
│   │   │   └── visualization_service.py
│   │   └── utils/
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── sample_data.csv
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.jsx
│   │   │   ├── DataPreview.jsx
│   │   │   ├── Visualizations.jsx
│   │   │   ├── ModelTraining.jsx
│   │   │   ├── Prediction.jsx
│   │   │   └── Insights.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Development

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Build for Production
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
npm run build
```

## Testing

To test the application:

1. Upload the sample CSV file (`backend/sample_data.csv`)
2. Train a model using XGBoost
3. Verify R² score > 0.85
4. Make predictions for various experience levels
5. Export reports and models

## Troubleshooting

### Backend Issues
- **Port 8000 already in use**: Change PORT in .env or stop other services
- **Module not found**: Ensure all dependencies are installed with `pip install -r requirements.txt`
- **CORS errors**: Check ALLOWED_ORIGINS in .env

### Frontend Issues
- **API connection failed**: Verify backend is running and VITE_API_URL is correct
- **Build errors**: Delete node_modules and run `npm install` again
- **Port 5173 in use**: Vite will automatically use next available port

## License

This project is created for educational purposes.

## Author

Manish Tiwari - Minor Project

## Acknowledgments

- FastAPI for excellent API framework
- React and Vite for modern frontend tools
- scikit-learn and XGBoost for ML capabilities
- Tailwind CSS for beautiful styling
