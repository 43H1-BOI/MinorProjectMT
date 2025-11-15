@echo off
REM Windows batch script to run the API tests
REM This script runs the cross-platform Python test script

echo.
echo ===================================
echo Employee Salary Prediction API Test
echo ===================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.11 or higher and add it to PATH
    exit /b 1
)

REM Check if requests module is installed
python -c "import requests" >nul 2>&1
if errorlevel 1 (
    echo Installing required Python package: requests
    pip install requests
    if errorlevel 1 (
        echo Error: Failed to install requests package
        exit /b 1
    )
)

REM Run the test script
python test_api.py
exit /b %ERRORLEVEL%
