# FoodHub - Local Food Delivery System

## 🎯 System Overview
A production-grade, single-vendor food ordering and delivery system optimized for Effiduasi, Ghana. Built for simplicity, reliability, and trust.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
├──────────────────┬──────────────────┬──────────────────────┤
│  Customer App    │   Vendor App     │    Rider App         │
│  (React + TW)    │  (React + TW)    │   (React + TW)       │
└────────┬─────────┴────────┬─────────┴──────────┬───────────┘
         │                  │                     │
         └──────────────────┼─────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   API GATEWAY   │
                    │  (Spring Boot)  │
                    └───────┬────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    ┌────▼─────┐    ┌──────▼──────┐   ┌──────▼──────┐
    │ Order    │    │ Delivery    │   │   User      │
    │ Service  │    │ Service     │   │  Service    │
    └────┬─────┘    └──────┬──────┘   └──────┬──────┘
         │                  │                  │
         └──────────────────┼──────────────────┘
                            │
                    ┌───────▼────────┐
                    │   DATA LAYER    │
                    │  (PostgreSQL)   │
                    └───────┬────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    ┌────▼─────┐    ┌──────▼──────┐   ┌──────▼──────┐
    │  Hubtel  │    │ Google Maps │   │  Supabase   │
    │   SMS    │    │     API     │   │   Storage   │
    └──────────┘    └─────────────┘   └─────────────┘
```

## 📊 Order State Machine

```
PENDING → PAYMENT_INITIATED → PAYMENT_VERIFIED → CONFIRMED → OUT_FOR_DELIVERY → DELIVERED
   ↓              ↓                  ↓              ↓              ↓              ↓
Customer      Payment           Payment        Vendor        Rider+OTP      OTP Verified
Places        Request           OTP            Accepts       Assigned       Delivery Done
Order         Sent              Verified       Order
```

## 🔐 OTP Delivery Flow

1. **Payment OTP** (10 minutes):
   - Customer completes Mobile Money payment
   - System generates 6-digit OTP
   - SMS sent to customer via Paystack
   - Customer enters OTP to verify payment
   - Order moves to PAYMENT_VERIFIED

2. **Delivery OTP** (60 minutes / 1 hour):
   - Order moves to OUT_FOR_DELIVERY
   - System generates 6-digit OTP
   - SMS sent to customer via Paystack
   - Rider collects OTP at delivery
   - Rider submits OTP
   - System verifies → Order marked DELIVERED

## 🚀 Tech Stack

- **Frontend**: React 18 + Tailwind CSS
- **Backend**: Spring Boot 3.2
- **Database**: PostgreSQL (Supabase)
- **SMS**: Paystack SMS API
- **Payment**: Paystack (Mobile Money)
- **Maps**: Google Maps API
- **State Management**: React Context + Hooks

## 📱 User Roles

### Customer
- Browse menu
- Place orders
- Select location via map
- Receive SMS notifications
- Share OTP with rider

### Vendor
- Accept orders (single action)
- Optional: Mark ready
- View order history

### Rider
- View assigned deliveries
- Call customer
- Open location in maps
- Submit OTP for confirmation

## 🎨 Design System

- **Primary Color**: `#FF6B35` (Food Orange)
- **Secondary Color**: `#10B981` (Success Green)
- **Typography**: Inter
- **Grid**: 8px base unit
- **Border Radius**: 12-16px
- **Shadows**: Soft, layered

## 📦 Project Structure

```
foodhub/
├── backend/                 # Spring Boot API
│   ├── src/main/java/
│   │   └── com/foodhub/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── service/
│   │       ├── repository/
│   │       ├── model/
│   │       ├── dto/
│   │       └── security/
│   └── src/main/resources/
├── frontend/
│   ├── customer/           # Customer React app
│   ├── vendor/             # Vendor React app
│   └── rider/              # Rider React app
├── database/
│   ├── schema.sql
│   └── migrations/
└── docs/
    ├── api-spec.md
    └── deployment.md
```

## 🔧 Setup Instructions

See individual README files in:
- `/backend/README.md`
- `/frontend/customer/README.md`
- `/frontend/vendor/README.md`
- `/frontend/rider/README.md`

## 🧪 Testing

**Want to test the system now?** See **[START_HERE.md](START_HERE.md)** for quick testing setup!

### Quick Test (5 minutes)
```bash
# Setup (one-time)
./setup-test-env.sh

# Start backend
cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=test

# Run tests (new terminal)
./quick-test.sh
```

### Testing Documentation
- **[START_HERE.md](START_HERE.md)** - Start here for testing
- **[QUICK_START_TESTING.md](QUICK_START_TESTING.md)** - 5-minute quick start
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Complete testing guide
- **[docs/OTP_TIMING_GUIDE.md](docs/OTP_TIMING_GUIDE.md)** - OTP timing details

### Test Credentials
| Role | Phone | Password |
|------|-------|----------|
| Customer | +233241234567 | Test123! |
| Vendor | +233501234567 | Test123! |
| Rider | +233261234567 | Test123! |

## 🌍 Deployment

Optimized for:
- Low-bandwidth environments
- Mobile-first usage
- SMS-based notifications
- Offline-capable UI states

## 📄 License

Proprietary - FoodHub Ghana
