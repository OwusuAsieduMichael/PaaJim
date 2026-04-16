# FoodHub - Quick Reference Card

## 🚀 Start All Servers

### Backend (Already Running ✓)
```powershell
cd backend
mvn spring-boot:run
```
**URL:** http://localhost:8080

---

### Frontend Apps (Open 3 separate terminals)

#### Terminal 1 - Customer App
```powershell
cd frontend/customer
npm install    # First time only
npm run dev
```
**URL:** http://localhost:3000

#### Terminal 2 - Vendor App
```powershell
cd frontend/vendor
npm install    # First time only
npm run dev
```
**URL:** http://localhost:3001

#### Terminal 3 - Rider App
```powershell
cd frontend/rider
npm install    # First time only
npm run dev
```
**URL:** http://localhost:3002

---

## 📋 Application Overview

| App | Port | Purpose | Key Features |
|-----|------|---------|--------------|
| **Backend** | 8080 | REST API | Order management, OTP verification, Paystack integration |
| **Customer** | 3000 | Order food | Browse menu, place orders, track delivery |
| **Vendor** | 3001 | Manage orders | Accept orders, view order details |
| **Rider** | 3002 | Deliver orders | View deliveries, verify OTP, navigate to customer |

---

## 🔑 Key System Features

### Payment Flow (Paystack)
1. Customer places order → **PENDING**
2. Payment initiated → **PAYMENT_INITIATED**
3. Customer receives Payment OTP (10 min validity)
4. Payment verified → **PAYMENT_VERIFIED**
5. Vendor accepts → **CONFIRMED**
6. Rider assigned → **OUT_FOR_DELIVERY**
7. Delivery OTP sent (60 min validity)
8. Rider verifies OTP → **DELIVERED**

### OTP System
- **Payment OTP:** 10 minutes validity
- **Delivery OTP:** 60 minutes (1 hour) validity
- SMS sent via Paystack

---

## 🛠️ Common Commands

### Check Running Processes
```powershell
# Check if port is in use
netstat -ano | findstr :8080    # Backend
netstat -ano | findstr :3000    # Customer
netstat -ano | findstr :3001    # Vendor
netstat -ano | findstr :3002    # Rider
```

### Kill Process on Port
```powershell
# Find PID
netstat -ano | findstr :3000

# Kill process (replace <PID> with actual number)
taskkill /PID <PID> /F
```

### Clear npm Cache
```powershell
npm cache clean --force
```

### Reinstall Dependencies
```powershell
rm -r node_modules
npm install
```

---

## 📁 Project Structure

```
FoodHub/
├── backend/                 # Spring Boot API
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── pom.xml
├── frontend/
│   ├── customer/           # Customer React app
│   ├── vendor/             # Vendor React app
│   └── rider/              # Rider React app
├── database/
│   └── schema.sql          # PostgreSQL schema
└── docs/                   # Documentation
```

---

## 🔧 Configuration Files

### Backend Config
**File:** `backend/src/main/resources/application.yml`
- Database connection
- Paystack API keys
- OTP expiration times
- SMS templates

### Frontend Config
**Files:** `frontend/*/. env`
- API base URL
- Google Maps API key
- App name

---

## 📞 API Endpoints (Key)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}/status` - Update status

### Payments
- `POST /api/payments/initiate` - Start payment
- `POST /api/payments/verify-otp` - Verify payment OTP

### OTP
- `POST /api/otp/verify-delivery` - Verify delivery OTP
- `POST /api/otp/resend` - Resend OTP

---

## 🎨 UI Components

### Customer App
- MenuCard - Display food items
- OrderStatusTimeline - Track order progress
- LocationPicker - Select delivery location

### Vendor App
- Order list with accept button
- Order details view
- Real-time notifications

### Rider App
- DeliveryCard - Delivery details
- Call customer button
- Open in Maps button
- OTP verification input

---

## 🐛 Troubleshooting Quick Fixes

### Frontend won't start
```powershell
rm -r node_modules
npm install
npm run dev
```

### Backend errors
```powershell
cd backend
mvn clean install
mvn spring-boot:run
```

### Database connection issues
- Check PostgreSQL is running
- Verify credentials in `application.yml`
- Ensure database exists

### Port conflicts
```powershell
netstat -ano | findstr :<PORT>
taskkill /PID <PID> /F
```

---

## 📚 Documentation

- `README.md` - Project overview
- `WINDOWS_SETUP_GUIDE.md` - Detailed setup instructions
- `TESTING_GUIDE.md` - Testing procedures
- `docs/SYSTEM_ARCHITECTURE.md` - System design
- `docs/API_SPECIFICATION.md` - API documentation
- `docs/PAYMENT_SYSTEM.md` - Payment flow details
- `docs/OTP_TIMING_GUIDE.md` - OTP configuration

---

## ✅ Pre-Flight Checklist

Before testing:
- [ ] PostgreSQL running
- [ ] Backend running (port 8080)
- [ ] Customer app running (port 3000)
- [ ] Vendor app running (port 3001)
- [ ] Rider app running (port 3002)
- [ ] Paystack API keys configured
- [ ] Database schema loaded

---

## 🎯 Test Scenario

1. **Customer:** Browse menu → Add items → Checkout
2. **Customer:** Enter phone → Select location → Place order
3. **Customer:** Receive Payment OTP → Verify payment
4. **Vendor:** See new order → Accept order
5. **Rider:** See delivery → Call customer → Navigate
6. **Customer:** Receive Delivery OTP
7. **Rider:** Enter OTP → Confirm delivery
8. **All:** See order status updated to DELIVERED

---

**Need help?** Check `WINDOWS_SETUP_GUIDE.md` for detailed instructions!
