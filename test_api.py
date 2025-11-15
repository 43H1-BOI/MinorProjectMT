#!/usr/bin/env python3
"""
Cross-platform test script for Employee Salary Prediction API
This script tests all major endpoints and workflows
Works on Windows, Linux, and macOS
"""

import requests
import json
import sys
import os
from pathlib import Path

BASE_URL = "http://localhost:8000/api"
SAMPLE_DATA = Path("backend/sample_data.csv")

def print_header(text):
    """Print a formatted header"""
    print("\n" + "=" * 50)
    print(text)
    print("=" * 50 + "\n")

def print_success(text):
    """Print success message"""
    print(f"✓ {text}")

def print_error(text):
    """Print error message"""
    print(f"✗ {text}", file=sys.stderr)

def test_health_check():
    """Test 1: Health check"""
    print("Test 1: Health check")
    try:
        response = requests.get("http://localhost:8000/health")
        response.raise_for_status()
        print(json.dumps(response.json(), indent=2))
        print_success("Health check passed")
        return True
    except Exception as e:
        print_error(f"Health check failed: {e}")
        return False

def test_upload_csv():
    """Test 2: Upload CSV file"""
    print("\nTest 2: Upload CSV file")
    try:
        if not SAMPLE_DATA.exists():
            print_error(f"Sample data file not found: {SAMPLE_DATA}")
            return False, 0
        
        with open(SAMPLE_DATA, 'rb') as f:
            files = {'file': ('sample_data.csv', f, 'text/csv')}
            response = requests.post(f"{BASE_URL}/upload/csv", files=files)
            response.raise_for_status()
            data = response.json()
            print(json.dumps(data, indent=2))
            rows = data.get('rows', 0)
            print_success(f"Uploaded {rows} rows")
            return True, rows
    except Exception as e:
        print_error(f"Upload failed: {e}")
        return False, 0

def test_data_stats():
    """Test 3: Get data statistics"""
    print("\nTest 3: Get data statistics")
    try:
        response = requests.get(f"{BASE_URL}/upload/stats")
        response.raise_for_status()
        print(json.dumps(response.json(), indent=2))
        print_success("Statistics retrieved")
        return True
    except Exception as e:
        print_error(f"Statistics failed: {e}")
        return False

def test_visualizations():
    """Test 4: Generate visualizations"""
    print("\nTest 4: Generate visualizations")
    try:
        response = requests.get(f"{BASE_URL}/visualization/all")
        response.raise_for_status()
        print_success("Visualizations generated (base64 images)")
        return True
    except Exception as e:
        print_error(f"Visualizations failed: {e}")
        return False

def test_train_model(algorithm, name):
    """Test training a model"""
    print(f"\nTest: Train {name} model")
    try:
        payload = {
            "algorithm": algorithm,
            "test_size": 0.2
        }
        response = requests.post(
            f"{BASE_URL}/model/train",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()
        data = response.json()
        print(json.dumps(data, indent=2))
        r2_score = data.get('metrics', {}).get('r2_score', 0)
        print_success(f"{name} R² score: {r2_score:.4f}")
        return True, r2_score
    except Exception as e:
        print_error(f"{name} training failed: {e}")
        return False, 0

def test_single_prediction():
    """Test 8: Single prediction"""
    print("\nTest 8: Single salary prediction (5 years experience)")
    try:
        payload = {"experience": 5.0}
        response = requests.post(
            f"{BASE_URL}/prediction/single",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()
        data = response.json()
        print(json.dumps(data, indent=2))
        salary = data.get('predicted_salary', 0)
        print_success(f"Predicted salary: ${salary:,.2f}")
        return True
    except Exception as e:
        print_error(f"Single prediction failed: {e}")
        return False

def test_batch_predictions():
    """Test 9: Batch predictions"""
    print("\nTest 9: Batch salary predictions")
    try:
        payload = {
            "predictions": [
                {"experience": 1.0},
                {"experience": 3.0},
                {"experience": 5.0},
                {"experience": 10.0}
            ]
        }
        response = requests.post(
            f"{BASE_URL}/prediction/batch",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()
        print(json.dumps(response.json(), indent=2))
        print_success("Batch predictions completed")
        return True
    except Exception as e:
        print_error(f"Batch predictions failed: {e}")
        return False

def test_insights():
    """Test 10: Get insights"""
    print("\nTest 10: Get HR insights")
    try:
        response = requests.get(f"{BASE_URL}/insights/summary")
        response.raise_for_status()
        print(json.dumps(response.json(), indent=2))
        print_success("Insights retrieved")
        return True
    except Exception as e:
        print_error(f"Insights failed: {e}")
        return False

def test_benchmark():
    """Test 11: Get benchmark"""
    print("\nTest 11: Get salary benchmark for 5 years experience")
    try:
        response = requests.get(f"{BASE_URL}/insights/benchmark?experience=5.0")
        response.raise_for_status()
        print(json.dumps(response.json(), indent=2))
        print_success("Benchmark retrieved")
        return True
    except Exception as e:
        print_error(f"Benchmark failed: {e}")
        return False

def main():
    """Run all tests"""
    print_header("Employee Salary Prediction API Test")
    
    # Check if backend is running
    print("Checking if backend is running...")
    if not test_health_check():
        print_error("\nBackend is not running!")
        print("Please start the backend with: cd backend && uvicorn main:app --reload")
        return 1
    
    # Run tests
    results = []
    
    # Upload
    success, rows = test_upload_csv()
    results.append(("Upload CSV", success))
    if not success:
        print_error("\nCannot continue without data upload")
        return 1
    
    # Stats and viz
    results.append(("Data Statistics", test_data_stats()))
    results.append(("Visualizations", test_visualizations()))
    
    # Model training
    linear_success, linear_r2 = test_train_model("linear", "Linear Regression")
    results.append(("Linear Regression", linear_success))
    
    rf_success, rf_r2 = test_train_model("random_forest", "Random Forest")
    results.append(("Random Forest", rf_success))
    
    xgb_success, xgb_r2 = test_train_model("xgboost", "XGBoost")
    results.append(("XGBoost", xgb_success))
    
    # Predictions
    results.append(("Single Prediction", test_single_prediction()))
    results.append(("Batch Predictions", test_batch_predictions()))
    
    # Insights
    results.append(("Insights", test_insights()))
    results.append(("Benchmark", test_benchmark()))
    
    # Summary
    print_header("Test Summary")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    print(f"Tests passed: {passed}/{total}\n")
    
    for test_name, success in results:
        status = "✓ PASSED" if success else "✗ FAILED"
        print(f"{test_name:.<40} {status}")
    
    print("\nModel Performance:")
    if linear_success:
        print(f"  - Linear Regression: R² = {linear_r2:.4f}")
    if rf_success:
        print(f"  - Random Forest:     R² = {rf_r2:.4f}")
    if xgb_success:
        print(f"  - XGBoost:           R² = {xgb_r2:.4f}")
    
    print()
    if rf_r2 > 0.85:
        print("Target R² > 0.85: ✓ PASSED")
    else:
        print(f"Target R² > 0.85: Note - Best R² is {max(linear_r2, rf_r2, xgb_r2):.4f}")
    
    print_header("Tests Complete")
    
    return 0 if passed == total else 1

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\nTests interrupted by user")
        sys.exit(130)
    except Exception as e:
        print_error(f"\nUnexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
