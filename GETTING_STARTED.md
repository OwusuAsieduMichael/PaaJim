# Getting Started with FoodHub

Complete guide to set up and run FoodHub locally for development.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Java** 17+ ([Download](https://adoptium.net/))
- **Maven** 3.8+ ([Download](https://maven.apache.org/download.cgi))
- **PostgreSQL** 15+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

### Optional Tools
- **Postman** - API testing ([Download](https://www.postman.com/downloads/))
- **pgAdmin** - Database management ([Download](https://www.pgadmin.org/download/))
- **VS Code** - Code editor ([Download](https://code.visualstudio.com/))

### Verify Installation
```bash
node --version    # Should be 18+
java --version    # Should be 17+
mvn --version     # Should be 3.8+
psql --version    # Should be 15+
git --version
```

---

## 🗄️ Step 1: Database Setup

### Option A: Local PostgreSQL

1. **Create database**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE foodhub;

# Exit
\q
```

2. **Run schema**
```bash
# From project root
psql -U postgres -d foodhub -f database/schema.sql
```

3. **Verify tables created**
```bash
psql -U postgres -d foodhub -c "\dt"
```

### Option B: Supabase (Cloud)

1. **Create account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up (free tier available)

2. **Create project**
   - Click "New Project"
   - Name: `foodhub-dev`
   - Choose region closest to you
   - Generate strong password

3. **Run schema**
   - Go to SQL Editor
   - Copy contents of `database/schema.sql`
   - Paste and click "Run"

4. **Get connection string**
   - Go to Settings → Database
   - Copy "Connection string" (URI format)
   - Save for later

---

## 🔧 Step 2: Backend Setup

1. **Navigate to backend**
```bash
cd backend
```

2. **Configure application**
```bash
# Edit src/main/resources/application.yml

# For local PostgreSQL:
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/foodhub
    username: postgres
    password: your_password

# For Supabase:
spring:
  datasource:
    url: jdbc:postgresql://db.xxx.supabase.co:5432/postgres
    username: postgres
    password: your_supabase_password
```

3. **Set environment variables** (optional)
```bash
# Create .env file (not committed to git)
export DATABASE_URL=jdbc:postgresql://localhost:5432/foodhub
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=your_password
export JWT_SECRET=your-secret-key-min-256-bits
```

4. **Build project**
```bash
mvn clean install
```

5. **Run application**
```bash
mvn spring-boot:run
```

6. **Verify backend is running**
```bash
# In another terminal
curl http://localhost:8080/api/v1/actuator/health

# Expected response:
# {"status":"UP"}
```

---

## 🎨 Step 3: Frontend Setup (Customer App)

1. **Navigate to customer app**
```bash
cd frontend/customer
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:8080/api/v1
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
EOF
```

4. **Run development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

---

## 🏪 Step 4: Frontend Setup (Vendor App)

1. **Navigate to vendor app**
```bash
cd frontend/vendor
```

2. **Install and configure**
```bash
npm install

# Create .env
cat > .env << EOF
VITE_API_URL=http://localhost:8080/api/v1
EOF
```

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3001
```

---

## 🚴 Step 5: Frontend Setup (Rider App)

1. **Navigate to rider app**
```bash
cd frontend/rider
```

2. **Install and configure**
```bash
npm install

# Create .env
cat > .env << EOF
VITE_API_URL=http://localhost:8080/api/v1
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
EOF
```

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3002
```

---

## 🗺️ Step 6: Google Maps Setup

### Get API Key

1. **Go to Google Cloud Console**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Create new project: "FoodHub Dev"

2. **Enable APIs**
   - Go to "APIs & Services" → "Library"
   - Enable:
     - Maps JavaScript API
     - Geocoding API
     - Places API

3. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the key

4. **Restrict API Key** (recommended)
   - Click on the key to edit
   - Application restrictions: HTTP referrers
   - Add: `http://localhost:3000/*`, `http://localhost:3002/*`
   - API restrictions: Select only enabled APIs
   - Save

5. **Add to frontend apps**
```bash
# In frontend/customer/.env and frontend/rider/.env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

---

## 📱 Step 7: SMS Setup (Optional for Development)

### Option A: Disable SMS (Development)

In `backend/src/main/resources/application.yml`:
```yaml
app:
  sms:
    enabled: false  # Disable SMS in development
```

### Option B: Use Hubtel (Production-like)

1. **Create Hubtel account**
   - Go to [hubtel.com](https://hubtel.com)
   - Sign up for developer account

2. **Get API credentials**
   - Go to Dashboard → API Keys
   - Create new API key
   - Copy Client ID and Client Secret

3. **Configure backend**
```yaml
app:
  sms:
    enabled: true
    api-key: your_client_id
    api-secret: your_client_secret
    sender-id: FoodHub
```

---

## 🌱 Step 8: Seed Sample Data

### Create Test Users

```sql
-- Connect to database
psql -U postgres -d foodhub

-- Create customer
INSERT INTO users (phone_number, full_name, email, role, password_hash, is_active)
VALUES (
  '+233241234567',
  'Test Customer',
  'customer@test.com',
  'CUSTOMER',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYiOqm', -- password: Test123!
  true
);

-- Create vendor user
INSERT INTO users (phone_number, full_name, email, role, password_hash, is_active)
VALUES (
  '+233501234567',
  'Mama Esi',
  'vendor@test.com',
  'VENDOR',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYiOqm',
  true
);

-- Create vendor profile
INSERT INTO vendor_profile (user_id, business_name, description, address, latitude, longitude, is_open)
VALUES (
  (SELECT id FROM users WHERE role = 'VENDOR' LIMIT 1),
  'Mama Esi''s Kitchen',
  'Authentic Ghanaian cuisine made with love',
  'Effiduasi Market Street, Ghana',
  6.7833,
  -1.4167,
  true
);

-- Create rider
INSERT INTO users (phone_number, full_name, email, role, password_hash, is_active)
VALUES (
  '+233261234567',
  'Kofi Rider',
  'rider@test.com',
  'RIDER',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYiOqm',
  true
);

-- Create sample products
INSERT INTO products (vendor_id, category_id, name, description, price, is_available, preparation_time, image_url)
VALUES
  (
    (SELECT id FROM vendor_profile LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Rice Dishes'),
    'Jollof Rice with Chicken',
    'Spicy Ghanaian jollof rice with grilled chicken',
    25.00,
    true,
    20,
    'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400'
  ),
  (
    (SELECT id FROM vendor_profile LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Rice Dishes'),
    'Waakye with Fish',
    'Rice and beans with fried fish and shito',
    20.00,
    true,
    15,
    'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400'
  ),
  (
    (SELECT id FROM vendor_profile LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Soups & Stews'),
    'Fufu with Light Soup',
    'Pounded cassava with goat meat light soup',
    30.00,
    true,
    25,
    'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400'
  );
```

### Test Credentials

```
Customer:
  Phone: +233241234567
  Password: Test123!

Vendor:
  Phone: +233501234567
  Password: Test123!

Rider:
  Phone: +233261234567
  Password: Test123!
```

---

## ✅ Step 9: Verify Everything Works

### 1. Test Backend API

```bash
# Health check
curl http://localhost:8080/api/v1/actuator/health

# Login as customer
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+233241234567",
    "password": "Test123!"
  }'

# Get menu (use token from login response)
curl http://localhost:8080/api/v1/menu/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 2. Test Customer App

1. Open http://localhost:3000
2. Click "Login"
3. Enter: `+233241234567` / `Test123!`
4. Browse menu
5. Add items to cart
6. Proceed to checkout
7. Select location on map
8. Place order

### 3. Test Vendor App

1. Open http://localhost:3001
2. Login: `+233501234567` / `Test123!`
3. View incoming order
4. Click "Accept Order"
5. Verify order status changes

### 4. Test Rider App

1. Open http://localhost:3002
2. Login: `+233261234567` / `Test123!`
3. View assigned delivery
4. Enter OTP: Check database or logs for generated OTP
5. Confirm delivery

---

## 🐛 Troubleshooting

### Backend won't start

**Error: "Could not connect to database"**
```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -U postgres -d foodhub -c "SELECT 1"

# Check credentials in application.yml
```

**Error: "Port 8080 already in use"**
```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 <PID>

# Or change port in application.yml
server:
  port: 8081
```

### Frontend won't start

**Error: "Cannot find module"**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error: "VITE_API_URL is not defined"**
```bash
# Create .env file
echo "VITE_API_URL=http://localhost:8080/api/v1" > .env
```

### Maps not loading

**Error: "Google Maps JavaScript API error"**
```bash
# Check API key is set
cat .env | grep GOOGLE_MAPS

# Verify key in Google Cloud Console
# Check billing is enabled
# Check APIs are enabled
```

### CORS errors

**Error: "Access-Control-Allow-Origin"**
```bash
# Check CORS configuration in backend
# Verify frontend URL is in CORS_ORIGINS

# In application.yml:
app:
  cors:
    allowed-origins: http://localhost:3000,http://localhost:3001,http://localhost:3002
```

---

## 📚 Next Steps

### Learn the System
1. Read [SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md)
2. Review [API_SPECIFICATION.md](docs/API_SPECIFICATION.md)
3. Study [UI_UX_DESIGN_SYSTEM.md](docs/UI_UX_DESIGN_SYSTEM.md)

### Development Workflow
1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Test locally
4. Commit: `git commit -m "Add my feature"`
5. Push: `git push origin feature/my-feature`
6. Create pull request

### Deploy to Production
Follow [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

---

## 🎉 Success!

You now have FoodHub running locally:

- ✅ Backend API: http://localhost:8080
- ✅ Customer App: http://localhost:3000
- ✅ Vendor App: http://localhost:3001
- ✅ Rider App: http://localhost:3002
- ✅ Database: PostgreSQL with sample data
- ✅ Google Maps: Integrated

**Ready to develop!** 🚀

---

## 📞 Need Help?

- **Documentation**: See `/docs` folder
- **API Reference**: [API_SPECIFICATION.md](docs/API_SPECIFICATION.md)
- **Issues**: Create GitHub issue
- **Email**: tech@foodhub.gh

---

## 🔗 Quick Links

- [Project Summary](PROJECT_SUMMARY.md)
- [System Architecture](docs/SYSTEM_ARCHITECTURE.md)
- [API Specification](docs/API_SPECIFICATION.md)
- [UI/UX Design System](docs/UI_UX_DESIGN_SYSTEM.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [Wireframes](docs/WIREFRAMES_AND_USER_FLOWS.md)
