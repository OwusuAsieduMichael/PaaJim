#!/bin/bash

# FoodHub Test Environment Setup Script
# This script sets up everything needed for testing

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

DB_NAME="foodhub_test"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   FoodHub Test Environment Setup      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
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

# Step 1: Check prerequisites
print_step "Step 1: Checking prerequisites..."

if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL is not installed"
    echo "Install PostgreSQL: https://www.postgresql.org/download/"
    exit 1
fi
print_success "PostgreSQL found"

if ! command -v java &> /dev/null; then
    print_error "Java is not installed"
    echo "Install Java 17+: https://adoptium.net/"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    print_error "Java 17+ required (found Java $JAVA_VERSION)"
    exit 1
fi
print_success "Java $JAVA_VERSION found"

if ! command -v mvn &> /dev/null; then
    print_error "Maven is not installed"
    echo "Install Maven: https://maven.apache.org/download.cgi"
    exit 1
fi
print_success "Maven found"

echo ""

# Step 2: Create database
print_step "Step 2: Setting up database..."

# Check if database exists
if psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "Database '$DB_NAME' already exists"
    read -p "Do you want to recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        dropdb $DB_NAME
        print_success "Dropped existing database"
    fi
fi

# Create database if it doesn't exist
if ! psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    createdb $DB_NAME
    print_success "Created database '$DB_NAME'"
fi

# Run schema
print_step "Running database schema..."
psql -d $DB_NAME -f database/schema.sql > /dev/null 2>&1
print_success "Database schema created"

# Count tables
TABLE_COUNT=$(psql -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'" | tr -d ' ')
print_success "Created $TABLE_COUNT tables"

echo ""

# Step 3: Seed test data
print_step "Step 3: Seeding test data..."

psql -d $DB_NAME << 'EOF' > /dev/null 2>&1

-- Create test customer
INSERT INTO users (phone_number, full_name, email, role, password_hash, is_active)
VALUES (
  '+233241234567',
  'Test Customer',
  'customer@test.com',
  'CUSTOMER',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYiOqm',
  true
) ON CONFLICT (phone_number) DO NOTHING;

-- Create test vendor
INSERT INTO users (phone_number, full_name, email, role, password_hash, is_active)
VALUES (
  '+233501234567',
  'Test Vendor',
  'vendor@test.com',
  'VENDOR',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYiOqm',
  true
) ON CONFLICT (phone_number) DO NOTHING;

-- Create vendor profile
INSERT INTO vendor_profile (user_id, business_name, description, address, latitude, longitude, is_open)
SELECT 
  id,
  'Test Kitchen',
  'Test restaurant for development',
  'Test Address, Effiduasi',
  6.7833,
  -1.4167,
  true
FROM users 
WHERE role = 'VENDOR' AND phone_number = '+233501234567'
ON CONFLICT (user_id) DO NOTHING;

-- Create test rider
INSERT INTO users (phone_number, full_name, email, role, password_hash, is_active)
VALUES (
  '+233261234567',
  'Test Rider',
  'rider@test.com',
  'RIDER',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIiIkYiOqm',
  true
) ON CONFLICT (phone_number) DO NOTHING;

-- Create test products
INSERT INTO products (vendor_id, category_id, name, description, price, is_available, preparation_time)
SELECT 
  vp.id,
  c.id,
  'Test Jollof Rice',
  'Delicious test jollof rice with chicken',
  25.00,
  true,
  20
FROM vendor_profile vp
CROSS JOIN categories c
WHERE c.name = 'Rice Dishes'
ON CONFLICT DO NOTHING;

INSERT INTO products (vendor_id, category_id, name, description, price, is_available, preparation_time)
SELECT 
  vp.id,
  c.id,
  'Test Waakye',
  'Test waakye with fish and shito',
  20.00,
  true,
  15
FROM vendor_profile vp
CROSS JOIN categories c
WHERE c.name = 'Rice Dishes'
ON CONFLICT DO NOTHING;

INSERT INTO products (vendor_id, category_id, name, description, price, is_available, preparation_time)
SELECT 
  vp.id,
  c.id,
  'Test Fufu',
  'Test fufu with light soup',
  30.00,
  true,
  25
FROM vendor_profile vp
CROSS JOIN categories c
WHERE c.name = 'Soups & Stews'
ON CONFLICT DO NOTHING;

EOF

USER_COUNT=$(psql -d $DB_NAME -t -c "SELECT COUNT(*) FROM users" | tr -d ' ')
PRODUCT_COUNT=$(psql -d $DB_NAME -t -c "SELECT COUNT(*) FROM products" | tr -d ' ')

print_success "Created $USER_COUNT test users"
print_success "Created $PRODUCT_COUNT test products"

echo ""

# Step 4: Configure backend
print_step "Step 4: Configuring backend..."

cd backend

# Create test configuration if it doesn't exist
if [ ! -f src/main/resources/application-test.yml ]; then
    cat > src/main/resources/application-test.yml << 'EOF'
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/foodhub_test
    username: postgres
    password: postgres

app:
  jwt:
    secret: test-secret-key-for-development-only-minimum-256-bits-required
  
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

logging:
  level:
    com.foodhub: DEBUG
EOF
    print_success "Created test configuration"
else
    print_success "Test configuration already exists"
fi

cd ..

echo ""

# Step 5: Build backend
print_step "Step 5: Building backend..."
cd backend
mvn clean install -DskipTests > /dev/null 2>&1
print_success "Backend built successfully"
cd ..

echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          Setup Complete!               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✓ Database created and seeded${NC}"
echo -e "${GREEN}✓ Backend configured and built${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Start the backend:"
echo "   cd backend"
echo "   mvn spring-boot:run -Dspring-boot.run.profiles=test"
echo ""
echo "2. In a new terminal, run tests:"
echo "   ./quick-test.sh"
echo ""
echo "3. Or test manually:"
echo "   curl http://localhost:8080/api/v1/actuator/health"
echo ""
echo "Test credentials:"
echo "  Customer: +233241234567 / Test123!"
echo "  Vendor:   +233501234567 / Test123!"
echo "  Rider:    +233261234567 / Test123!"
echo ""
echo "For detailed testing instructions, see: TESTING_GUIDE.md"
echo ""
