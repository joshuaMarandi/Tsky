# Deployment Guide: Frontend (Netlify) + Backend (InfinityFree)

## 🔄 **Auto-Database Detection**

The backend **automatically detects** the environment and uses the appropriate database:

- **🏠 Localhost/Local Development**: Uses local MySQL (`localhost/Tsky`)
- **🌐 Hosted/Production**: Uses InfinityFree database (`sql313.infinityfree.com/if0_39779787_tsky`)

**No manual database configuration needed!** The system automatically switches between databases based on the server environment.

### Testing Environment Detection

Visit `https://tsky.kesug.com/test_environment.php` (after deployment) or `http://localhost/Tsky/backend/test_environment.php` (local) to verify the auto-detection is working.

## Backend Deployment (InfinityFree)

### ✅ Already Configured:
- **Backend URL**: `https://tsky.kesug.com`
- **Database**: `if0_39779787_tsky` on `sql313.infinityfree.com`
- **Credentials**: Already updated in `backend/config/database.php`

### 1. Upload Backend Files
- Upload the **contents** of the `backend/` folder to your InfinityFree **public_html** directory
- **Important:** Do NOT upload the `backend/` folder itself - upload its contents directly to public_html
- This means `index.php`, `api/`, `classes/`, `config/`, etc. should be in the root of public_html
- Make sure all PHP files have proper permissions (644 for files, 755 for directories)

### Directory Structure After Upload:
```
public_html/
├── index.php          (main entry point)
├── .htaccess          (Apache configuration)
├── error.php          (error handler)
├── api/
│   ├── products.php
│   ├── sales.php
│   └── sold-out.php
├── classes/
│   └── Product.php
├── config/
│   └── database.php
├── init_database.php
└── ... (other files)
```

### 2. Initialize Database
- Run `https://tsky.kesug.com/init_database.php` in your browser to create tables and insert sample data
- Or manually create the database structure

### 3. Update CORS (if needed)
- The API files are already configured to allow requests from:
  - `http://localhost:5174` (development)
  - `https://tskyapp.netlify.app` (production)
  - `https://tsky.kesug.com` (backend domain)

## Frontend Deployment (Netlify)

### 1. Environment Variables
- In Netlify dashboard, go to Site Settings > Environment Variables
- Add: `VITE_API_BASE_URL` = `https://tsky.kesug.com/api`

### 2. Build Settings
- Build command: `npm run build`
- Publish directory: `dist`

### 3. Deploy
- Connect your GitHub repository to Netlify
- Deploy the site

## Testing Your Setup

### 1. Test Backend API
Visit these URLs to test your backend:
- `https://tsky.kesug.com/api/products.php`
- `https://tsky.kesug.com/api/sales.php`

### 2. Test Locally
```bash
npm run dev
```

### 3. Test Production Build
```bash
npm run build
npm run preview
```

## File Changes Made

### ✅ Updated Files:
- `backend/config/database.php` - Updated with your InfinityFree database credentials
- `backend/api/products.php` - Added CORS for tsky.kesug.com
- `backend/api/sales.php` - Added CORS for tsky.kesug.com
- `backend/api/sold-out.php` - Added CORS for tsky.kesug.com
- `.env.production` - Set to use https://tsky.kesug.com/api
- `.env.example` - Updated with correct backend URL

### Important Notes

- Your database credentials are now configured for InfinityFree
- The backend URL is set to `https://tsky.kesug.com`
- Make sure to update the Netlify domain in CORS settings once you deploy the frontend
- Test the backend API endpoints before deploying the frontend
