# FoodHub Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying FoodHub to production for Effiduasi, Ghana.

### Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    CLOUDFLARE CDN                        │
│                  (Static Assets + SSL)                   │
└─────────────────────────────────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    ┌────▼─────┐      ┌─────▼────┐      ┌─────▼────┐
    │ Customer │      │  Vendor  │      │  Rider   │
    │   App    │      │   App    │      │   App    │
    │ (Vercel) │      │ (Vercel) │      │ (Vercel) │
    └──────────┘      └──────────┘      └──────────┘
                            │
                            │ HTTPS
                            ▼
                    ┌───────────────┐
                    │   API Server  │
                    │  (Railway)    │
                    └───────┬───────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    ┌────▼─────┐      ┌─────▼────┐      ┌─────▼────┐
    │PostgreSQL│      │  Hubtel  │      │  Google  │
    │(Supabase)│      │   SMS    │      │   Maps   │
    └──────────┘      └──────────┘      └──────────┘
```

## 📋 Prerequisites

### Required Accounts
1. **Supabase** (Database)
   - Sign up: https://supabase.com
   - Free tier: 500MB database, 2GB bandwidth
   
2. **Railway** (Backend hosting)
   - Sign up: https://railway.app
   - Free tier: $5 credit/month
   
3. **Vercel** (Frontend hosting)
   - Sign up: https://vercel.com
   - Free tier: Unlimited deployments
   
4. **Hubtel** (SMS service)
   - Sign up: https://hubtel.com
   - Ghana-based SMS provider
   
5. **Google Cloud** (Maps API)
   - Sign up: https://console.cloud.google.com
   - $200 free credit

### Required Tools
- Git
- Node.js 18+
- Java 17+
- Maven 3.8+
- PostgreSQL client (optional, for local dev)

## 🗄️ Database Setup (Supabase)

### Step 1: Create Project
```bash
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: foodhub-production
4. Database Password: [Generate strong password]
5. Region: Choose closest to Ghana (e.g., eu-west-1)
6. Click "Create new project"
```

### Step 2: Run Schema
```bash
1. Go to SQL Editor in Supabase dashboard
2. Copy contents of database/schema.sql
3. Paste and click "Run"
4. Verify tables created successfully
```

### Step 3: Get Connection String
```bash
# In Supabase Dashboard → Settings → Database
# Copy "Connection string" (URI format)

postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Step 4: Create Initial Data
```sql
-- Create admin user
INSERT INTO users (phone_number, full_name, email, role, password_hash, is_active)
VALUES (
  '+233501234567',
  'Admin User',
  'admin@foodhub.gh',
  'ADMIN',
  '$2a$12$[BCRYPT_HASH]', -- Generate using BCrypt
  true
);

-- Create vendor profile
INSERT INTO vendor_profile (user_id, business_name, description, address, latitude, longitude, is_open)
VALUES (
  (SELECT id FROM users WHERE role = 'VENDOR' LIMIT 1),
  'Mama Esi''s Kitchen',
  'Authentic Ghanaian cuisine made with love',
  'Effiduasi Market Street',
  6.7833,
  -1.4167,
  true
);

-- Create sample products
INSERT INTO products (vendor_id, category_id, name, description, price, is_available, preparation_time)
VALUES
  ((SELECT id FROM vendor_profile LIMIT 1), (SELECT id FROM categories WHERE name = 'Rice Dishes'), 'Jollof Rice with Chicken', 'Spicy Ghanaian jollof with grilled chicken', 25.00, true, 20),
  ((SELECT id FROM vendor_profile LIMIT 1), (SELECT id FROM categories WHERE name = 'Rice Dishes'), 'Waakye with Fish', 'Rice and beans with fried fish', 20.00, true, 15),
  ((SELECT id FROM vendor_profile LIMIT 1), (SELECT id FROM categories WHERE name = 'Soups & Stews'), 'Fufu with Light Soup', 'Pounded cassava with goat meat soup', 30.00, true, 25);
```

## 🔧 Backend Deployment (Railway)

### Step 1: Prepare Application
```bash
# Update application.yml for production
spring:
  profiles:
    active: production
  
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}

app:
  jwt:
    secret: ${JWT_SECRET}
  sms:
    api-key: ${HUBTEL_API_KEY}
    api-secret: ${HUBTEL_API_SECRET}
  maps:
    google-api-key: ${GOOGLE_MAPS_API_KEY}
```

### Step 2: Build Application
```bash
cd backend
mvn clean package -DskipTests

# Verify JAR created
ls target/foodhub-api-1.0.0.jar
```

### Step 3: Deploy to Railway
```bash
# Option 1: Railway CLI
railway login
railway init
railway up

# Option 2: GitHub Integration
1. Push code to GitHub
2. Go to Railway dashboard
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Spring Boot
```

### Step 4: Configure Environment Variables
```bash
# In Railway Dashboard → Variables
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=[SUPABASE_PASSWORD]
JWT_SECRET=[GENERATE_256_BIT_SECRET]
HUBTEL_API_KEY=[YOUR_HUBTEL_KEY]
HUBTEL_API_SECRET=[YOUR_HUBTEL_SECRET]
HUBTEL_SENDER_ID=FoodHub
GOOGLE_MAPS_API_KEY=[YOUR_GOOGLE_KEY]
CORS_ORIGINS=https://customer.foodhub.gh,https://vendor.foodhub.gh,https://rider.foodhub.gh
PORT=8080
```

### Step 5: Verify Deployment
```bash
# Check health endpoint
curl https://[YOUR-RAILWAY-URL]/api/v1/actuator/health

# Expected response:
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" }
  }
}
```

## 🌐 Frontend Deployment (Vercel)

### Customer App

#### Step 1: Configure Environment
```bash
# frontend/customer/.env.production
VITE_API_URL=https://[YOUR-RAILWAY-URL]/api/v1
VITE_GOOGLE_MAPS_API_KEY=[YOUR_GOOGLE_KEY]
```

#### Step 2: Build
```bash
cd frontend/customer
npm install
npm run build

# Verify build
ls dist/
```

#### Step 3: Deploy to Vercel
```bash
# Option 1: Vercel CLI
npm install -g vercel
vercel --prod

# Option 2: GitHub Integration
1. Push to GitHub
2. Go to Vercel dashboard
3. Click "New Project"
4. Import from GitHub
5. Configure:
   - Framework: Vite
   - Root Directory: frontend/customer
   - Build Command: npm run build
   - Output Directory: dist
6. Add environment variables
7. Click "Deploy"
```

#### Step 4: Custom Domain (Optional)
```bash
# In Vercel Dashboard → Domains
1. Add domain: customer.foodhub.gh
2. Configure DNS:
   - Type: CNAME
   - Name: customer
   - Value: cname.vercel-dns.com
3. Wait for SSL certificate (automatic)
```

### Vendor App
```bash
# Repeat same steps for vendor app
cd frontend/vendor
# Same deployment process
# Domain: vendor.foodhub.gh
```

### Rider App
```bash
# Repeat same steps for rider app
cd frontend/rider
# Same deployment process
# Domain: rider.foodhub.gh
```

## 📱 SMS Setup (Hubtel)

### Step 1: Create Account
```bash
1. Go to https://hubtel.com
2. Sign up for business account
3. Verify phone number and business details
4. Top up account (minimum GH₵50)
```

### Step 2: Get API Credentials
```bash
1. Go to Dashboard → API Keys
2. Create new API key
3. Copy:
   - Client ID (API Key)
   - Client Secret (API Secret)
4. Add to Railway environment variables
```

### Step 3: Configure Sender ID
```bash
1. Go to Dashboard → Sender IDs
2. Request new Sender ID: "FoodHub"
3. Wait for approval (1-2 business days)
4. Once approved, update HUBTEL_SENDER_ID in Railway
```

### Step 4: Test SMS
```bash
# Use Postman or curl
POST https://[YOUR-RAILWAY-URL]/api/v1/test/sms
{
  "phoneNumber": "+233241234567",
  "message": "Test message from FoodHub"
}
```

## 🗺️ Google Maps Setup

### Step 1: Create Project
```bash
1. Go to https://console.cloud.google.com
2. Create new project: "FoodHub"
3. Enable billing (required for Maps API)
```

### Step 2: Enable APIs
```bash
1. Go to APIs & Services → Library
2. Enable:
   - Maps JavaScript API
   - Geocoding API
   - Places API
```

### Step 3: Create API Key
```bash
1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → "API Key"
3. Copy API key
4. Click "Restrict Key":
   - Application restrictions: HTTP referrers
   - Add: https://customer.foodhub.gh/*
   - API restrictions: Select enabled APIs only
5. Save
```

### Step 4: Set Usage Limits
```bash
1. Go to APIs & Services → Quotas
2. Set daily limits:
   - Maps JavaScript API: 10,000 requests/day
   - Geocoding API: 5,000 requests/day
3. Set up billing alerts at $50, $100
```

## 🔒 Security Hardening

### SSL/TLS
```bash
# Vercel and Railway provide automatic SSL
# Verify HTTPS:
curl -I https://customer.foodhub.gh
# Should return: HTTP/2 200
```

### CORS Configuration
```java
// In Spring Boot
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
            "https://customer.foodhub.gh",
            "https://vendor.foodhub.gh",
            "https://rider.foodhub.gh"
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        config.setAllowCredentials(true);
        return new CorsFilter(source);
    }
}
```

### Rate Limiting
```java
// Add to Spring Boot
@Configuration
public class RateLimitConfig {
    @Bean
    public RateLimiter rateLimiter() {
        return RateLimiter.create(100.0); // 100 requests/second
    }
}
```

### Environment Variables
```bash
# NEVER commit these to Git
# Use .env files locally
# Use platform secrets in production

# Generate secure JWT secret:
openssl rand -base64 64
```

## 📊 Monitoring Setup

### Railway Logs
```bash
# View logs in Railway dashboard
railway logs

# Or use CLI
railway logs --tail
```

### Supabase Monitoring
```bash
# In Supabase Dashboard → Database
- Monitor active connections
- Check slow queries
- Review table sizes
```

### Vercel Analytics
```bash
# Enable in Vercel Dashboard → Analytics
- Page views
- Load times
- Error rates
```

### Custom Monitoring
```bash
# Add to Spring Boot
@RestController
@RequestMapping("/api/v1/admin/metrics")
public class MetricsController {
    
    @GetMapping("/orders")
    public Map<String, Object> getOrderMetrics() {
        return Map.of(
            "totalOrders", orderRepository.count(),
            "pendingOrders", orderRepository.countByStatus(OrderStatus.PENDING),
            "deliveredToday", orderRepository.countDeliveredToday()
        );
    }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      - run: cd backend && mvn clean package
      - run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
  
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd frontend/customer && npm ci && npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## 🧪 Production Testing

### Smoke Tests
```bash
# 1. Health check
curl https://api.foodhub.gh/api/v1/actuator/health

# 2. Register user
curl -X POST https://api.foodhub.gh/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+233241234567","fullName":"Test User","password":"Test123!","role":"CUSTOMER"}'

# 3. Login
curl -X POST https://api.foodhub.gh/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+233241234567","password":"Test123!"}'

# 4. Get menu
curl https://api.foodhub.gh/api/v1/menu/products \
  -H "Authorization: Bearer [TOKEN]"

# 5. Place test order
# 6. Confirm order (vendor)
# 7. Mark out for delivery (rider)
# 8. Verify OTP delivery (check SMS)
# 9. Confirm delivery with OTP
```

### Load Testing (Optional)
```bash
# Using Apache Bench
ab -n 1000 -c 10 https://api.foodhub.gh/api/v1/menu/products

# Using k6
k6 run load-test.js
```

## 📱 Mobile App Deployment (Future)

### Progressive Web App (PWA)
```javascript
// Add to frontend apps
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa';

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'FoodHub Customer',
        short_name: 'FoodHub',
        theme_color: '#FF6B35',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
};
```

## 🆘 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check Supabase status
# Verify DATABASE_URL is correct
# Check IP allowlist in Supabase (allow all: 0.0.0.0/0)
```

#### SMS Not Sending
```bash
# Verify Hubtel account has credit
# Check Sender ID is approved
# Verify phone number format: +233XXXXXXXXX
# Check Hubtel API logs
```

#### CORS Errors
```bash
# Verify CORS_ORIGINS includes frontend URLs
# Check browser console for exact error
# Ensure credentials: true in frontend requests
```

#### Maps Not Loading
```bash
# Verify Google Maps API key is valid
# Check API key restrictions
# Ensure billing is enabled
# Check browser console for errors
```

## 📞 Support Contacts

- **Technical Issues**: tech@foodhub.gh
- **Supabase Support**: https://supabase.com/support
- **Railway Support**: https://railway.app/help
- **Hubtel Support**: +233 30 281 0100
- **Google Cloud Support**: https://cloud.google.com/support

## 🎉 Go Live Checklist

- [ ] Database schema deployed
- [ ] Initial data seeded (vendor, products)
- [ ] Backend deployed and health check passing
- [ ] All three frontend apps deployed
- [ ] Custom domains configured (optional)
- [ ] SSL certificates active
- [ ] SMS sending successfully
- [ ] Google Maps loading correctly
- [ ] End-to-end order flow tested
- [ ] OTP delivery and verification working
- [ ] Monitoring and logging configured
- [ ] Backup strategy in place
- [ ] Team trained on admin functions
- [ ] Customer support process defined
- [ ] Marketing materials ready
- [ ] Launch announcement prepared

## 🚀 Launch Day

1. **Soft Launch** (Week 1)
   - Invite 10-20 test customers
   - Monitor closely for issues
   - Gather feedback
   
2. **Public Launch** (Week 2)
   - Announce on social media
   - Local radio/newspaper ads
   - Flyers in Effiduasi
   
3. **Post-Launch** (Week 3-4)
   - Monitor metrics daily
   - Respond to feedback
   - Fix bugs quickly
   - Plan improvements

**Congratulations! FoodHub is now live! 🎉**
