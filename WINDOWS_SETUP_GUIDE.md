# FoodHub - Windows Setup Guide

## Prerequisites

Before starting, ensure you have:
- ✅ Node.js (v18 or higher) - [Download](https://nodejs.org/)
- ✅ Java JDK 17 or higher - [Download](https://adoptium.net/)
- ✅ PostgreSQL - [Download](https://www.postgresql.org/download/windows/)
- ✅ Maven - [Download](https://maven.apache.org/download.cgi)

## Backend Setup (Already Running ✓)

Your backend is already running on port 8080 (PID: 5052).

To restart the backend if needed:
```powershell
# Navigate to backend directory
cd backend

# Run with Maven
mvn spring-boot:run
```

## Frontend Setup

You have 3 frontend applications to set up:

### 1. Customer App (Port 3000)

```powershell
# Navigate to customer directory
cd frontend/customer

# Install dependencies (this may take a few minutes)
npm install

# Start the development server
npm run dev
```

The customer app will open at: **http://localhost:3000**

### 2. Vendor App (Port 3001)

Open a **new terminal** and run:

```powershell
# Navigate to vendor directory
cd frontend/vendor

# Install dependencies
npm install

# Start the development server
npm run dev
```

The vendor app will open at: **http://localhost:3001**

### 3. Rider App (Port 3002)

Open **another new terminal** and run:

```powershell
# Navigate to rider directory
cd frontend/rider

# Install dependencies
npm install

# Start the development server
npm run dev
```

The rider app will open at: **http://localhost:3002**

## Quick Start Commands

### Start All Frontend Apps (Run each in separate terminals)

**Terminal 1 - Customer:**
```powershell
cd frontend/customer && npm run dev
```

**Terminal 2 - Vendor:**
```powershell
cd frontend/vendor && npm run dev
```

**Terminal 3 - Rider:**
```powershell
cd frontend/rider && npm run dev
```

## Troubleshooting

### Port Already in Use

If you get a port conflict error:

```powershell
# Find process using the port (e.g., 3000)
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### npm install Timeout

If npm install times out:

```powershell
# Increase timeout
npm install --timeout=60000

# Or use alternative registry
npm install --registry=https://registry.npmjs.org/
```

### Backend Not Running

Check if backend is running:

```powershell
# Check if port 8080 is in use
netstat -ano | findstr :8080
```

If not running, start it:

```powershell
cd backend
mvn spring-boot:run
```

## Application URLs

Once all apps are running:

| Application | URL | Description |
|------------|-----|-------------|
| **Backend API** | http://localhost:8080 | Spring Boot REST API |
| **Customer App** | http://localhost:3000 | Customer ordering interface |
| **Vendor App** | http://localhost:3001 | Vendor order management |
| **Rider App** | http://localhost:3002 | Rider delivery dashboard |

## Environment Variables

Each frontend app has a `.env` file with configuration:

### Customer App (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=FoodHub
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Vendor App (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=FoodHub Vendor
```

### Rider App (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=FoodHub Rider
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**Note:** Replace `your_google_maps_api_key_here` with your actual Google Maps API key.

## Next Steps

1. ✅ Install dependencies for all three frontend apps
2. ✅ Start all three development servers
3. ✅ Open each app in your browser
4. ✅ Test the system end-to-end

## Development Workflow

### Making Changes

All apps use **hot reload** - changes are reflected immediately:

- Edit files in `src/` directory
- Save the file
- Browser automatically refreshes

### Building for Production

```powershell
# Customer app
cd frontend/customer
npm run build

# Vendor app
cd frontend/vendor
npm run build

# Rider app
cd frontend/rider
npm run build
```

Production builds are created in the `dist/` directory.

## Common Issues

### 1. "Cannot find module" errors

Solution:
```powershell
# Delete node_modules and reinstall
rm -r node_modules
npm install
```

### 2. Backend connection errors

- Verify backend is running on port 8080
- Check `.env` file has correct `VITE_API_BASE_URL`
- Ensure no firewall is blocking localhost connections

### 3. Styling not working

Solution:
```powershell
# Rebuild Tailwind CSS
npm run dev
```

## Support

For issues or questions:
1. Check the main `README.md`
2. Review `TESTING_GUIDE.md`
3. Check `docs/` directory for detailed documentation

---

**Ready to start?** Open 3 terminals and run the commands above! 🚀
