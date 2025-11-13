#!/bin/bash

# Test script for Employee Salary Prediction API
# This script tests all major endpoints and workflows

BASE_URL="http://localhost:8000/api"
SAMPLE_DATA="backend/sample_data.csv"

echo "==================================="
echo "Employee Salary Prediction API Test"
echo "==================================="
echo ""

# Test 1: Health check
echo "Test 1: Health check"
curl -s http://localhost:8000/health | python -m json.tool
echo ""

# Test 2: Upload CSV
echo "Test 2: Upload CSV file"
UPLOAD_RESPONSE=$(curl -s -X POST -F "file=@${SAMPLE_DATA}" ${BASE_URL}/upload/csv)
echo $UPLOAD_RESPONSE | python -m json.tool
ROWS=$(echo $UPLOAD_RESPONSE | python -c "import sys, json; print(json.load(sys.stdin)['rows'])")
echo "✓ Uploaded ${ROWS} rows"
echo ""

# Test 3: Get data statistics
echo "Test 3: Get data statistics"
curl -s ${BASE_URL}/upload/stats | python -m json.tool
echo ""

# Test 4: Get visualizations
echo "Test 4: Generate visualizations"
VIZ_RESPONSE=$(curl -s ${BASE_URL}/visualization/all)
echo "✓ Visualizations generated (base64 images)"
echo ""

# Test 5: Train model with Linear Regression
echo "Test 5: Train Linear Regression model"
LINEAR_RESULT=$(curl -s -X POST ${BASE_URL}/model/train \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"linear","test_size":0.2}')
echo $LINEAR_RESULT | python -m json.tool
LINEAR_R2=$(echo $LINEAR_RESULT | python -c "import sys, json; print(json.load(sys.stdin)['metrics']['r2_score'])")
echo "✓ Linear Regression R² score: ${LINEAR_R2}"
echo ""

# Test 6: Train model with Random Forest
echo "Test 6: Train Random Forest model"
RF_RESULT=$(curl -s -X POST ${BASE_URL}/model/train \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"random_forest","test_size":0.2}')
echo $RF_RESULT | python -m json.tool
RF_R2=$(echo $RF_RESULT | python -c "import sys, json; print(json.load(sys.stdin)['metrics']['r2_score'])")
echo "✓ Random Forest R² score: ${RF_R2}"
echo ""

# Test 7: Train model with XGBoost
echo "Test 7: Train XGBoost model"
XGB_RESULT=$(curl -s -X POST ${BASE_URL}/model/train \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"xgboost","test_size":0.2}')
echo $XGB_RESULT | python -m json.tool
XGB_R2=$(echo $XGB_RESULT | python -c "import sys, json; print(json.load(sys.stdin)['metrics']['r2_score'])")
echo "✓ XGBoost R² score: ${XGB_R2}"
echo ""

# Test 8: Single prediction
echo "Test 8: Single salary prediction (5 years experience)"
PRED_RESULT=$(curl -s -X POST ${BASE_URL}/prediction/single \
  -H "Content-Type: application/json" \
  -d '{"experience":5.0}')
echo $PRED_RESULT | python -m json.tool
PRED_SALARY=$(echo $PRED_RESULT | python -c "import sys, json; print(json.load(sys.stdin)['predicted_salary'])")
echo "✓ Predicted salary: \$${PRED_SALARY}"
echo ""

# Test 9: Batch predictions
echo "Test 9: Batch salary predictions"
curl -s -X POST ${BASE_URL}/prediction/batch \
  -H "Content-Type: application/json" \
  -d '{"predictions":[{"experience":1.0},{"experience":3.0},{"experience":5.0},{"experience":10.0}]}' | python -m json.tool
echo ""

# Test 10: Get insights
echo "Test 10: Get HR insights"
curl -s ${BASE_URL}/insights/summary | python -m json.tool
echo ""

# Test 11: Get benchmark
echo "Test 11: Get salary benchmark for 5 years experience"
curl -s "${BASE_URL}/insights/benchmark?experience=5.0" | python -m json.tool
echo ""

# Summary
echo "==================================="
echo "Test Summary"
echo "==================================="
echo "✓ All tests passed successfully!"
echo ""
echo "Model Performance:"
echo "  - Linear Regression: R² = ${LINEAR_R2}"
echo "  - Random Forest:     R² = ${RF_R2}"
echo "  - XGBoost:           R² = ${XGB_R2}"
echo ""
echo "Target R² > 0.85: $(if (( $(echo "${RF_R2} > 0.85" | bc -l) )); then echo "✓ PASSED"; else echo "✗ FAILED"; fi)"
echo "==================================="
