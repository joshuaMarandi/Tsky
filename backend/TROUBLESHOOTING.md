# Troubleshooting: "Unexpected token '<', "<!DOCTYPE"... is not valid JSON"

## What This Error Means
This error occurs when the JavaScript code expects JSON data but receives HTML instead. This typically happens when:

1. **PHP Error**: Your PHP script has an error and returns an HTML error page
2. **Wrong URL**: The API endpoint URL is incorrect
3. **Apache Not Running**: XAMPP Apache service is not started
4. **File Permissions**: PHP files don't have proper permissions

## Step-by-Step Fix

### 1. Check XAMPP Services
```
Open XAMPP Control Panel
✅ Apache should be GREEN and running
✅ MySQL should be GREEN and running
```

### 2. Test API Directly
Open your browser and visit: `http://localhost/Tsky/Tsky-react/backend/api/debug.php`

**Expected Result**: JSON data showing API info
**If you see HTML error**: There's a PHP error - check step 3

### 3. Check for PHP Errors
Visit: `http://localhost/Tsky/Tsky-react/backend/api/products.php`

**Common PHP Errors:**
- `Fatal error: Class 'Database' not found` → Check file paths
- `Connection refused` → MySQL not running
- `Access denied` → Wrong database credentials

### 4. Verify Database Setup
1. Visit: `http://localhost/phpmyadmin/`
2. Check if `tsky` database exists
3. Check if `products` table has data
4. If not, run: `http://localhost/Tsky/Tsky-react/backend/init_database.php`

### 5. Fix File Paths
Ensure your files are located at:
```
C:\xampp\htdocs\Tsky\Tsky-react\backend\
├── api\
│   ├── products.php
│   └── debug.php
├── config\
│   └── database.php
├── classes\
│   └── Product.php
└── admin\
    └── index.html
```

### 6. Check Database Configuration
Open `backend/config/database.php` and verify:
```php
private $host = "localhost";
private $db_name = "tsky";
private $username = "root";
private $password = "";  // Usually empty for XAMPP
```

### 7. Test Step by Step

1. **Test Debug Endpoint**:
   ```
   http://localhost/Tsky/Tsky-react/backend/api/debug.php
   ```

2. **Test Products Endpoint**:
   ```
   http://localhost/Tsky/Tsky-react/backend/api/products.php
   ```

3. **Test Admin Panel**:
   ```
   http://localhost/Tsky/Tsky-react/backend/admin/
   ```

### 8. Common Solutions

**Solution 1: Restart XAMPP**
- Stop Apache and MySQL
- Wait 5 seconds
- Start them again

**Solution 2: Check Windows Firewall**
- Temporarily disable Windows Firewall
- Test if the API works
- Re-enable firewall and add XAMPP exceptions

**Solution 3: Port Conflicts**
- Change Apache port from 80 to 8080 in XAMPP
- Update URLs to use `:8080`

**Solution 4: Clear Browser Cache**
- Press Ctrl+Shift+R to hard refresh
- Or use Incognito/Private mode

### 9. Using the Debug Panel

1. Open Admin Panel: `http://localhost/Tsky/Tsky-react/backend/admin/`
2. Click "Debug Info" tab
3. Click "Test API Connection"
4. Click "Test Database"

This will show you exactly where the problem is.

### 10. Enable PHP Error Reporting

Add this to the top of `products.php`:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

This will show PHP errors directly in the browser.

## Quick Fix Checklist

□ XAMPP Apache is running
□ XAMPP MySQL is running  
□ Database `Tsky` exists
□ Table `products` has data
□ API returns JSON when tested directly
□ File paths are correct
□ No PHP syntax errors

## Still Having Issues?

1. Check XAMPP error logs:
   - `C:\xampp\apache\logs\error.log`
   - `C:\xampp\mysql\data\*.err`

2. Use browser Developer Tools:
   - Press F12
   - Check Console and Network tabs
   - Look for failed requests

3. Test with a simple PHP file:
   Create `test.php` in `C:\xampp\htdocs\`:
   ```php
   <?php
   echo json_encode(["message" => "PHP is working!"]);
   ?>
   ```
   Visit: `http://localhost/test.php`
