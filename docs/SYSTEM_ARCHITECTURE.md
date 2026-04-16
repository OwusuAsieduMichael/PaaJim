# FoodHub System Architecture

## 🏗️ Architecture Overview

FoodHub follows a **layered architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Customer    │  │   Vendor     │  │    Rider     │      │
│  │  React App   │  │  React App   │  │  React App   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                       │
│                    (Spring Boot REST API)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Authentication │ Authorization │ Rate Limiting      │   │
│  │  CORS │ Request Validation │ Error Handling         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     CONTROLLER LAYER                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │  Order   │  │  Menu    │  │  Rider   │   │
│  │Controller│  │Controller│  │Controller│  │Controller│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  User    │  │  Order   │  │ Delivery │  │   OTP    │   │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │   SMS    │  │  Notif.  │  │  Product │                 │
│  │ Service  │  │ Service  │  │ Service  │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    REPOSITORY LAYER                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   User   │  │  Order   │  │  Product │  │   OTP    │   │
│  │   Repo   │  │   Repo   │  │   Repo   │  │   Repo   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
│                  PostgreSQL (Supabase)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tables: users, orders, products, otp_codes,        │   │
│  │  notifications, vendor_profile, order_items         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Hubtel     │  │ Google Maps  │  │   Supabase   │
│   SMS API    │  │     API      │  │   Storage    │
└──────────────┘  └──────────────┘  └──────────────┘
```

## 🔄 Order Lifecycle Flow

### 1. Order Placement (Customer)
```
Customer → Browse Menu → Add to Cart → Select Location → Place Order
                                                              │
                                                              ▼
                                            Order Created (PENDING)
                                                              │
                                                              ▼
                                            Notification → Vendor
                                            Notification → Customer
```

### 2. Order Confirmation (Vendor)
```
Vendor → View Order → Accept Order
                         │
                         ▼
              Order Status → CONFIRMED
                         │
                         ▼
              Notification → Customer
              Notification → Vendor
```

### 3. Rider Assignment (System/Admin)
```
System → Find Available Rider → Assign to Order
                                      │
                                      ▼
                           Notification → Rider
```

### 4. Out for Delivery (Rider)
```
Rider → View Delivery → Mark "Out for Delivery"
                              │
                              ▼
                   Order Status → OUT_FOR_DELIVERY
                              │
                              ├─→ Generate 6-digit OTP
                              ├─→ Send SMS to Customer
                              ├─→ Notification → Customer
                              └─→ Notification → Vendor
```

### 5. Delivery Confirmation (Rider + Customer)
```
Rider → Arrive at Location → Collect OTP from Customer → Submit OTP
                                                              │
                                                              ▼
                                                    Verify OTP Code
                                                              │
                                                    ┌─────────┴─────────┐
                                                    │                   │
                                                 Valid              Invalid
                                                    │                   │
                                                    ▼                   ▼
                                        Order Status → DELIVERED    Error Message
                                                    │              (Attempts Left)
                                                    ▼
                                        Notification → All Parties
```

## 🔐 Security Architecture

### Authentication Flow
```
1. User Login
   ├─→ POST /auth/login (phone + password)
   ├─→ Validate credentials (BCrypt)
   ├─→ Generate JWT token (24h expiry)
   └─→ Return token + user info

2. Authenticated Request
   ├─→ Client sends: Authorization: Bearer <token>
   ├─→ JWT Filter validates token
   ├─→ Extract user info from token
   ├─→ Set SecurityContext
   └─→ Proceed to controller
```

### Authorization Matrix
| Endpoint | Customer | Vendor | Rider | Admin |
|----------|----------|--------|-------|-------|
| POST /orders | ✓ | ✗ | ✗ | ✓ |
| PUT /orders/{id}/confirm | ✗ | ✓ | ✗ | ✓ |
| PUT /orders/{id}/out-for-delivery | ✗ | ✗ | ✓ | ✓ |
| POST /otp/verify | ✗ | ✗ | ✓ | ✓ |
| GET /menu/products | ✓ | ✓ | ✓ | ✓ |
| POST /menu/products | ✗ | ✓ | ✗ | ✓ |

### OTP Security
- **Generation**: Cryptographically secure random 6-digit code
- **Storage**: Hashed in database (SHA-256)
- **Expiry**: 60 minutes (1 hour) from generation
- **Attempts**: Maximum 3 failed attempts
- **Rate Limiting**: 1 OTP generation per order
- **Resend**: Allowed once after 2 minutes

## 📡 Notification System

### Event-Driven Architecture
```
Order State Change
       │
       ▼
NotificationService.notify(event, order)
       │
       ├─→ Determine affected users (by role)
       ├─→ Create notification records
       ├─→ Send SMS (async)
       └─→ Store in database
```

### Notification Rules
| Event | Customer | Vendor | Rider |
|-------|----------|--------|-------|
| ORDER_PLACED | ✓ | ✓ | ✗ |
| ORDER_CONFIRMED | ✓ | ✓ | ✗ |
| OUT_FOR_DELIVERY | ✓ | ✓ | ✓ |
| DELIVERED | ✓ | ✓ | ✓ |
| CANCELLED | ✓ | ✓ | ✓ (if assigned) |

### SMS Integration (Paystack)
```java
// Async SMS sending via Paystack
@Async
public void sendSms(String phoneNumber, String message) {
    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(paystackSecretKey);
    
    SmsRequest request = SmsRequest.builder()
        .to(phoneNumber)
        .message(message)
        .build();
    
    restTemplate.postForEntity(paystackSmsUrl, request, SmsResponse.class);
}
```

## 🗺️ Location System

### Map Integration Flow
```
1. Customer selects location
   ├─→ Google Maps API loads
   ├─→ User drags marker or clicks map
   ├─→ Get coordinates (lat, lng)
   ├─→ Reverse geocode to address
   └─→ Store in order

2. Rider views delivery
   ├─→ Display address + coordinates
   ├─→ "Open in Maps" button
   └─→ Deep link: https://maps.google.com/?q=lat,lng
```

### No Real-Time Tracking
- **Why**: Simplicity, low bandwidth, battery efficiency
- **Alternative**: Rider calls customer when nearby
- **Future**: Can add live tracking as enhancement

## 💾 Database Design Principles

### Normalization
- **3NF compliance** for data integrity
- **Denormalization** for order items (snapshot pattern)
- **Indexes** on foreign keys and query columns

### Audit Trail
```sql
-- Every order state change logged
INSERT INTO audit_log (order_id, action, old_status, new_status, user_id)
VALUES (?, 'STATUS_CHANGE', 'PENDING', 'CONFIRMED', ?);
```

### Soft Deletes
- Products: `is_available = false`
- Users: `is_active = false`
- Preserves historical data

## 🚀 Scalability Considerations

### Current Architecture (MVP)
- **Single vendor**: Simplified data model
- **Manual rider assignment**: Admin assigns riders
- **SMS-only notifications**: No push notifications
- **Monolithic backend**: Single Spring Boot app

### Future Enhancements
1. **Multi-vendor support**
   - Add vendor selection in customer app
   - Vendor-specific menus and profiles
   
2. **Automatic rider assignment**
   - Proximity-based algorithm
   - Load balancing across riders
   
3. **Real-time features**
   - WebSocket for live updates
   - Live rider tracking
   - In-app chat
   
4. **Microservices migration**
   - Order Service
   - Delivery Service
   - Notification Service
   - User Service

5. **Caching layer**
   - Redis for menu items
   - Session management
   - Rate limiting

## 🔧 Technology Choices

### Why Spring Boot?
- **Mature ecosystem**: Battle-tested in production
- **Strong typing**: Java type safety
- **JPA/Hibernate**: Powerful ORM
- **Security**: Spring Security for auth
- **Community**: Large support community

### Why React?
- **Component reusability**: Shared components
- **Virtual DOM**: Fast rendering
- **Hooks**: Modern state management
- **Ecosystem**: Rich library support

### Why PostgreSQL?
- **ACID compliance**: Data integrity
- **JSON support**: Flexible metadata
- **Geospatial**: PostGIS for future features
- **Supabase**: Managed hosting + auth

### Why Tailwind CSS?
- **Utility-first**: Fast development
- **Consistency**: Design system built-in
- **Mobile-first**: Responsive by default
- **Small bundle**: PurgeCSS optimization

## 📊 Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| API Response Time | < 200ms | 95th percentile |
| Page Load Time | < 2s | First contentful paint |
| Order Placement | < 3s | End-to-end |
| OTP Delivery | < 30s | SMS delivery time |
| Database Queries | < 50ms | Average query time |
| Concurrent Users | 100+ | MVP target |

## 🔒 Data Privacy

- **PII Protection**: Phone numbers encrypted at rest
- **GDPR Compliance**: User data deletion on request
- **Audit Logging**: All sensitive operations logged
- **Access Control**: Role-based permissions
- **Secure Communication**: HTTPS only

## 🌍 Ghana-Specific Optimizations

1. **Low Bandwidth**
   - Compressed images (WebP)
   - Lazy loading
   - Minimal JavaScript bundles
   
2. **Mobile-First**
   - Touch-optimized UI
   - Large tap targets (44px minimum)
   - Offline-capable (future)
   
3. **SMS Reliability**
   - Primary notification channel
   - Hubtel local provider
   - Retry mechanism
   
4. **Local Payment Integration** (Future)
   - Mobile Money (MTN, Vodafone)
   - Cash on delivery (current)

## 📈 Monitoring & Observability

### Metrics to Track
- Order completion rate
- Average delivery time
- OTP verification success rate
- API error rates
- SMS delivery rates
- User retention

### Logging Strategy
```
INFO: Business events (order placed, confirmed, delivered)
WARN: Recoverable errors (SMS failed, retry scheduled)
ERROR: Critical failures (database down, payment failed)
DEBUG: Development troubleshooting
```

### Health Checks
```
GET /actuator/health
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" },
    "sms": { "status": "UP" },
    "maps": { "status": "UP" }
  }
}
```
