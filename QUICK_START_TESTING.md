# Quick Start Testing Guide

## 🚀 Get Testing in 5 Minutes!

### Step 1: Setup (One-time)

```bash
# Make scripts executable
chmod +x setup-test-env.sh quick-test.sh

# Run setup script
./setup-test-env.sh
```

This will:
- ✅ Create test database
- ✅ Run database schema
- ✅ Seed test data (3 users, 3 products)
- ✅ Configure backend
- ✅ Build backend

### Step 2: Start Backend

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

Wait for: `Started FoodHubApplication in X seconds`

### Step 3: Run Tests

Open a **new terminal**:

```bash
./quick-test.sh
```

You should see:
```
✓ Backend is running
✓ Database 'foodhub_test' is accessible
✓ Test user exists
✓ Login successful
✓ Menu retrieved (3 products found)
✓ Delivery OTP expiry is correctly set to 60 minutes
✓ All basic tests passed!
```

---

## 🧪 What Gets Tested?

### Automated Tests (quick-test.sh)
1. ✅ Backend health check
2. ✅ Database connectivity
3. ✅ Test data existence
4. ✅ User login (JWT authentication)
5. ✅ Menu retrieval
6. ✅ **OTP configuration (60-minute expiry)** ✨
7. ✅ Database schema validation

### Manual Tests (Optional)

#### Test Payment Flow
```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+233241234567","password":"Test123!"}' \
  | jq -r '.data.token')

# Get products
curl -X GET http://localhost:8080/api/v1/menu/products \
  -H "Authorization: Bearer $TOKEN" | jq

# Create order (replace PRODUCT_ID with actual ID from menu)
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": "PRODUCT_ID", "quantity": 2}],
    "deliveryAddress": "Test Address",
    "deliveryLatitude": 6.7833,
    "deliveryLongitude": -1.4167,
    "customerPhone": "+233241234567"
  }' | jq
```

#### Test OTP Expiry
```bash
# Check delivery OTP expiry in database
psql -d foodhub_test -c "
  SELECT 
    'Delivery OTP Expiry' as test,
    EXTRACT(EPOCH FROM (expires_at - generated_at))/60 as minutes
  FROM otp_codes 
  LIMIT 1;
"

# Should show: 60 minutes
```

---

## 📊 Test Credentials

| Role | Phone | Password | Email |
|------|-------|----------|-------|
| Customer | +233241234567 | Test123! | customer@test.com |
| Vendor | +233501234567 | Test123! | vendor@test.com |
| Rider | +233261234567 | Test123! | rider@test.com |

---

## 🎯 Testing Checklist

### Basic Tests
- [ ] Backend starts successfully
- [ ] Database connection works
- [ ] Login works (all 3 roles)
- [ ] Menu retrieval works
- [ ] Order creation works

### OTP Tests
- [ ] Payment OTP expires in 10 minutes
- [ ] **Delivery OTP expires in 60 minutes** ✨
- [ ] OTP verification works
- [ ] Invalid OTP rejected
- [ ] Expired OTP rejected

### Payment Tests (with Paystack test keys)
- [ ] Payment initialization works
- [ ] Payment OTP sent
- [ ] Payment verification works
- [ ] Order status updates correctly

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Java version
java -version  # Must be 17+

# Check port 8080
lsof -i :8080  # Should be empty

# Check logs
tail -f backend/logs/spring.log
```

### Tests fail
```bash
# Recreate database
dropdb foodhub_test
./setup-test-env.sh

# Restart backend
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

### Database connection error
```bash
# Check PostgreSQL is running
pg_isready

# Check credentials in application-test.yml
cat backend/src/main/resources/application-test.yml
```

---

## 📱 Test Frontend (Optional)

### Customer App
```bash
cd frontend/customer
npm install
cat > .env << 'EOF'
VITE_API_URL=http://localhost:8080/api/v1
VITE_GOOGLE_MAPS_API_KEY=your_key_here
EOF
npm run dev
```

Open: http://localhost:3000

### Vendor App
```bash
cd frontend/vendor
npm install
cat > .env << 'EOF'
VITE_API_URL=http://localhost:8080/api/v1
EOF
npm run dev
```

Open: http://localhost:3001

### Rider App
```bash
cd frontend/rider
npm install
cat > .env << 'EOF'
VITE_API_URL=http://localhost:8080/api/v1
VITE_GOOGLE_MAPS_API_KEY=your_key_here
EOF
npm run dev
```

Open: http://localhost:3002

---

## 🎉 Success!

If all tests pass, you have:
- ✅ Working backend API
- ✅ Connected database
- ✅ Test data loaded
- ✅ Authentication working
- ✅ **60-minute delivery OTP configured** ✨

---

## 📚 Next Steps

1. **Read full testing guide**: `TESTING_GUIDE.md`
2. **Test payment flow**: See payment OTP section
3. **Test delivery flow**: See delivery OTP section
4. **Deploy to production**: See `docs/DEPLOYMENT_GUIDE.md`

---

## 📞 Need Help?

- **Full testing guide**: `TESTING_GUIDE.md`
- **API documentation**: `docs/API_SPECIFICATION.md`
- **System architecture**: `docs/SYSTEM_ARCHITECTURE.md`
- **OTP timing details**: `docs/OTP_TIMING_GUIDE.md`

---

**Happy Testing! 🚀**
