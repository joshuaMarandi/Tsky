# Tsky - Full Stack Application

A modern e-commerce website for PC sales built with React (frontend) and PHP with MySQL (backend).

## Features

### Frontend (React + TypeScript)
- 🎨 Modern, responsive design
- 🔍 Product filtering and search
- 📱 Mobile-first approach
- 🛒 Shopping cart functionality
- 💫 Smooth animations and transitions
- 🎯 Product detail pages
- 📊 Real-time data from API

### Backend (PHP + MySQL)
- 🗄️ MySQL database with product management
- 🔗 RESTful API endpoints
- ⚡ CRUD operations (Create, Read, Update, Delete)
- 🔍 Search and filter functionality
- 🛡️ Input sanitization and validation
- 🎛️ Admin panel for product management

## Prerequisites

Before you begin, ensure you have the following installed:

1. **XAMPP** (includes Apache, MySQL, PHP)
   - Download from: https://www.apachefriends.org/
   - Version: 8.0 or higher

2. **Node.js** (for React development)
   - Download from: https://nodejs.org/
   - Version: 16 or higher

3. **Git** (optional, for version control)

## Installation & Setup

### 1. Setup XAMPP

1. Install and start XAMPP
2. Start **Apache** and **MySQL** services from XAMPP Control Panel
3. Open phpMyAdmin: http://localhost/phpmyadmin/

### 2. Clone/Download the Project

```bash
# If using Git
git clone <repository-url>

# Or extract the downloaded ZIP file to:
C:\xampp\htdocs\Tsky\Tsky-react
```

### 3. Setup the Database

1. Navigate to the backend directory in your browser:
   ```
   http://localhost/Tsky/Tsky-react/backend/init_database.php
   ```

2. This will:
   - Create the `tsky` database
   - Create the `products` table
   - Insert sample product data

3. You should see success messages confirming the setup

### 4. Setup the Frontend

1. Open Command Prompt/Terminal
2. Navigate to the project directory:
   ```bash
   cd C:\xampp\htdocs\Tsky\Tsky-react
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit: http://localhost:5173

### 5. Access Admin Panel

1. Open your browser and visit:
   ```
   http://localhost/Tsky/Tsky-react/backend/admin/
   ```

2. Use the admin panel to:
   - View all products
   - Add new products
   - Edit existing products
   - Delete products

## Project Structure

```
Tsky-react/
├── backend/                    # PHP Backend
│   ├── api/
│   │   └── products.php       # API endpoints
│   ├── classes/
│   │   └── Product.php        # Product class
│   ├── config/
│   │   └── database.php       # Database configuration
│   ├── admin/
│   │   └── index.html         # Admin panel
│   └── init_database.php      # Database initialization
├── src/                       # React Frontend
│   ├── components/
│   │   ├── filter/
│   │   ├── layout/
│   │   └── product/
│   ├── context/
│   │   └── ProductContext.tsx # State management
│   ├── pages/
│   └── assets/
├── public/
└── package.json
```

## API Endpoints

### Base URL: `http://localhost/Tsky/Tsky-react/backend/api/products.php`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products.php` | Get all products |
| GET | `/products.php?id=1` | Get single product |
| GET | `/products.php?search=gaming` | Search products |
| GET | `/products.php?filter&purpose=gaming&processor=intel-i7` | Filter products |
| POST | `/products.php` | Create new product |
| PUT | `/products.php?id=1` | Update product |
| DELETE | `/products.php?id=1` | Delete product |

## Database Schema

### Products Table

```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    processor VARCHAR(100) NOT NULL,
    ram VARCHAR(50) NOT NULL,
    graphics VARCHAR(100) NOT NULL,
    storage VARCHAR(100) NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(500) DEFAULT NULL,
    specs TEXT DEFAULT NULL,
    tag VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Configuration

### Database Configuration
Edit `backend/config/database.php` if needed:

```php
private $host = "localhost";
private $db_name = "tsky";
private $username = "root";
private $password = "";
```

### API Configuration
Edit `src/context/ProductContext.tsx` if needed:

```typescript
const API_BASE_URL = 'http://localhost/Tsky/Tsky-react/backend/api';
```

## Troubleshooting

### Common Issues

1. **"Connection error" when loading products**
   - Ensure XAMPP MySQL service is running
   - Check if database was created properly
   - Verify API URL in ProductContext.tsx

2. **CORS errors in browser console**
   - Make sure the React app is running on port 5173
   - Check CORS headers in products.php

3. **"No products found" message**
   - Run the database initialization script again
   - Check phpMyAdmin to ensure data was inserted

4. **PHP errors**
   - Check XAMPP error logs
   - Ensure PHP version is compatible
   - Verify file permissions

### Development Tools

- **Frontend Development**: http://localhost:5173
- **API Testing**: Use Postman or browser to test endpoints
- **Database Management**: http://localhost/phpmyadmin/
- **Admin Panel**: http://localhost/Tsky/Tsky-react/backend/admin/

## Features in Detail

### Product Management
- Add products with specifications
- Upload product images
- Set pricing and categories
- Manage inventory

### Search & Filter
- Text-based search
- Filter by processor, RAM, graphics, storage
- Price range filtering
- Purpose-based filtering

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Smooth animations

## Production Deployment

For production deployment:

1. Update database credentials
2. Configure proper CORS headers
3. Enable HTTPS
4. Optimize images and assets
5. Set up proper error handling
6. Configure caching strategies

## License

This project is for educational purposes.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify XAMPP services are running
3. Check browser console for errors
4. Review PHP error logs
