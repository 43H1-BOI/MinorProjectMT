# Windows Setup Guide

This guide will help you set up and run the Employee Salary Prediction application on Windows 10/11.

## Prerequisites

Before you begin, make sure you have the following installed:

### 1. Python 3.11 or Higher

**Download and Install:**
1. Visit [python.org](https://www.python.org/downloads/)
2. Download Python 3.11 or newer for Windows
3. **IMPORTANT:** During installation, check the box "Add Python to PATH"
4. Complete the installation

**Verify Installation:**
```cmd
python --version
pip --version
```

You should see Python 3.11+ and pip version numbers.

### 2. Node.js 18+ and npm

**Download and Install:**
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS (Long Term Support) version
3. Run the installer with default settings
4. Restart your computer after installation

**Verify Installation:**
```cmd
node --version
npm --version
```

### 3. Git (Optional but Recommended)

**Download and Install:**
1. Visit [git-scm.com](https://git-scm.com/download/win)
2. Download Git for Windows
3. Install with default settings

**Verify Installation:**
```cmd
git --version
```

## Quick Start

### Method 1: Using Command Prompt (Recommended for Windows)

#### Step 1: Clone or Download the Repository

**If you have Git:**
```cmd
git clone <repository-url>
cd MinorProjectMT
```

**Without Git:**
- Download the ZIP file from GitHub
- Extract it to a folder (e.g., `C:\Projects\MinorProjectMT`)
- Open Command Prompt and navigate to that folder

#### Step 2: Setup and Run Backend

Open Command Prompt in the project directory:

```cmd
cd backend
```

Create a virtual environment:
```cmd
python -m venv venv
```

Activate the virtual environment:
```cmd
venv\Scripts\activate
```

You should see `(venv)` in your command prompt.

Install dependencies:
```cmd
pip install -r requirements.txt
```

Run the backend:
```cmd
uvicorn main:app --reload
```

The backend will start on `http://localhost:8000`

**Keep this Command Prompt window open!**

#### Step 3: Setup and Run Frontend

Open a **NEW** Command Prompt window in the project directory:

```cmd
cd frontend
```

Install dependencies:
```cmd
npm install
```

Run the frontend:
```cmd
npm run dev
```

The frontend will start on `http://localhost:5173`

#### Step 4: Access the Application

Open your web browser and go to:
- **Frontend:** http://localhost:5173
- **Backend API Docs:** http://localhost:8000/docs

### Method 2: Using Docker Desktop (Alternative)

#### Prerequisites for Docker:
1. Install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
2. Enable WSL 2 during installation (recommended)
3. Restart your computer

#### Running with Docker:

Open Command Prompt or PowerShell in the project directory:

```cmd
docker-compose up -d
```

Access the application:
- **Frontend:** http://localhost
- **Backend API:** http://localhost:8000

Stop the application:
```cmd
docker-compose down
```

## Testing the Application

### Using the Python Test Script (Works on All Platforms)

Make sure the backend is running, then:

```cmd
python test_api.py
```

### Using the Windows Batch Script

```cmd
test_api.bat
```

### Using PowerShell Script

```powershell
.\test_api.ps1
```

**Note:** If you get an execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Common Windows Issues and Solutions

### Issue 1: "python is not recognized"

**Solution:**
- Python is not in your PATH
- Reinstall Python and check "Add Python to PATH" during installation
- Or manually add Python to PATH:
  1. Search "Environment Variables" in Windows
  2. Edit "Path" under System Variables
  3. Add Python installation directory (e.g., `C:\Users\YourName\AppData\Local\Programs\Python\Python311`)

### Issue 2: Virtual Environment Activation Fails in PowerShell

**Error:** "cannot be loaded because running scripts is disabled"

**Solution:**
Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or use Command Prompt instead.

### Issue 3: Port 8000 Already in Use

**Solution:**
Find and kill the process using port 8000:

```cmd
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

Replace `<PID>` with the process ID from the first command.

### Issue 4: Port 5173 Already in Use

**Solution:**
Vite will automatically use the next available port (5174, 5175, etc.)
Check the terminal output for the actual port number.

### Issue 5: npm Install Fails with Permission Errors

**Solution:**
Run Command Prompt as Administrator:
1. Search "cmd" in Windows
2. Right-click "Command Prompt"
3. Select "Run as administrator"
4. Navigate to the frontend directory and try again

### Issue 6: pip Install Fails

**Solution 1:** Upgrade pip:
```cmd
python -m pip install --upgrade pip
```

**Solution 2:** Install packages one by one to identify the problem:
```cmd
pip install fastapi
pip install uvicorn[standard]
pip install pandas
```

### Issue 7: CORS Errors in Browser

**Solution:**
1. Check that backend is running on http://localhost:8000
2. Check that frontend `.env` file has correct API URL:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```
3. Restart both backend and frontend

### Issue 8: File Upload Fails

**Possible Causes:**
- File is not in CSV format
- File is larger than 10MB
- File doesn't have required columns (Experience, Salary)

**Solution:**
- Use the sample data file: `backend/sample_data.csv`
- Ensure your CSV has headers and correct format

## Development Tips for Windows

### Using VS Code (Recommended)

1. Install [Visual Studio Code](https://code.visualstudio.com/)
2. Install Python extension
3. Install ESLint extension for JavaScript
4. Open the project folder in VS Code
5. Use integrated terminal (Ctrl+`)

### Managing Multiple Terminal Windows

**Option 1:** Use VS Code integrated terminal with split panes

**Option 2:** Use Windows Terminal (from Microsoft Store)
- Supports multiple tabs
- Better than Command Prompt
- Supports PowerShell, CMD, and WSL

### Stopping the Servers

**Backend:**
- Press `Ctrl+C` in the terminal where uvicorn is running

**Frontend:**
- Press `Ctrl+C` in the terminal where npm is running

## File Paths on Windows

The application uses Python's `os.path` which automatically handles Windows paths correctly. You don't need to worry about forward slashes vs backslashes.

## Next Steps

Once everything is running:

1. **Upload Data:**
   - Go to http://localhost:5173
   - Upload `backend/sample_data.csv`

2. **Train a Model:**
   - Choose an algorithm (Random Forest recommended)
   - Click "Train Model"

3. **Make Predictions:**
   - Enter years of experience
   - Get salary predictions

4. **View Insights:**
   - See salary statistics
   - Export reports

## Getting Help

If you encounter issues not covered here:

1. Check the main [README.md](README.md) for general information
2. Check [QUICKSTART.md](QUICKSTART.md) for quick setup
3. Look at the error message carefully
4. Check that all prerequisites are installed correctly
5. Make sure both backend and frontend are running
6. Try restarting both servers

## Environment Files

### Backend `.env` (create if missing)

Create `backend/.env` file:
```
HOST=0.0.0.0
PORT=8000
DEBUG=True
MAX_UPLOAD_SIZE=10485760
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend `.env` (should already exist)

File `frontend/.env`:
```
VITE_API_URL=http://localhost:8000/api
```

## Performance Notes

- First time running may take longer (installing dependencies)
- Backend startup is usually fast (2-5 seconds)
- Frontend build may take 10-30 seconds first time
- Model training time depends on data size (usually 1-5 seconds for sample data)

## Security Notes

- Only run in development mode on your local machine
- Don't expose ports to the internet without proper security
- Don't commit `.env` files with sensitive data
- The `.gitignore` is configured to prevent this

## Uninstalling

To remove the application:

1. Stop both servers (Ctrl+C)
2. Deactivate virtual environment: `deactivate`
3. Delete the project folder
4. Optionally uninstall Python, Node.js if not needed for other projects

---

**Happy coding! 🚀**
