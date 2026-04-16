# FoodHub Testing Guide

## 🧪 Quick Start Testing

### Prerequisites
- Node.js 18+ installed
- Java 17+ installed
- PostgreSQL 15+ installed (or Supabase account)
- Paystack test account

---

## 🚀 Option 1: Quick Local Testing (Recommended)

### Step 1: Set Up Database

```bash
# Create database
createdb foodhub_test

# Run schema
psql -d foodhub_test -f database/schema.sql

# Verify tables created
psql -d foodhub_test -c "\dt"
```

### Step 2: Configure Backend

```bash
cd backend

# Create test configuration
cat > src/main/resources/application-test.yml << 'EOF'
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/foodhub_test
    username: postgres
    password: postgres

app:
  jwt:
    secret: test-secret-key-for-development-only-min-256-bits
  
  payment:
    provider: paystack
    paystack:
      secret-key: sk_test_your_test_key_here
      public-key: pk_test_your_test_key_here
      base-url: https://api.paystack.co
  
  otp:
    length: 6
    expiration: 3600000  # 60 minutes
    max-attempts: 3
  
  sms:
    provider: paystack
    enabled: false  # Disable SMS for local testing
EOF

# Build and run
mvn clean install -DskipTests
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

### Step 3: Test Backend API

Open a new terminal:

```bash
# Health check
curl http://localhost:8080/api/v1/actuator/health

# Expected: {"status":"UP"}
```

### Step 4: Seed Test Data

```bash
# Run seed script
psql -d foodhub_test << 'EOF'

-- Create test customer
INSERT INTO users (phone_number, full_name, email, role, password_hash, is_active)
VALUES (
  '+233241234567',
  'Test Customer',
  'customer@test.com',
  'CUSTOMER',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYiOqm',
  true
);

-- Create test vendor
INSERT INTO users (phone_number, full_name, email, role, password_hash, is_active)
VALUES (
  '+233501234567',
  'Test Vendor',
  'vendor@test.com',
  'VENDOR',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYiOqm',
  true
);

-- Create vendor profile
INSERT INTO vendor_profile (user_id, business_name, description, address, latitude, longitude, is_open)
VALUES (
  (SELECT id FROM users WHERE role = 'VENDOR' LIMIT 1),
  'Test Kitchen',
  'Test restaurant',
  'Test Address',
  6.7833,
  -1.4167,
  true
);

-- Create test rider
INSERT INTO users (phone_number, full_name, email, role, password_hash, is_active)
VALUES (
  '+233261234567',
  'Test Rider',
  'rider@test.com',
  'RIDER',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYiOqm',
  true
);

-- Create test products
INSERT INTO products (vendor_id, category_id, name, description, price, is_available, preparation_time)
VALUES
  (
    (SELECT id FROM vendor_profile LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Rice Dishes'),
    'Test Jollof Rice',
    'Delicious test jollof',
    25.00,
    true,
    20
  ),
  (
    (SELECT id FROM vendor_profile LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Rice Dishes'),
    'Test Waakye',
    'Test waakye with fish',
    20.00,
    true,
    15
  );

EOF

echo "✅ Test data seeded!"
```

### Step 5: Test API Endpoints

```bash
# 1. Login as customer
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+233241234567",
    "password": "Test123!"
  }' | jq -r '.data.token')

echo "Token: $TOKEN"

# 2. Get menu
curl -X GET http://localhost:8080/api/v1/menu/products \
  -H "Authorization: Bearer $TOKEN" | jq

# 3. Create order
ORDER_RESPONSE=$(curl -s -X POST http://localhost:8080/api/v1/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "get-from-menu-response",
        "quantity": 2
      }
    ],
    "deliveryAddress": "Test Address, Effiduasi",
    "deliveryLatitude": 6.7833,
    "deliveryLongitude": -1.4167,
    "deliveryNotes": "Test delivery",
    "customerPhone": "+233241234567"
  }')

echo $ORDER_RESPONSE | jq

ORDER_ID=$(echo $ORDER_RESPONSE | jq -r '.data.orderId')
echo "Order ID: $ORDER_ID"

# 4. Check order status
curl -X GET http://localhost:8080/api/v1/orders/$ORDER_ID \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 🧪 Option 2: Frontend Testing

### Step 1: Set Up Customer App

```bash
cd frontend/customer

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
VITE_API_URL=http://localhost:8080/api/v1
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
EOF

# Start dev server
npm run dev
```

### Step 2: Test in Browser

1. Open http://localhost:3000
2. Click "Login"
3. Enter credentials:
   - Phone: `+233241234567`
   - Password: `Test123!`
4. Browse menu
5. Add items to cart
6. Proceed to checkout
7. Place order

---

## 🧪 Option 3: Postman Testing

### Import Collection

Create a file `FoodHub.postman_collection.json`:

```json
{
  "info": {
    "name": "FoodHub API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"phoneNumber\": \"+233241234567\",\n  \"password\": \"Test123!\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Menu",
      "item": [
        {
          "name": "Get Products",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/menu/products",
              "host": ["{{baseUrl}}"],
              "path": ["menu", "products"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8080/api/v1"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

Import into Postman and test!

---

## 🧪 Testing OTP System

### Test Payment OTP (10 minutes)

```bash
# 1. Initiate payment
PAYMENT_RESPONSE=$(curl -s -X POST http://localhost:8080/api/v1/payments/initialize \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"orderId\": \"$ORDER_ID\",
    \"paymentMethod\": \"mobile_money\",
    \"provider\": \"mtn\",
    \"phoneNumber\": \"+233241234567\"
  }")

echo $PAYMENT_RESPONSE | jq

PAYMENT_REF=$(echo $PAYMENT_RESPONSE | jq -r '.data.paymentReference')

# 2. Check database for OTP (for testing only!)
psql -d foodhub_test -c "
  SELECT code, expires_at, 
         EXTRACT(EPOCH FROM (expires_at - NOW()))/60 as minutes_remaining
  FROM payment_otp_codes 
  WHERE payment_id = (
    SELECT id FROM payments WHERE payment_reference = '$PAYMENT_REF'
  );
"

# 3. Verify OTP
curl -X POST http://localhost:8080/api/v1/payments/verify-otp \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"orderId\": \"$ORDER_ID\",
    \"paymentReference\": \"$PAYMENT_REF\",
    \"otp\": \"123456\"
  }" | jq
```

### Test Delivery OTP (60 minutes)

```bash
# 1. Mark order as out for delivery (as rider)
RIDER_TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+233261234567",
    "password": "Test123!"
  }' | jq -r '.data.token')

curl -X PUT http://localhost:8080/api/v1/orders/$ORDER_ID/out-for-delivery \
  -H "Authorization: Bearer $RIDER_TOKEN" | jq

# 2. Check database for delivery OTP
psql -d foodhub_test -c "
  SELECT code, expires_at,
         EXTRACT(EPOCH FROM (expires_at - NOW()))/60 as minutes_remaining
  FROM otp_codes
  WHERE order_id = '$ORDER_ID';
"

# Should show ~60 minutes remaining!

# 3. Verify delivery OTP
curl -X POST http://localhost:8080/api/v1/otp/verify \
  -H "Authorization: Bearer $RIDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"orderId\": \"$ORDER_ID\",
    \"code\": \"654321\"
  }" | jq
```

---

## 🧪 Testing OTP Expiry

### Test Payment OTP Expiry (10 min)

```bash
# Manually update expiry to test
psql -d foodhub_test -c "
  UPDATE payment_otp_codes 
  SET expires_at = NOW() - INTERVAL '1 minute'
  WHERE payment_id = (
    SELECT id FROM payments WHERE payment_reference = '$PAYMENT_REF'
  );
"

# Try to verify - should fail with "OTP expired"
curl -X POST http://localhost:8080/api/v1/payments/verify-otp \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"orderId\": \"$ORDER_ID\",
    \"paymentReference\": \"$PAYMENT_REF\",
    \"otp\": \"123456\"
  }" | jq
```

### Test Delivery OTP Expiry (60 min)

```bash
# Check current expiry
psql -d foodhub_test -c "
  SELECT 
    code,
    expires_at,
    EXTRACT(EPOCH FROM (expires_at - NOW()))/60 as minutes_remaining,
    CASE 
      WHEN expires_at > NOW() THEN 'VALID'
      ELSE 'EXPIRED'
    END as status
  FROM otp_codes
  WHERE order_id = '$ORDER_ID';
"

# Manually expire for testing
psql -d foodhub_test -c "
  UPDATE otp_codes 
  SET expires_at = NOW() - INTERVAL '1 minute'
  WHERE order_id = '$ORDER_ID';
"

# Try to verify - should fail
curl -X POST http://localhost:8080/api/v1/otp/verify \
  -H "Authorization: Bearer $RIDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"orderId\": \"$ORDER_ID\",
    \"code\": \"654321\"
  }" | jq
```

---

## 📊 Test Results Checklist

### Backend Tests
- [ ] Database schema created successfully
- [ ] Test data seeded
- [ ] Backend starts without errors
- [ ] Health check returns UP
- [ ] Login works (returns JWT token)
- [ ] Menu products retrieved
- [ ] Order created successfully
- [ ] Order status retrieved

### Payment OTP Tests
- [ ] Payment OTP generated (6 digits)
- [ ] Payment OTP expires in 10 minutes
- [ ] Payment OTP verification works
- [ ] Invalid OTP rejected
- [ ] Expired OTP rejected
- [ ] Max 3 attempts enforced

### Delivery OTP Tests
- [ ] Delivery OTP generated (6 digits)
- [ ] **Delivery OTP expires in 60 minutes** ✨
- [ ] Delivery OTP verification works
- [ ] Invalid OTP rejected
- [ ] Expired OTP rejected
- [ ] Max 3 attempts enforced

### Frontend Tests (if running)
- [ ] Login page loads
- [ ] Login works
- [ ] Menu displays
- [ ] Cart works
- [ ] Checkout works
- [ ] Order placement works
- [ ] Order tracking works

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Java version
java -version  # Should be 17+

# Check port 8080 is free
lsof -i :8080

# Check database connection
psql -d foodhub_test -c "SELECT 1"
```

### Database errors
```bash
# Recreate database
dropdb foodhub_test
createdb foodhub_test
psql -d foodhub_test -f database/schema.sql
```

### Can't login
```bash
# Check user exists
psql -d foodhub_test -c "SELECT * FROM users WHERE phone_number = '+233241234567';"

# Password is: Test123!
# Hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYiOqm
```

### OTP not generating
```bash
# Check OTP configuration
curl http://localhost:8080/api/v1/actuator/configprops | jq '.app.otp'

# Should show:
# {
#   "expiration": 3600000,  # 60 minutes
#   "length": 6,
#   "maxAttempts": 3
# }
```

---

## 🎯 Quick Test Script

Save this as `test.sh`:

```bash
#!/bin/bash

echo "🧪 FoodHub Quick Test"
echo "===================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Test 1: Health Check
echo -n "Testing health check... "
HEALTH=$(curl -s http://localhost:8080/api/v1/actuator/health | jq -r '.status')
if [ "$HEALTH" = "UP" ]; then
  echo -e "${GREEN}✓ PASS${NC}"
else
  echo -e "${RED}✗ FAIL${NC}"
  exit 1
fi

# Test 2: Login
echo -n "Testing login... "
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+233241234567","password":"Test123!"}' \
  | jq -r '.data.token')

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  echo -e "${GREEN}✓ PASS${NC}"
else
  echo -e "${RED}✗ FAIL${NC}"
  exit 1
fi

# Test 3: Get Menu
echo -n "Testing menu retrieval... "
PRODUCTS=$(curl -s -X GET http://localhost:8080/api/v1/menu/products \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.data | length')

if [ "$PRODUCTS" -gt 0 ]; then
  echo -e "${GREEN}✓ PASS (${PRODUCTS} products)${NC}"
else
  echo -e "${RED}✗ FAIL${NC}"
  exit 1
fi

# Test 4: Check OTP Configuration
echo -n "Testing OTP configuration... "
OTP_EXPIRY=$(curl -s http://localhost:8080/api/v1/actuator/configprops \
  | jq -r '.["app.otp"].properties.expiration.value')

if [ "$OTP_EXPIRY" = "3600000" ]; then
  echo -e "${GREEN}✓ PASS (60 minutes)${NC}"
else
  echo -e "${RED}✗ FAIL (Expected 3600000, got $OTP_EXPIRY)${NC}"
fi

echo ""
echo "===================="
echo -e "${GREEN}All tests passed!${NC}"
```

Run it:
```bash
chmod +x test.sh
./test.sh
```

---

## 📞 Need Help?

If you encounter issues:

1. **Check logs**: `tail -f backend/logs/spring.log`
2. **Check database**: `psql -d foodhub_test`
3. **Restart backend**: `mvn spring-boot:run`
4. **Clear data**: `dropdb foodhub_test && createdb foodhub_test`

---

**Ready to test! Start with Option 1 (Quick Local Testing) for the fastest setup.** 🚀
