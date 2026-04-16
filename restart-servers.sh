#!/bin/bash

# FoodHub Server Restart Script

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   FoodHub Server Restart Script       ║${NC}"
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

# Stop backend
print_step "Stopping backend server (port 8080)..."
BACKEND_PID=$(lsof -t -i:8080 2>/dev/null)
if [ -n "$BACKEND_PID" ]; then
    kill -9 $BACKEND_PID
    print_success "Backend stopped (PID: $BACKEND_PID)"
else
    echo "Backend not running"
fi

# Stop frontend servers
print_step "Stopping frontend servers..."

# Customer app (port 3000)
CUSTOMER_PID=$(lsof -t -i:3000 2>/dev/null)
if [ -n "$CUSTOMER_PID" ]; then
    kill -9 $CUSTOMER_PID
    print_success "Customer app stopped (PID: $CUSTOMER_PID)"
else
    echo "Customer app not running"
fi

# Vendor app (port 3001)
VENDOR_PID=$(lsof -t -i:3001 2>/dev/null)
if [ -n "$VENDOR_PID" ]; then
    kill -9 $VENDOR_PID
    print_success "Vendor app stopped (PID: $VENDOR_PID)"
else
    echo "Vendor app not running"
fi

# Rider app (port 3002)
RIDER_PID=$(lsof -t -i:3002 2>/dev/null)
if [ -n "$RIDER_PID" ]; then
    kill -9 $RIDER_PID
    print_success "Rider app stopped (PID: $RIDER_PID)"
else
    echo "Rider app not running"
fi

echo ""
print_success "All servers stopped!"
echo ""

# Ask what to restart
echo "What would you like to restart?"
echo "1) Backend only"
echo "2) Frontend only (Customer app)"
echo "3) Both backend and frontend"
echo "4) Exit (manual restart)"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        print_step "Starting backend..."
        cd backend
        mvn spring-boot:run -Dspring-boot.run.profiles=test &
        print_success "Backend starting... (check logs above)"
        ;;
    2)
        print_step "Starting customer app..."
        cd frontend/customer
        npm run dev &
        print_success "Customer app starting... (check logs above)"
        ;;
    3)
        print_step "Starting backend..."
        cd backend
        mvn spring-boot:run -Dspring-boot.run.profiles=test &
        BACKEND_PID=$!
        print_success "Backend starting (PID: $BACKEND_PID)"
        
        sleep 5
        
        print_step "Starting customer app..."
        cd ../frontend/customer
        npm run dev &
        CUSTOMER_PID=$!
        print_success "Customer app starting (PID: $CUSTOMER_PID)"
        ;;
    4)
        echo "Servers stopped. Restart manually:"
        echo ""
        echo "Backend:"
        echo "  cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=test"
        echo ""
        echo "Customer App:"
        echo "  cd frontend/customer && npm run dev"
        echo ""
        exit 0
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          Restart Complete!             ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo "Servers are starting in the background."
echo "Check the logs above for any errors."
echo ""
echo "To verify:"
echo "  Backend:  curl http://localhost:8080/api/v1/actuator/health"
echo "  Frontend: Open http://localhost:3000 in browser"
echo ""
