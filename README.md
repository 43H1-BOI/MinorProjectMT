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

## Installation Guide

### Prerequisites by Operating System

<details>
<summary><b>🪟 Windows 10/11</b></summary>

#### Required Software

1. **Python 3.11 or higher**
   - Download from [python.org](https://www.python.org/downloads/)
   - During installation, check "Add Python to PATH"
   - Verify: `python --version` in Command Prompt

2. **Node.js 18+ and npm**
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version` and `npm --version`

3. **Git**
   - Download from [git-scm.com](https://git-scm.com/download/win)
   - Verify: `git --version`

4. **Docker Desktop (Optional, for Docker setup)**
   - Download from [docker.com](https://www.docker.com/products/docker-desktop)
   - Enable WSL 2 backend during installation
   - Verify: `docker --version` and `docker-compose --version`

#### Windows-Specific Notes
- Use **Command Prompt** or **PowerShell** (Run as Administrator if needed)
- For virtual environment activation: `venv\Scripts\activate`
- If you get "execution policy" errors in PowerShell, run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

</details>

<details>
<summary><b>🐧 Linux (Ubuntu/Debian/Fedora)</b></summary>

#### Required Software

1. **Python 3.11 or higher**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install python3.11 python3.11-venv python3-pip
   
   # Fedora
   sudo dnf install python3.11 python3-pip
   ```
   Verify: `python3 --version`

2. **Node.js 18+ and npm**
   ```bash
   # Ubuntu/Debian - Using NodeSource
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Fedora
   sudo dnf install nodejs npm
   ```
   Verify: `node --version` and `npm --version`

3. **Git**
   ```bash
   # Ubuntu/Debian
   sudo apt install git
   
   # Fedora
   sudo dnf install git
   ```
   Verify: `git --version`

4. **Docker and Docker Compose (Optional)**
   ```bash
   # Ubuntu/Debian
   sudo apt install docker.io docker-compose
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -aG docker $USER  # Add user to docker group
   
   # Fedora
   sudo dnf install docker docker-compose
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -aG docker $USER
   ```
   **Note**: Log out and back in for group changes to take effect
   Verify: `docker --version` and `docker-compose --version`

#### Linux-Specific Notes
- Use `python3` instead of `python` command
- Use `pip3` instead of `pip` command
- For virtual environment activation: `source venv/bin/activate`
- May need `sudo` for system-wide package installations

</details>

<details>
<summary><b>🍎 macOS</b></summary>

#### Required Software

1. **Homebrew (Package Manager)**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Python 3.11 or higher**
   ```bash
   brew install python@3.11
   ```
   Verify: `python3 --version`

3. **Node.js 18+ and npm**
   ```bash
   brew install node@18
   ```
   Verify: `node --version` and `npm --version`

4. **Git**
   ```bash
   brew install git
   ```
   Verify: `git --version`

5. **Docker Desktop (Optional)**
   - Download from [docker.com](https://www.docker.com/products/docker-desktop)
   - Or install via Homebrew: `brew install --cask docker`
   - Verify: `docker --version` and `docker-compose --version`

#### macOS-Specific Notes
- Use `python3` command (not `python`)
- Use `pip3` command (not `pip`)
- For virtual environment activation: `source venv/bin/activate`
- Xcode Command Line Tools may be required: `xcode-select --install`

</details>

---

## Quick Start

### Option 1: Using Docker (Recommended - All Platforms)

Docker provides the easiest setup experience across all platforms.

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

4. **Stop the application**
   ```bash
   docker-compose down
   ```

### Option 2: Manual Setup (Development)

#### Backend Setup

<details>
<summary><b>Windows Setup</b></summary>

1. **Navigate to backend directory**
   ```cmd
   cd backend
   ```

2. **Create virtual environment**
   ```cmd
   python -m venv venv
   ```

3. **Activate virtual environment**
   ```cmd
   venv\Scripts\activate
   ```

4. **Install dependencies**
   ```cmd
   pip install -r requirements.txt
   ```

5. **Run the backend**
   ```cmd
   uvicorn main:app --reload
   ```
   Backend will run on http://localhost:8000

</details>

<details>
<summary><b>Linux/macOS Setup</b></summary>

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   ```

3. **Activate virtual environment**
   ```bash
   source venv/bin/activate
   ```

4. **Install dependencies**
   ```bash
   pip3 install -r requirements.txt
   ```

5. **Run the backend**
   ```bash
   uvicorn main:app --reload
   ```
   Backend will run on http://localhost:8000

</details>

#### Frontend Setup

**All Platforms (Windows/Linux/macOS)**

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

### Common Issues by Platform

<details>
<summary><b>🪟 Windows Issues</b></summary>

#### Backend Issues
- **"python is not recognized"**: Ensure Python is added to PATH during installation, or reinstall Python with "Add to PATH" checked
- **Virtual environment activation fails in PowerShell**: Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- **Port 8000 already in use**: 
  ```cmd
  netstat -ano | findstr :8000
  taskkill /PID <PID> /F
  ```
- **Module not found**: Ensure virtual environment is activated and run `pip install -r requirements.txt`
- **pip install fails**: Try upgrading pip: `python -m pip install --upgrade pip`

#### Frontend Issues
- **"npm is not recognized"**: Restart Command Prompt after Node.js installation
- **EACCES or permission errors**: Run Command Prompt as Administrator
- **Port 5173 in use**: Vite will automatically use next available port

#### Docker Issues
- **Docker Desktop not starting**: Enable WSL 2 in Windows Features, restart computer
- **"docker-compose command not found"**: Use `docker compose` (space, not hyphen) in newer Docker versions
- **Container fails to start**: Check Docker Desktop is running, restart Docker service

</details>

<details>
<summary><b>🐧 Linux Issues</b></summary>

#### Backend Issues
- **"python3: command not found"**: Install Python: `sudo apt install python3.11 python3-pip`
- **pip install fails with permission error**: Don't use sudo with pip, use virtual environment
- **Port 8000 already in use**:
  ```bash
  sudo lsof -i :8000
  kill -9 <PID>
  ```
- **Module not found**: Ensure virtual environment is activated: `source venv/bin/activate`
- **"ensurepip is not available"**: Install venv: `sudo apt install python3.11-venv`

#### Frontend Issues
- **npm permission errors**: Fix npm permissions:
  ```bash
  mkdir ~/.npm-global
  npm config set prefix '~/.npm-global'
  echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
  source ~/.bashrc
  ```
- **"node: command not found"**: Install Node.js from NodeSource or use nvm

#### Docker Issues
- **Permission denied**: Add user to docker group:
  ```bash
  sudo usermod -aG docker $USER
  newgrp docker
  ```
- **Docker daemon not running**: Start docker: `sudo systemctl start docker`
- **Container fails to build**: Check disk space: `df -h`

</details>

<details>
<summary><b>🍎 macOS Issues</b></summary>

#### Backend Issues
- **"python3: command not found"**: Install Python via Homebrew: `brew install python@3.11`
- **SSL certificate errors**: Install certificates:
  ```bash
  /Applications/Python\ 3.11/Install\ Certificates.command
  ```
- **Port 8000 already in use**:
  ```bash
  lsof -i :8000
  kill -9 <PID>
  ```
- **xcrun: error**: Install Xcode Command Line Tools: `xcode-select --install`

#### Frontend Issues
- **npm install fails**: Clear cache: `npm cache clean --force` and try again
- **M1/M2 Mac compatibility issues**: Ensure you're using ARM64-compatible Node.js version

#### Docker Issues
- **Docker Desktop won't start**: Check System Preferences > Security & Privacy for blocked items
- **Performance issues**: Allocate more resources in Docker Desktop preferences (CPU/Memory)
- **"Cannot connect to Docker daemon"**: Ensure Docker Desktop is running

</details>

### General Issues (All Platforms)

#### Backend Issues
- **CORS errors**: Check ALLOWED_ORIGINS in backend/.env matches your frontend URL
- **File upload fails**: Ensure CSV has 'Experience' and 'Salary' columns, file size under 10MB
- **Model training fails**: Check data quality, ensure sufficient data rows (minimum 10)

#### Frontend Issues
- **API connection failed**: 
  - Verify backend is running on http://localhost:8000
  - Check VITE_API_URL in frontend/.env
  - Check browser console for detailed errors
- **Build errors**: Delete node_modules folder and package-lock.json, then run `npm install`
- **Blank page after build**: Check browser console, ensure API URL is correct

#### Docker Issues
- **Containers fail to communicate**: Restart docker-compose: `docker-compose down && docker-compose up -d`
- **Out of disk space**: Clean Docker: `docker system prune -a --volumes`
- **Changes not reflected**: Rebuild containers: `docker-compose up -d --build`

## Quick Command Reference

### Docker Commands
```bash
# Start application
docker-compose up -d

# Stop application
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build

# Clean up
docker system prune -a
```

### Backend Commands (in backend directory)

#### Windows
```cmd
# Setup
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Run
uvicorn main:app --reload
```

#### Linux/macOS
```bash
# Setup
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt

# Run
uvicorn main:app --reload
```

### Frontend Commands (in frontend directory)
```bash
# Setup
npm install

# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## License

This project is created for educational purposes.

## Author

Manish Tiwari - Minor Project

## Acknowledgments

- FastAPI for excellent API framework
- React and Vite for modern frontend tools
- scikit-learn and XGBoost for ML capabilities
- Tailwind CSS for beautiful styling
