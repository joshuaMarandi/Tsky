# Tsky - Computer Store Frontend

A modern React + TypeScript e-commerce frontend for Tsky Computer Store, built with Vite.

## Features

- 🖥️ Product catalog with filtering and search
- 🛒 Shopping cart functionality
- 👤 Admin panel for product management
- 🔐 Secure authentication system
- 📱 Responsive design
- ⚡ Fast development with Vite

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **Icons**: Font Awesome
- **Routing**: React Router DOM
- **Backend**: PHP API (hosted separately)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Tsky
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```bash
VITE_API_BASE_URL=/backend/api  # For local development
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Setup

The application supports multiple environments for development and production:

### Environment Files

1. **`.env.development`** - Development with hosted backend (recommended)
2. **`.env.local`** - Local development with hosted backend
3. **`.env.localhost`** - Local development with local backend (for debugging)
4. **`.env.production`** - Production environment

### 🔄 **Auto-Database Detection**

The backend **automatically detects** the environment and uses the appropriate database:

- **🏠 Localhost/Local Development**: Uses local MySQL (`localhost/Tsky`)
- **🌐 Hosted/Production**: Uses InfinityFree database (`sql313.infinityfree.com/if0_39779787_tsky`)

**No manual database configuration needed!** The system automatically switches between databases based on the server environment.

### Development Workflow

**Option 1: Consistent Development (Recommended)**
```bash
cp .env.example .env.development
npm run dev
# Uses hosted backend, auto-detects database
```

**Option 2: Local Debugging**
```bash
cp .env.example .env.localhost
npm run dev
# Uses local backend, auto-detects local database
```

**Option 3: Production**
```bash
cp .env.example .env.production
npm run build
# Uses hosted backend, auto-detects hosted database
```

## API Endpoints

The application works with the following API endpoints:

- **Products**: `GET/POST/PUT/DELETE /api/products.php`
- **Authentication**: `POST /auth.php`
- **Sales**: `GET/POST/DELETE /api/sales.php`
- **Sold Out Status**: `POST /api/sold-out.php`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── admin/                 # Admin panel components
│   ├── components/       # Admin-specific components
│   ├── context/          # Admin authentication context
│   └── pages/            # Admin pages
├── assets/               # Static assets
├── components/           # Shared components
│   ├── layout/          # Layout components
│   └── product/         # Product-related components
├── context/              # React contexts
├── pages/                # Main application pages
└── App.tsx              # Main application component
```

## Deployment

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_BASE_URL=https://your-backend.com/api`

### Manual Deployment

```bash
npm run build
```

Upload the `dist` folder contents to your web server.

## API Integration

The frontend communicates with a PHP backend API. Make sure your backend is running and accessible.

### API Endpoints Used

- `GET /api/products.php` - Fetch products
- `POST /auth.php` - Admin authentication
- `POST /api/sold-out.php` - Update product availability

## Contributing

1. Fork the repository
2. Create your changes
3. Run tests and linting
4. Submit a pull request

## License

This project is licensed under the MIT License.
