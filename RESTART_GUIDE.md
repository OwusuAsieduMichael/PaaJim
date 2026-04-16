# Server Restart Guide

## 🔄 Quick Restart Commands

### Option 1: Automated Restart Script
```bash
chmod +x restart-servers.sh
./restart-servers.sh
```

### Option 2: Manual Restart

#### Stop All Servers
```bash
# Stop backend (port 8080)
kill -9 $(lsof -t -i:8080)

# Stop customer app (port 3000)
kill -9 $(lsof -t -i:3000)

# Stop vendor app (port 3001)
kill -9 $(lsof -t -i:3001)

# Stop rider app (port 3002)
kill -9 $(lsof -t -i:3002)
```

#### Start Backend
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

Wait for: `Started FoodHubApplication in X seconds`

#### Start Frontend (in new terminals)

**Customer App:**
```bash
cd frontend/customer
npm run dev
```

**Vendor App:**
```bash
cd frontend/vendor
npm run dev
```

**Rider App:**
```bash
cd frontend/rider
npm run dev
```

---

## 🎯 Verify Servers Are Running

### Backend
```bash
curl http://localhost:8080/api/v1/actuator/health
# Expected: {"status":"UP"}
```

### Frontend
- Customer: http://localhost:3000
- Vendor: http://localhost:3001
- Rider: http://localhost:3002

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :8080

# Kill the process
kill -9 <PID>
```

### Backend Won't Start
```bash
# Check Java version
java -version  # Must be 17+

# Clean and rebuild
cd backend
mvn clean install
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

### Frontend Won't Start
```bash
# Clear node_modules and reinstall
cd frontend/customer
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📊 Check Server Status

```bash
# Check all ports
lsof -i :8080  # Backend
lsof -i :3000  # Customer
lsof -i :3001  # Vendor
lsof -i :3002  # Rider
```

---

## 🚀 Quick Test After Restart

```bash
# Run automated tests
./quick-test.sh
```

Expected output:
```
✓ Backend is running
✓ Database accessible
✓ Login successful
✓ Menu retrieved
✓ All tests passed!
```
