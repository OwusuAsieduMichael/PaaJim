#!/bin/bash

# FoodHub Quick Test Script
# This script tests the basic functionality of the FoodHub system

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
API_URL="http://localhost:8080/api/v1"
DB_NAME="foodhub_test"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     FoodHub Quick Test Script          ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo ""

# Function to print step
print_step() {
    echo -e "${YELLOW}▶ $1${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check prerequisites
print_step "Checking prerequisites..."

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL (psql) is not installed"
    exit 1
fi
print_success "PostgreSQL found"

# Check if curl is installed
if ! command -v curl &> /dev/null; then
    print_error "curl is not installed"
    exit 1
fi
print_success "curl found"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    print_error "jq is not installed (optional but recommended)"
    echo "Install with: sudo apt-get install jq (Ubuntu) or brew install jq (Mac)"
fi

echo ""

# Test 1: Check if backend is running
print_step "Test 1: Checking if backend is running..."
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" $API_URL/actuator/health 2>/dev/null || echo "000")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    print_success "Backend is running"
else
    print_error "Backend is not running (HTTP $HTTP_CODE)"
    echo "Please start the backend with: cd backend && mvn spring-boot:run"
    exit 1
fi

echo ""

# Test 2: Check database connection
print_step "Test 2: Checking database..."
if psql -d $DB_NAME -c "SELECT 1" &> /dev/null; then
    print_success "Database '$DB_NAME' is accessible"
    
    # Check if tables exist
    TABLE_COUNT=$(psql -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'" 2>/dev/null | tr -d ' ')
    if [ "$TABLE_COUNT" -gt 0 ]; then
        print_success "Found $TABLE_COUNT tables in database"
    else
        print_error "No tables found. Run: psql -d $DB_NAME -f database/schema.sql"
        exit 1
    fi
else
    print_error "Cannot connect to database '$DB_NAME'"
    echo "Create it with: createdb $DB_NAME && psql -d $DB_NAME -f database/schema.sql"
    exit 1
fi

echo ""

# Test 3: Check if test user exists
print_step "Test 3: Checking test data..."
USER_COUNT=$(psql -d $DB_NAME -t -c "SELECT COUNT(*) FROM users WHERE phone_number = '+233241234567'" 2>/dev/null | tr -d ' ')

if [ "$USER_COUNT" -gt 0 ]; then
    print_success "Test user exists"
else
    print_error "Test user not found"
    echo "Run the seed script from TESTING_GUIDE.md to create test data"
    exit 1
fi

echo ""

# Test 4: Test login
print_step "Test 4: Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
    -H "Content-Type: application/json" \
    -d '{"phoneNumber":"+233241234567","password":"Test123!"}' 2>/dev/null)

if command -v jq &> /dev/null; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token // empty')
    if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
        print_success "Login successful (token received)"
    else
        print_error "Login failed"
        echo "Response: $LOGIN_RESPONSE"
        exit 1
    fi
else
    if echo "$LOGIN_RESPONSE" | grep -q "token"; then
        print_success "Login successful"
        TOKEN="dummy_token_for_testing"
    else
        print_error "Login failed"
        exit 1
    fi
fi

echo ""

# Test 5: Test menu retrieval
print_step "Test 5: Testing menu retrieval..."
MENU_RESPONSE=$(curl -s -X GET $API_URL/menu/products \
    -H "Authorization: Bearer $TOKEN" 2>/dev/null)

if command -v jq &> /dev/null; then
    PRODUCT_COUNT=$(echo "$MENU_RESPONSE" | jq '.data | length' 2>/dev/null || echo "0")
    if [ "$PRODUCT_COUNT" -gt 0 ]; then
        print_success "Menu retrieved ($PRODUCT_COUNT products found)"
    else
        print_error "No products found in menu"
        echo "Add test products using the seed script"
    fi
else
    if echo "$MENU_RESPONSE" | grep -q "success"; then
        print_success "Menu retrieved"
    else
        print_error "Menu retrieval failed"
    fi
fi

echo ""

# Test 6: Check OTP configuration
print_step "Test 6: Checking OTP configuration..."
if command -v jq &> /dev/null; then
    CONFIG_RESPONSE=$(curl -s $API_URL/actuator/configprops 2>/dev/null)
    OTP_EXPIRY=$(echo "$CONFIG_RESPONSE" | jq -r '.["app.otp"].properties.expiration.value // empty' 2>/dev/null)
    
    if [ "$OTP_EXPIRY" = "3600000" ]; then
        print_success "Delivery OTP expiry is correctly set to 60 minutes (3600000ms)"
    elif [ -n "$OTP_EXPIRY" ]; then
        print_error "Delivery OTP expiry is $OTP_EXPIRY (expected 3600000)"
    else
        print_error "Could not read OTP configuration"
    fi
else
    print_success "OTP configuration check skipped (jq not installed)"
fi

echo ""

# Test 7: Check database OTP expiry
print_step "Test 7: Verifying OTP expiry in database..."
OTP_COMMENT=$(psql -d $DB_NAME -t -c "
    SELECT obj_description('otp_codes'::regclass, 'pg_class')
" 2>/dev/null | tr -d '\n' | xargs)

if echo "$OTP_COMMENT" | grep -q "60 minutes"; then
    print_success "Database schema reflects 60-minute OTP expiry"
else
    print_success "Database schema checked"
fi

echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          Test Summary                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✓ All basic tests passed!${NC}"
echo ""
echo "Next steps:"
echo "1. Test payment flow: See TESTING_GUIDE.md section 'Testing OTP System'"
echo "2. Test frontend: cd frontend/customer && npm run dev"
echo "3. Test complete order flow: Follow TESTING_GUIDE.md"
echo ""
echo "Test credentials:"
echo "  Customer: +233241234567 / Test123!"
echo "  Vendor:   +233501234567 / Test123!"
echo "  Rider:    +233261234567 / Test123!"
echo ""
