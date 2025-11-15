# PowerShell test script for Employee Salary Prediction API
# This script tests all major endpoints and workflows on Windows

$BaseUrl = "http://localhost:8000/api"
$SampleData = "backend/sample_data.csv"

Write-Host "==================================="
Write-Host "Employee Salary Prediction API Test"
Write-Host "==================================="
Write-Host ""

# Test 1: Health check
Write-Host "Test 1: Health check"
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get
    Write-Host ($response | ConvertTo-Json)
    Write-Host ""
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Upload CSV
Write-Host "Test 2: Upload CSV file"
try {
    $filePath = $SampleData
    $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
    $fileEnc = [System.Text.Encoding]::GetEncoding('iso-8859-1').GetString($fileBytes)
    $boundary = [System.Guid]::NewGuid().ToString()
    
    $LF = "`r`n"
    $bodyLines = (
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"sample_data.csv`"",
        "Content-Type: text/csv$LF",
        $fileEnc,
        "--$boundary--$LF"
    ) -join $LF

    $response = Invoke-RestMethod -Uri "$BaseUrl/upload/csv" -Method Post -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyLines
    Write-Host ($response | ConvertTo-Json)
    $rows = $response.rows
    Write-Host "✓ Uploaded $rows rows" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "Note: Make sure the backend is running on http://localhost:8000" -ForegroundColor Yellow
    exit 1
}

# Test 3: Get data statistics
Write-Host "Test 3: Get data statistics"
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/upload/stats" -Method Get
    Write-Host ($response | ConvertTo-Json)
    Write-Host ""
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

# Test 4: Get visualizations
Write-Host "Test 4: Generate visualizations"
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/visualization/all" -Method Get
    Write-Host "✓ Visualizations generated (base64 images)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

# Test 5: Train model with Linear Regression
Write-Host "Test 5: Train Linear Regression model"
try {
    $body = @{
        algorithm = "linear"
        test_size = 0.2
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$BaseUrl/model/train" -Method Post -Body $body -ContentType "application/json"
    Write-Host ($response | ConvertTo-Json)
    $linearR2 = $response.metrics.r2_score
    Write-Host "✓ Linear Regression R² score: $linearR2" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

# Test 6: Train model with Random Forest
Write-Host "Test 6: Train Random Forest model"
try {
    $body = @{
        algorithm = "random_forest"
        test_size = 0.2
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$BaseUrl/model/train" -Method Post -Body $body -ContentType "application/json"
    Write-Host ($response | ConvertTo-Json)
    $rfR2 = $response.metrics.r2_score
    Write-Host "✓ Random Forest R² score: $rfR2" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

# Test 7: Train model with XGBoost
Write-Host "Test 7: Train XGBoost model"
try {
    $body = @{
        algorithm = "xgboost"
        test_size = 0.2
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$BaseUrl/model/train" -Method Post -Body $body -ContentType "application/json"
    Write-Host ($response | ConvertTo-Json)
    $xgbR2 = $response.metrics.r2_score
    Write-Host "✓ XGBoost R² score: $xgbR2" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

# Test 8: Single prediction
Write-Host "Test 8: Single salary prediction (5 years experience)"
try {
    $body = @{
        experience = 5.0
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$BaseUrl/prediction/single" -Method Post -Body $body -ContentType "application/json"
    Write-Host ($response | ConvertTo-Json)
    $predSalary = $response.predicted_salary
    Write-Host "✓ Predicted salary: `$$predSalary" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

# Test 9: Batch predictions
Write-Host "Test 9: Batch salary predictions"
try {
    $body = @{
        predictions = @(
            @{ experience = 1.0 },
            @{ experience = 3.0 },
            @{ experience = 5.0 },
            @{ experience = 10.0 }
        )
    } | ConvertTo-Json -Depth 3
    
    $response = Invoke-RestMethod -Uri "$BaseUrl/prediction/batch" -Method Post -Body $body -ContentType "application/json"
    Write-Host ($response | ConvertTo-Json -Depth 3)
    Write-Host ""
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

# Test 10: Get insights
Write-Host "Test 10: Get HR insights"
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/insights/summary" -Method Get
    Write-Host ($response | ConvertTo-Json)
    Write-Host ""
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

# Test 11: Get benchmark
Write-Host "Test 11: Get salary benchmark for 5 years experience"
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/insights/benchmark?experience=5.0" -Method Get
    Write-Host ($response | ConvertTo-Json)
    Write-Host ""
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

# Summary
Write-Host "==================================="
Write-Host "Test Summary"
Write-Host "==================================="
Write-Host "✓ All tests completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Model Performance:"
if ($linearR2) { Write-Host "  - Linear Regression: R² = $linearR2" }
if ($rfR2) { Write-Host "  - Random Forest:     R² = $rfR2" }
if ($xgbR2) { Write-Host "  - XGBoost:           R² = $xgbR2" }
Write-Host ""
if ($rfR2 -and $rfR2 -gt 0.85) {
    Write-Host "Target R² > 0.85: ✓ PASSED" -ForegroundColor Green
} else {
    Write-Host "Target R² > 0.85: Check individual scores" -ForegroundColor Yellow
}
Write-Host "==================================="
