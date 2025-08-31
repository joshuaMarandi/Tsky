# TROUBLESHOOTING GUIDE: JSON Parse Error Fix

## Error: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

This error occurs when the frontend expects JSON but receives HTML instead. Here's how to fix it:

## IMMEDIATE SOLUTIONS:

### 1. Clear Browser Cache
- Press `Ctrl + Shift + R` for hard refresh
- Or open Developer Tools (`F12`) → Right-click refresh → "Empty Cache and Hard Reload"

### 2. Check Browser Console
1. Open Developer Tools (`F12`)
2. Go to Console tab
3. Look for detailed error messages with red text
4. Check Network tab to see what responses you're getting

### 3. Verify XAMPP is Running
1. Open XAMPP Control Panel
2. Ensure Apache and MySQL are both RUNNING (green background)
3. If not running, click "Start" for both services

### 4. Test API Endpoints Directly
Open these URLs in your browser to verify they return JSON:

- **Debug Endpoint**: http://localhost/BIGMAN/bigman-react/backend/api/debug.php
- **Products Endpoint**: http://localhost/BIGMAN/bigman-react/backend/api/products.php
- **Database Init**: http://localhost/BIGMAN/bigman-react/backend/init_database.php

### 5. Check PHP Error Logs
1. Go to: `c:\xampp\htdocs\BIGMAN\bigman-react\backend\`
2. Look for `error.log` file
3. Open it to see any PHP errors

## STEP-BY-STEP DEBUGGING:

### Step 1: Test React App
1. Open: http://localhost:5173/
2. Open Browser Developer Tools (`F12`)
3. Check Console for errors
4. Check Network tab for failed requests

### Step 2: Test Admin Panel
1. Open: http://localhost/BIGMAN/bigman-react/backend/admin/
2. Try adding a product
3. Check browser console for errors
4. Look at Network tab to see the actual response

### Step 3: Manual API Testing
Run these PowerShell commands to test the API:

```powershell
# Test GET products
Invoke-WebRequest -Uri "http://localhost/BIGMAN/bigman-react/backend/api/products.php" -Method GET

# Test POST new product
$body = @{
    name = "Test PC"
    processor = "intel-i5"
    ram = "8gb"
    graphics = "dedicated"
    storage = "ssd-512gb"
    purpose = "gaming"
    price = 999.99
    image = "/src/assets/images/pc1.svg"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost/BIGMAN/bigman-react/backend/api/products.php" -Method POST -Body $body -ContentType "application/json"
```

## COMMON CAUSES & FIXES:

### 1. **PHP Syntax Error**
- **Symptom**: Getting HTML error page instead of JSON
- **Fix**: Check PHP error logs, fix syntax errors in PHP files

### 2. **Database Connection Issue**
- **Symptom**: Database connection errors in console
- **Fix**: Run database initialization: http://localhost/BIGMAN/bigman-react/backend/init_database.php

### 3. **CORS Issues**
- **Symptom**: Network errors in browser console
- **Fix**: Verify CORS headers are set correctly in PHP files

### 4. **Wrong API URL**
- **Symptom**: 404 errors or wrong responses
- **Fix**: Verify API_BASE_URL in ProductContext.tsx is correct

### 5. **Caching Issues**
- **Symptom**: Old responses being returned
- **Fix**: Clear browser cache, restart development server

## CURRENT STATUS CHECK:

✅ **API Endpoints Working**: All endpoints tested and returning proper JSON
✅ **Database Initialized**: Products table created with sample data
✅ **XAMPP Running**: Apache and MySQL services active
✅ **React Dev Server**: Running on http://localhost:5173/
✅ **Enhanced Error Logging**: Added detailed console logging to ProductContext

## NEXT STEPS:

1. **Clear browser cache and refresh the page**
2. **Open browser developer tools and check console**
3. **If errors persist, check the Network tab to see actual responses**
4. **Look for error.log files in the backend directory**

## CONTACT SUPPORT:
If the issue persists after following these steps, provide:
1. Screenshots of browser console errors
2. Contents of any error.log files
3. Network tab showing the failed request and response
