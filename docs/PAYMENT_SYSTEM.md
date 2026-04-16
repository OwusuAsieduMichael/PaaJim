# FoodHub Payment System - Paystack Integration

## 🎯 Overview

FoodHub uses **Paystack** for:
1. **Mobile Money payments** (MTN, Vodafone, AirtelTigo)
2. **SMS notifications** (via Paystack SMS API)
3. **Payment verification** with OTP

## 💳 Payment Flow (Payment Before Delivery)

### New Order Lifecycle

```
PENDING (Order placed, awaiting payment)
   ↓
PAYMENT_INITIATED (Payment request sent)
   ↓
PAYMENT_VERIFIED (Payment confirmed with OTP)
   ↓
CONFIRMED (Vendor accepts order)
   ↓
OUT_FOR_DELIVERY (Rider assigned)
   ↓
DELIVERED (Delivery OTP verified)
```

### Complete Payment Flow

```
CUSTOMER                PAYSTACK            SYSTEM              VENDOR          RIDER
   │                       │                   │                   │              │
   │ 1. Place Order        │                   │                   │              │
   ├──────────────────────────────────────────>│                   │              │
   │                       │                   │                   │              │
   │                       │ 2. Create Order   │                   │              │
   │                       │   (PENDING)       │                   │              │
   │                       │                   │                   │              │
   │                       │ 3. Initiate Payment                   │              │
   │                       │<──────────────────┤                   │              │
   │                       │                   │                   │              │
   │ 4. Payment Request    │                   │                   │              │
   │<──────────────────────┤                   │                   │              │
   │                       │                   │                   │              │
   │ 5. Enter MoMo Number  │                   │                   │              │
   │ & Approve on Phone    │                   │                   │              │
   ├──────────────────────>│                   │                   │              │
   │                       │                   │                   │              │
   │                       │ 6. Process Payment│                   │              │
   │                       │   (Mobile Money)  │                   │              │
   │                       │                   │                   │              │
   │ 7. SMS: Payment OTP   │                   │                   │              │
   │<──────────────────────┤                   │                   │              │
   │                       │                   │                   │              │
   │ 8. Enter Payment OTP  │                   │                   │              │
   ├──────────────────────────────────────────>│                   │              │
   │                       │                   │                   │              │
   │                       │ 9. Verify OTP     │                   │              │
   │                       │<──────────────────┤                   │              │
   │                       │                   │                   │              │
   │                       │ 10. OTP Valid     │                   │              │
   │                       ├──────────────────>│                   │              │
   │                       │                   │                   │              │
   │                       │ 11. Update Status │                   │              │
   │                       │   (PAYMENT_       │                   │              │
   │                       │    VERIFIED)      │                   │              │
   │                       │                   │                   │              │
   │ 12. SMS: Payment      │                   │                   │              │
   │     Confirmed         │                   │                   │              │
   │<──────────────────────┤                   │                   │              │
   │                       │                   │                   │              │
   │                       │ 13. Notify Vendor │                   │              │
   │                       │   (New Paid Order)│                   │              │
   │                       ├──────────────────────────────────────>│              │
   │                       │                   │                   │              │
   │                       │                   │   14. Accept Order│              │
   │                       │                   │<──────────────────┤              │
   │                       │                   │                   │              │
   │                       │ 15. Update Status │                   │              │
   │                       │   (CONFIRMED)     │                   │              │
   │                       │                   │                   │              │
   │                       │ [Continue with delivery flow...]      │              │
   │                       │                   │                   │              │
   ▼                       ▼                   ▼                   ▼              ▼
```

## 🔄 Updated Order State Machine

```sql
-- Updated order_status enum
CREATE TYPE order_status AS ENUM (
    'PENDING',              -- Order placed, awaiting payment
    'PAYMENT_INITIATED',    -- Payment request sent to Paystack
    'PAYMENT_VERIFIED',     -- Payment confirmed, awaiting vendor acceptance
    'CONFIRMED',            -- Vendor accepted order
    'OUT_FOR_DELIVERY',     -- Rider assigned and delivering
    'DELIVERED',            -- Delivery completed
    'CANCELLED',            -- Order cancelled
    'PAYMENT_FAILED'        -- Payment failed or expired
);
```

### State Transitions

| From | To | Actor | Action |
|------|-----|-------|--------|
| - | PENDING | Customer | Place order |
| PENDING | PAYMENT_INITIATED | System | Initiate Paystack payment |
| PAYMENT_INITIATED | PAYMENT_VERIFIED | Customer | Complete payment + verify OTP |
| PAYMENT_INITIATED | PAYMENT_FAILED | System | Payment timeout/failure |
| PAYMENT_VERIFIED | CONFIRMED | Vendor | Accept order |
| CONFIRMED | OUT_FOR_DELIVERY | Rider | Start delivery |
| OUT_FOR_DELIVERY | DELIVERED | Rider | Verify delivery OTP |
| Any (except DELIVERED) | CANCELLED | Any | Cancel order |

## 💰 Paystack Integration

### 1. Payment Initialization

**Endpoint**: `POST /api/v1/payments/initialize`

**Request**:
```json
{
  "orderId": "uuid",
  "amount": 75.00,
  "currency": "GHS",
  "paymentMethod": "mobile_money",
  "mobileMoneyProvider": "mtn",
  "phoneNumber": "+233241234567"
}
```

**Paystack API Call**:
```bash
POST https://api.paystack.co/transaction/initialize
Authorization: Bearer sk_live_xxx

{
  "email": "customer@foodhub.gh",
  "amount": 7500,  # Amount in pesewas (GHS 75.00 * 100)
  "currency": "GHS",
  "channels": ["mobile_money"],
  "mobile_money": {
    "phone": "0241234567",
    "provider": "mtn"
  },
  "metadata": {
    "order_id": "uuid",
    "order_number": "ORD202604150001",
    "customer_name": "Kwame Mensah"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "paymentReference": "pay_abc123xyz",
    "authorizationUrl": "https://checkout.paystack.com/abc123",
    "accessCode": "abc123xyz",
    "status": "pending"
  }
}
```

### 2. Mobile Money Payment Flow

1. **Customer receives USSD prompt** on their phone
2. **Customer approves payment** by entering PIN
3. **Paystack processes payment**
4. **Paystack generates OTP** and sends via SMS
5. **Customer enters OTP** in FoodHub app
6. **System verifies OTP** with Paystack
7. **Payment confirmed**

### 3. Payment Verification

**Endpoint**: `POST /api/v1/payments/verify`

**Request**:
```json
{
  "orderId": "uuid",
  "paymentReference": "pay_abc123xyz",
  "otp": "123456"
}
```

**Paystack API Call**:
```bash
GET https://api.paystack.co/transaction/verify/pay_abc123xyz
Authorization: Bearer sk_live_xxx
```

**Paystack Response**:
```json
{
  "status": true,
  "message": "Verification successful",
  "data": {
    "id": 123456789,
    "status": "success",
    "reference": "pay_abc123xyz",
    "amount": 7500,
    "currency": "GHS",
    "channel": "mobile_money",
    "paid_at": "2026-04-15T12:05:00Z",
    "authorization": {
      "authorization_code": "AUTH_xxx"
    }
  }
}
```

**FoodHub Response**:
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "orderId": "uuid",
    "status": "PAYMENT_VERIFIED",
    "paymentReference": "pay_abc123xyz",
    "amount": 75.00,
    "paidAt": "2026-04-15T12:05:00Z"
  }
}
```

## 📱 SMS Integration (Paystack)

### Send SMS via Paystack

**Paystack SMS API**:
```bash
POST https://api.paystack.co/sms/send
Authorization: Bearer sk_live_xxx

{
  "to": "+233241234567",
  "message": "Your FoodHub payment OTP is: 123456. Valid for 10 minutes.",
  "sender": "FoodHub"
}
```

### SMS Templates

#### 1. Payment OTP
```
FoodHub: Your payment verification code is: 123456
Valid for 10 minutes. Order #ORD202604150001
```

#### 2. Payment Confirmed
```
FoodHub: Payment of GH₵75.00 confirmed! 
Your order #ORD202604150001 is being prepared.
```

#### 3. Order Confirmed by Vendor
```
FoodHub: Mama Esi's Kitchen has accepted your order!
Estimated delivery: 45 mins.
```

#### 4. Out for Delivery
```
FoodHub: Your order is on the way! 
Rider: Kofi (+233261234567)
Delivery OTP: 654321 (Valid for 1 hour)
```

#### 5. Delivered
```
FoodHub: Order delivered successfully!
Thank you for using FoodHub. Enjoy your meal! 🍽️
```

## 🗄️ Updated Database Schema

### 1. Add Payment Columns to Orders Table

```sql
ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50);
ALTER TABLE orders ADD COLUMN payment_provider VARCHAR(50);
ALTER TABLE orders ADD COLUMN payment_reference VARCHAR(100) UNIQUE;
ALTER TABLE orders ADD COLUMN payment_status VARCHAR(50);
ALTER TABLE orders ADD COLUMN paid_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN payment_amount DECIMAL(10, 2);

-- Add index
CREATE INDEX idx_orders_payment_reference ON orders(payment_reference);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
```

### 2. Create Payments Table

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Payment details
    payment_reference VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'GHS',
    
    -- Payment method
    payment_method VARCHAR(50) NOT NULL, -- mobile_money, card
    provider VARCHAR(50), -- mtn, vodafone, airteltigo
    
    -- Status
    status VARCHAR(50) NOT NULL, -- pending, success, failed
    
    -- Paystack data
    paystack_transaction_id BIGINT,
    authorization_code VARCHAR(100),
    
    -- Timestamps
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    failed_at TIMESTAMP,
    
    -- Metadata
    failure_reason TEXT,
    metadata JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_reference ON payments(payment_reference);
CREATE INDEX idx_payments_status ON payments(status);
```

### 3. Create Payment OTP Table

```sql
CREATE TABLE payment_otp_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID UNIQUE NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    
    code VARCHAR(6) NOT NULL,
    
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP,
    
    attempts INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT payment_otp_code_format CHECK (code ~ '^[0-9]{6}$')
);

CREATE INDEX idx_payment_otp_payment ON payment_otp_codes(payment_id);
CREATE INDEX idx_payment_otp_code ON payment_otp_codes(code);
```

## 🔧 Backend Configuration

### application.yml

```yaml
app:
  payment:
    provider: paystack
    paystack:
      secret-key: ${PAYSTACK_SECRET_KEY}
      public-key: ${PAYSTACK_PUBLIC_KEY}
      base-url: https://api.paystack.co
      callback-url: ${PAYSTACK_CALLBACK_URL}
    
    mobile-money:
      providers:
        - mtn
        - vodafone
        - airteltigo
    
    otp:
      length: 6
      expiration: 600000 # 10 minutes
      max-attempts: 3
  
  sms:
    provider: paystack
    paystack:
      secret-key: ${PAYSTACK_SECRET_KEY}
      sender-id: FoodHub
      enabled: ${SMS_ENABLED:true}
```

## 📡 Updated API Endpoints

### Payment Endpoints

#### 1. Initialize Payment
```
POST /api/v1/payments/initialize
Authorization: Bearer <jwt_token>

Request:
{
  "orderId": "uuid",
  "paymentMethod": "mobile_money",
  "provider": "mtn",
  "phoneNumber": "+233241234567"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "paymentReference": "pay_abc123xyz",
    "authorizationUrl": "https://checkout.paystack.com/abc123",
    "accessCode": "abc123xyz",
    "amount": 75.00,
    "expiresAt": "2026-04-15T12:15:00Z"
  }
}
```

#### 2. Verify Payment OTP
```
POST /api/v1/payments/verify-otp
Authorization: Bearer <jwt_token>

Request:
{
  "orderId": "uuid",
  "paymentReference": "pay_abc123xyz",
  "otp": "123456"
}

Response: 200 OK
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "orderId": "uuid",
    "orderStatus": "PAYMENT_VERIFIED",
    "paymentReference": "pay_abc123xyz",
    "amount": 75.00,
    "paidAt": "2026-04-15T12:05:00Z"
  }
}

Error Response: 400 Bad Request
{
  "success": false,
  "error": "Invalid OTP code",
  "attemptsRemaining": 2
}
```

#### 3. Check Payment Status
```
GET /api/v1/payments/{paymentReference}/status
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "paymentReference": "pay_abc123xyz",
    "status": "success",
    "amount": 75.00,
    "paidAt": "2026-04-15T12:05:00Z",
    "orderId": "uuid",
    "orderStatus": "PAYMENT_VERIFIED"
  }
}
```

#### 4. Paystack Webhook (Payment Callback)
```
POST /api/v1/webhooks/paystack
X-Paystack-Signature: <signature>

Request (from Paystack):
{
  "event": "charge.success",
  "data": {
    "id": 123456789,
    "reference": "pay_abc123xyz",
    "amount": 7500,
    "currency": "GHS",
    "status": "success",
    "paid_at": "2026-04-15T12:05:00Z",
    "metadata": {
      "order_id": "uuid"
    }
  }
}

Response: 200 OK
```

## 🎨 Updated UI Flow

### Customer Checkout Screen (Updated)

```
┌─────────────────────────────────────────┐
│  ←  Checkout                            │
├─────────────────────────────────────────┤
│                                         │
│  Delivery Location                      │
│  ┌─────────────────────────────────┐   │
│  │  📍 House 23, Effiduasi New     │   │
│  │     Town                        │   │
│  │  [Change Location]              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Order Summary                          │
│  ┌─────────────────────────────────┐   │
│  │  2 items                        │   │
│  │  Subtotal          GH₵70.00     │   │
│  │  Delivery Fee      GH₵ 5.00     │   │
│  │  ─────────────────────────────  │   │
│  │  Total             GH₵75.00     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Payment Method                         │
│  ┌─────────────────────────────────┐   │
│  │  ● Mobile Money                 │   │
│  │    ○ MTN Mobile Money           │   │
│  │    ○ Vodafone Cash              │   │
│  │    ○ AirtelTigo Money           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Mobile Money Number                    │
│  ┌─────────────────────────────────┐   │
│  │  +233 24 123 4567               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │    Pay GH₵75.00 & Place Order   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  🔒 Secure payment via Paystack         │
│                                         │
└─────────────────────────────────────────┘
```

### Payment OTP Screen (New)

```
┌─────────────────────────────────────────┐
│  ←  Verify Payment                      │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         ✓ Payment Sent          │   │
│  │                                 │   │
│  │  GH₵75.00 sent to MTN Mobile    │   │
│  │  Money (+233 24 123 4567)       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Enter Payment OTP                      │
│  ┌─────────────────────────────────┐   │
│  │  An OTP has been sent to your   │   │
│  │  phone. Please enter it below.  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      [1][2][3][4][5][6]         │   │ ← OTP Input
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     Verify & Complete Order     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Didn't receive OTP? [Resend]           │
│                                         │
│  ⏱️ Expires in 9:45                     │
│                                         │
└─────────────────────────────────────────┘
```

### Payment Success Screen (New)

```
┌─────────────────────────────────────────┐
│                                         │
│         ┌─────────────────┐             │
│         │                 │             │
│         │       ✓         │             │
│         │                 │             │
│         └─────────────────┘             │
│                                         │
│      Payment Successful!                │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Amount Paid:    GH₵75.00       │   │
│  │  Reference:      pay_abc123xyz  │   │
│  │  Order:          #ORD20260415001│   │
│  └─────────────────────────────────┘   │
│                                         │
│  Your order has been sent to            │
│  Mama Esi's Kitchen for confirmation.   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      Track Order                │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

## 🔒 Security Considerations

### 1. Webhook Verification
```java
@PostMapping("/webhooks/paystack")
public ResponseEntity<?> handlePaystackWebhook(
    @RequestHeader("X-Paystack-Signature") String signature,
    @RequestBody String payload
) {
    // Verify webhook signature
    String computedSignature = HmacUtils.hmacSha512Hex(
        paystackSecretKey, 
        payload
    );
    
    if (!signature.equals(computedSignature)) {
        return ResponseEntity.status(401).body("Invalid signature");
    }
    
    // Process webhook
    // ...
}
```

### 2. Delivery OTP Security
- **6-digit random code**
- **60-minute expiry** (1 hour - enough time for delivery)
- **Maximum 3 attempts**
- **SHA-256 hashing**
- **Rate limiting**: 1 OTP per order

### 3. Idempotency
- Use `payment_reference` as idempotency key
- Prevent duplicate payments
- Handle webhook retries gracefully

## 💡 Benefits of This Approach

### 1. Payment Security
✅ Payment verified before order processing  
✅ No cash handling risks  
✅ Automatic refunds on cancellation  
✅ Payment proof for disputes  

### 2. Business Benefits
✅ Guaranteed payment before delivery  
✅ Reduced fraud and non-payment  
✅ Automated accounting  
✅ Better cash flow  

### 3. User Experience
✅ Familiar Mobile Money flow  
✅ Instant payment confirmation  
✅ SMS notifications at each step  
✅ Clear payment status  

### 4. Operational Benefits
✅ Single provider (Paystack) for payment + SMS  
✅ Lower integration complexity  
✅ Better rates than Hubtel  
✅ Comprehensive dashboard  

## 📊 Paystack Pricing (Ghana)

### Transaction Fees
- **Local cards**: 1.95% capped at GH₵10
- **Mobile Money**: 1.5% + GH₵0.50
- **International cards**: 3.9% + GH₵0.50

### SMS Pricing
- **Per SMS**: ~GH₵0.025 (cheaper than Hubtel)
- **Bulk discounts**: Available

### Example Cost (GH₵75 order)
- **Transaction fee**: GH₵1.63 (1.5% + GH₵0.50)
- **SMS cost** (4 messages): GH₵0.10
- **Total cost**: GH₵1.73 per order

## 🚀 Migration from Hubtel to Paystack

### Phase 1: Immediate (Week 1)
1. Create Paystack account
2. Get API keys (test mode)
3. Implement payment endpoints
4. Test Mobile Money flow
5. Test SMS delivery

### Phase 2: Testing (Week 2)
1. Internal testing with real payments
2. Test all Mobile Money providers
3. Verify webhook handling
4. Test refund flow
5. Load testing

### Phase 3: Launch (Week 3)
1. Switch to live API keys
2. Deploy to production
3. Monitor transactions
4. Customer support ready
5. Gradual rollout

## 📞 Paystack Support

- **Website**: https://paystack.com
- **Documentation**: https://paystack.com/docs
- **Support**: support@paystack.com
- **Phone**: +234 1 888 3888
- **Ghana Office**: Accra, Ghana

## ✅ Implementation Checklist

- [ ] Create Paystack account
- [ ] Get API keys (test & live)
- [ ] Update database schema
- [ ] Implement payment endpoints
- [ ] Implement webhook handler
- [ ] Update order state machine
- [ ] Create payment UI screens
- [ ] Implement OTP verification
- [ ] Test Mobile Money flow
- [ ] Test SMS delivery
- [ ] Test refund flow
- [ ] Update documentation
- [ ] Train support team
- [ ] Deploy to production

---

**Ready to implement! This approach provides better security, user experience, and business value.** 🚀
