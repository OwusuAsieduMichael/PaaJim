# 🚀 START HERE - FoodHub Testing

## Welcome! Let's test your FoodHub system in 3 simple steps.

---

## ⚡ Quick Start (5 minutes)

### 1️⃣ Setup Environment
```bash
chmod +x setup-test-env.sh quick-test.sh
./setup-test-env.sh
```

### 2️⃣ Start Backend
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

### 3️⃣ Run Tests (in new terminal)
```bash
./quick-test.sh
```

**Expected output:**
```
✓ Backend is running
✓ Database accessible
✓ Login successful
✓ Menu retrieved
✓ Delivery OTP expiry: 60 minutes ✨
✓ All tests passed!
```

---

## 📚 Documentation Quick Links

### Getting Started
- **[QUICK_START_TESTING.md](QUICK_START_TESTING.md)** ← Start here for testing
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** ← Comprehensive testing guide
- **[GETTING_STARTED.md](GETTING_STARTED.md)** ← Full development setup

### System Documentation
- **[README.md](README.md)** ← Project overview
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** ← Executive summary
- **[docs/SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md)** ← Technical architecture
- **[docs/API_SPECIFICATION.md](docs/API_SPECIFICATION.md)** ← API reference

### Payment & OTP
- **[docs/PAYMENT_SYSTEM.md](docs/PAYMENT_SYSTEM.md)** ← Paystack integration
- **[docs/OTP_TIMING_GUIDE.md](docs/OTP_TIMING_GUIDE.md)** ← OTP timing details
- **[PAYSTACK_UPDATE_SUMMARY.md](PAYSTACK_UPDATE_SUMMARY.md)** ← Payment changes
- **[OTP_UPDATE_SUMMARY.md](OTP_UPDATE_SUMMARY.md)** ← OTP timing update

### Deployment
- **[docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)** ← Production deployment
- **[docs/PAYSTACK_MIGRATION_GUIDE.md](docs/PAYSTACK_MIGRATION_GUIDE.md)** ← Paystack migration

### Reference
- **[INDEX.md](INDEX.md)** ← Complete documentation index
- **[CHANGELOG.md](CHANGELOG.md)** ← Version history
- **[DELIVERABLES.md](DELIVERABLES.md)** ← Complete deliverables list

---

## 🎯 What You're Testing

### ✅ Core Features
- User authentication (JWT)
- Menu browsing
- Order placement
- Payment processing (Paystack)
- OTP verification (Payment + Delivery)
- Order tracking

### ✨ Key Update
**Delivery OTP now expires in 60 minutes (1 hour)** instead of 30 minutes!

This gives more time for:
- Food preparation (15-25 min)
- Delivery (15-30 min)
- Buffer for delays

---

## 🧪 Test Credentials

| Role | Phone | Password |
|------|-------|----------|
| **Customer** | +233241234567 | Test123! |
| **Vendor** | +233501234567 | Test123! |
| **Rider** | +233261234567 | Test123! |

---

## 📊 System Overview

```
Customer App → Places Order → Pays via Mobile Money → Payment OTP (10 min)
                                                              ↓
                                                    Payment Verified
                                                              ↓
Vendor App → Receives Order → Accepts Order → Prepares Food
                                                              ↓
Rider App → Gets Assignment → Delivers → Delivery OTP (60 min) ✨
                                                              ↓
                                                    Order Complete!
```

---

## 🔧 Prerequisites

Before testing, ensure you have:
- ✅ PostgreSQL 15+ installed
- ✅ Java 17+ installed
- ✅ Maven 3.8+ installed
- ✅ Node.js 18+ (for frontend testing)
- ✅ Git installed

Check versions:
```bash
psql --version
java -version
mvn -version
node --version
```

---

## 🎯 Testing Paths

### Path 1: Quick Test (5 minutes)
**Best for**: Verifying basic functionality
1. Run `./setup-test-env.sh`
2. Start backend
3. Run `./quick-test.sh`

### Path 2: API Testing (15 minutes)
**Best for**: Testing all endpoints
1. Follow Path 1
2. Use Postman or curl
3. See `TESTING_GUIDE.md` for examples

### Path 3: Full Stack Testing (30 minutes)
**Best for**: Testing complete user experience
1. Follow Path 1
2. Start frontend apps
3. Test in browser

### Path 4: OTP Testing (20 minutes)
**Best for**: Verifying OTP timing
1. Follow Path 1
2. Test payment OTP (10 min expiry)
3. Test delivery OTP (60 min expiry)
4. See `docs/OTP_TIMING_GUIDE.md`

---

## 🐛 Common Issues

### "Backend won't start"
```bash
# Check Java version
java -version  # Must be 17+

# Check port 8080 is free
lsof -i :8080
```

### "Database connection failed"
```bash
# Check PostgreSQL is running
pg_isready

# Recreate database
dropdb foodhub_test
createdb foodhub_test
psql -d foodhub_test -f database/schema.sql
```

### "Tests fail"
```bash
# Rerun setup
./setup-test-env.sh

# Restart backend
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

---

## 📱 What's Next?

After successful testing:

### For Development
1. Read `GETTING_STARTED.md` for full setup
2. Review `docs/SYSTEM_ARCHITECTURE.md`
3. Check `docs/API_SPECIFICATION.md`

### For Deployment
1. Create Paystack account
2. Get API keys (test & live)
3. Follow `docs/DEPLOYMENT_GUIDE.md`
4. Deploy to Railway + Vercel

### For Production
1. Complete Paystack KYC
2. Enable Mobile Money
3. Fund SMS wallet
4. Test with real transactions
5. Launch! 🚀

---

## 🎉 Success Criteria

You'll know testing is successful when:
- ✅ All automated tests pass
- ✅ Login works for all roles
- ✅ Menu displays products
- ✅ Orders can be created
- ✅ **Delivery OTP expires in 60 minutes**
- ✅ Payment flow works (with test keys)

---

## 📞 Need Help?

### Quick Help
- **Setup issues**: See `QUICK_START_TESTING.md`
- **API issues**: See `TESTING_GUIDE.md`
- **OTP questions**: See `docs/OTP_TIMING_GUIDE.md`

### Detailed Help
- **Technical**: `docs/SYSTEM_ARCHITECTURE.md`
- **API Reference**: `docs/API_SPECIFICATION.md`
- **Deployment**: `docs/DEPLOYMENT_GUIDE.md`

### Support
- **Email**: tech@foodhub.gh
- **Documentation**: See `INDEX.md` for all docs

---

## 🎯 Your Testing Checklist

- [ ] Prerequisites installed
- [ ] Setup script run successfully
- [ ] Backend starts without errors
- [ ] Quick tests pass
- [ ] Login works
- [ ] Menu retrieval works
- [ ] Order creation works
- [ ] OTP timing verified (60 min)
- [ ] Payment flow tested
- [ ] Frontend tested (optional)

---

## 🚀 Ready to Start?

```bash
# Step 1: Setup
./setup-test-env.sh

# Step 2: Start backend (in one terminal)
cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=test

# Step 3: Run tests (in another terminal)
./quick-test.sh
```

**That's it! You're testing FoodHub!** 🎉

---

**Last Updated**: April 16, 2026  
**Version**: 1.0.1  
**Status**: Ready for Testing ✅
