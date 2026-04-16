# Paystack Migration Guide

## 🎯 Overview

This guide covers migrating from Hubtel to **Paystack** for both SMS and payment processing, implementing the new **payment-before-delivery** flow.

## 🔄 What's Changing

### Before (Hubtel + Cash on Delivery)
```
Order → Vendor Confirms → Rider Delivers → Customer Pays Cash → Complete
```

### After (Paystack + Mobile Money)
```
Order → Customer Pays (MoMo) → Payment OTP → Vendor Confirms → Rider Delivers → Delivery OTP → Complete
```

## 📋 Prerequisites

### 1. Create Paystack Account
1. Go to https://paystack.com
2. Click "Get Started"
3. Fill in business details:
   - Business Name: FoodHub Ghana
   - Business Type: Food Delivery
   - Country: Ghana
   - Phone: Your business phone
   - Email: Your business email

4. Verify email and phone
5. Complete KYC (Know Your Customer):
   - Business registration documents
   - ID verification
   - Bank account details

### 2. Get API Keys

#### Test Mode (Development)
```
Public Key: pk_test_xxxxxxxxxxxxx
Secret Key: sk_test_xxxxxxxxxxxxx
```

#### Live Mode (Production)
```
Public Key: pk_live_xxxxxxxxxxxxx
Secret Key: sk_live_xxxxxxxxxxxxx
```

**Location**: Dashboard → Settings → API Keys & Webhooks

### 3. Enable Mobile Money

1. Go to Dashboard → Settings → Payment Methods
2. Enable:
   - ✅ MTN Mobile Money
   - ✅ Vodafone Cash
   - ✅ AirtelTigo Money
3. Complete Mobile Money setup (may require additional verification)

### 4. Enable SMS

1. Go to Dashboard → Messaging → SMS
2. Enable SMS service
3. Set sender ID: **FoodHub**
4. Fund SMS wallet (minimum GH₵10)

## 🗄️ Database Migration

### Step 1: Backup Current Database
```bash
# Create backup
pg_dump -U postgres foodhub > foodhub_backup_$(date +%Y%m%d).sql

# Verify backup
ls -lh foodhub_backup_*.sql
```

### Step 2: Update Order Status Enum
```sql
-- Connect to database
psql -U postgres -d foodhub

-- Add new statuses to enum
ALTER TYPE order_status ADD VALUE 'PAYMENT_INITIATED';
ALTER TYPE order_status ADD VALUE 'PAYMENT_VERIFIED';
ALTER TYPE order_status ADD VALUE 'PAYMENT_FAILED';

-- Verify
SELECT enum_range(NULL::order_status);
```

### Step 3: Add Payment Columns to Orders
```sql
-- Add payment-related columns
ALTER TABLE orders 
  ADD COLUMN payment_method VARCHAR(50),
  ADD COLUMN payment_provider VARCHAR(50),
  ADD COLUMN payment_reference VARCHAR(100) UNIQUE,
  ADD COLUMN payment_status VARCHAR(50),
  ADD COLUMN paid_at TIMESTAMP,
  ADD COLUMN payment_amount DECIMAL(10, 2),
  ADD COLUMN payment_initiated_at TIMESTAMP,
  ADD COLUMN payment_verified_at TIMESTAMP;

-- Add indexes
CREATE INDEX idx_orders_payment_reference ON orders(payment_reference);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

-- Verify
\d orders
```

### Step 4: Create Payments Table
```sql
-- Run the payments table creation from schema
-- (See database/schema.sql - PAYMENTS section)

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_reference VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'GHS',
    payment_method VARCHAR(50) NOT NULL,
    provider VARCHAR(50),
    status VARCHAR(50) NOT NULL,
    paystack_transaction_id BIGINT,
    authorization_code VARCHAR(100),
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    failed_at TIMESTAMP,
    failure_reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_reference ON payments(payment_reference);
CREATE INDEX idx_payments_status ON payments(status);

-- Verify
\d payments
```

### Step 5: Create Payment OTP Table
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

-- Verify
\d payment_otp_codes
```

### Step 6: Update Notification Types
```sql
-- Add new notification types
ALTER TYPE notification_type ADD VALUE 'PAYMENT_INITIATED';
ALTER TYPE notification_type ADD VALUE 'PAYMENT_VERIFIED';

-- Verify
SELECT enum_range(NULL::notification_type);
```

## 🔧 Backend Configuration

### Step 1: Update application.yml
```yaml
app:
  # Remove Hubtel configuration
  # sms:
  #   provider: hubtel
  #   api-key: ${HUBTEL_API_KEY}
  #   api-secret: ${HUBTEL_API_SECRET}
  
  # Add Paystack configuration
  payment:
    provider: paystack
    paystack:
      secret-key: ${PAYSTACK_SECRET_KEY}
      public-key: ${PAYSTACK_PUBLIC_KEY}
      base-url: https://api.paystack.co
      callback-url: ${PAYSTACK_CALLBACK_URL}
    mobile-money:
      providers: mtn,vodafone,airteltigo
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

### Step 2: Set Environment Variables
```bash
# Remove Hubtel variables
unset HUBTEL_API_KEY
unset HUBTEL_API_SECRET
unset HUBTEL_SENDER_ID

# Add Paystack variables
export PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
export PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
export PAYSTACK_CALLBACK_URL=https://api.foodhub.gh/api/v1/webhooks/paystack
```

### Step 3: Update pom.xml (Add Dependencies)
```xml
<!-- Add to pom.xml -->
<dependencies>
    <!-- Paystack Java SDK (if available) or use RestTemplate -->
    <dependency>
        <groupId>org.apache.httpcomponents</groupId>
        <artifactId>httpclient</artifactId>
    </dependency>
    
    <!-- For webhook signature verification -->
    <dependency>
        <groupId>commons-codec</groupId>
        <artifactId>commons-codec</artifactId>
    </dependency>
</dependencies>
```

## 💻 Code Implementation

### Step 1: Create Payment Models

**Payment.java**
```java
package com.foodhub.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", unique = true, nullable = false)
    private Order order;
    
    @Column(name = "payment_reference", unique = true, nullable = false)
    private String paymentReference;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(length = 3)
    @Builder.Default
    private String currency = "GHS";
    
    @Column(name = "payment_method", nullable = false)
    private String paymentMethod; // mobile_money, card
    
    private String provider; // mtn, vodafone, airteltigo
    
    @Column(nullable = false)
    private String status; // pending, success, failed
    
    @Column(name = "paystack_transaction_id")
    private Long paystackTransactionId;
    
    @Column(name = "authorization_code")
    private String authorizationCode;
    
    @Column(name = "initiated_at")
    @CreationTimestamp
    private LocalDateTime initiatedAt;
    
    @Column(name = "paid_at")
    private LocalDateTime paidAt;
    
    @Column(name = "failed_at")
    private LocalDateTime failedAt;
    
    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;
    
    @Column(columnDefinition = "jsonb")
    private String metadata;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Helper methods
    public boolean isPending() {
        return "pending".equals(status);
    }
    
    public boolean isSuccess() {
        return "success".equals(status);
    }
    
    public boolean isFailed() {
        return "failed".equals(status);
    }
}
```

**PaymentOtpCode.java**
```java
package com.foodhub.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payment_otp_codes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOtpCode {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", unique = true, nullable = false)
    private Payment payment;
    
    @Column(nullable = false, length = 6)
    private String code;
    
    @Column(name = "generated_at")
    @CreationTimestamp
    private LocalDateTime generatedAt;
    
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
    
    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer attempts = 0;
    
    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = false;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Helper methods
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
    
    public boolean isValid() {
        return !isVerified && !isExpired() && attempts < 3;
    }
    
    public void incrementAttempts() {
        this.attempts++;
    }
    
    public int getRemainingAttempts() {
        return Math.max(0, 3 - attempts);
    }
    
    public void markAsVerified() {
        this.isVerified = true;
        this.verifiedAt = LocalDateTime.now();
    }
}
```

### Step 2: Create Payment Service

**PaymentService.java**
```java
package com.foodhub.service;

import com.foodhub.model.*;
import com.foodhub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final PaymentOtpCodeRepository paymentOtpRepository;
    private final OrderRepository orderRepository;
    private final SmsService smsService;
    private final RestTemplate restTemplate;
    
    @Value("${app.payment.paystack.secret-key}")
    private String paystackSecretKey;
    
    @Value("${app.payment.paystack.base-url}")
    private String paystackBaseUrl;
    
    @Transactional
    public Payment initiatePayment(UUID orderId, String paymentMethod, 
                                   String provider, String phoneNumber) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Create payment record
        Payment payment = Payment.builder()
            .order(order)
            .paymentReference(generatePaymentReference())
            .amount(order.getTotal())
            .currency("GHS")
            .paymentMethod(paymentMethod)
            .provider(provider)
            .status("pending")
            .build();
        
        payment = paymentRepository.save(payment);
        
        // Call Paystack API
        Map<String, Object> paystackRequest = new HashMap<>();
        paystackRequest.put("email", order.getCustomer().getEmail());
        paystackRequest.put("amount", order.getTotal().multiply(BigDecimal.valueOf(100)).intValue()); // Convert to pesewas
        paystackRequest.put("currency", "GHS");
        paystackRequest.put("channels", List.of("mobile_money"));
        paystackRequest.put("mobile_money", Map.of(
            "phone", phoneNumber.replace("+233", "0"),
            "provider", provider
        ));
        paystackRequest.put("metadata", Map.of(
            "order_id", orderId.toString(),
            "order_number", order.getOrderNumber()
        ));
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(paystackSecretKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(paystackRequest, headers);
        
        ResponseEntity<Map> response = restTemplate.postForEntity(
            paystackBaseUrl + "/transaction/initialize",
            request,
            Map.class
        );
        
        // Update payment with Paystack response
        Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
        payment.setPaymentReference((String) data.get("reference"));
        payment.setAuthorizationCode((String) data.get("access_code"));
        
        // Update order status
        order.setStatus(OrderStatus.PAYMENT_INITIATED);
        order.setPaymentInitiatedAt(LocalDateTime.now());
        orderRepository.save(order);
        
        // Generate and send OTP
        generateAndSendPaymentOtp(payment);
        
        return paymentRepository.save(payment);
    }
    
    @Transactional
    public boolean verifyPaymentOtp(UUID orderId, String otp) {
        Payment payment = paymentRepository.findByOrderId(orderId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        PaymentOtpCode otpCode = paymentOtpRepository.findByPaymentId(payment.getId())
            .orElseThrow(() -> new RuntimeException("OTP not found"));
        
        if (!otpCode.isValid()) {
            throw new RuntimeException("OTP expired or invalid");
        }
        
        otpCode.incrementAttempts();
        
        if (!otpCode.getCode().equals(otp)) {
            paymentOtpRepository.save(otpCode);
            throw new RuntimeException("Invalid OTP. " + otpCode.getRemainingAttempts() + " attempts remaining");
        }
        
        // Mark OTP as verified
        otpCode.markAsVerified();
        paymentOtpRepository.save(otpCode);
        
        // Verify payment with Paystack
        boolean paymentVerified = verifyWithPaystack(payment.getPaymentReference());
        
        if (paymentVerified) {
            payment.setStatus("success");
            payment.setPaidAt(LocalDateTime.now());
            paymentRepository.save(payment);
            
            // Update order
            Order order = payment.getOrder();
            order.setStatus(OrderStatus.PAYMENT_VERIFIED);
            order.setPaymentVerifiedAt(LocalDateTime.now());
            orderRepository.save(order);
            
            // Send confirmation SMS
            smsService.sendSms(
                order.getCustomerPhone(),
                String.format("Payment of GH₵%.2f confirmed! Your order #%s is being prepared.",
                    payment.getAmount(), order.getOrderNumber())
            );
            
            return true;
        }
        
        return false;
    }
    
    private void generateAndSendPaymentOtp(Payment payment) {
        String otp = generateOtp();
        
        PaymentOtpCode otpCode = PaymentOtpCode.builder()
            .payment(payment)
            .code(otp)
            .expiresAt(LocalDateTime.now().plusMinutes(10))
            .build();
        
        paymentOtpRepository.save(otpCode);
        
        // Send OTP via SMS
        smsService.sendSms(
            payment.getOrder().getCustomerPhone(),
            String.format("Your FoodHub payment verification code is: %s. Valid for 10 minutes. Order #%s",
                otp, payment.getOrder().getOrderNumber())
        );
    }
    
    private boolean verifyWithPaystack(String reference) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(paystackSecretKey);
        
        HttpEntity<?> request = new HttpEntity<>(headers);
        
        ResponseEntity<Map> response = restTemplate.exchange(
            paystackBaseUrl + "/transaction/verify/" + reference,
            HttpMethod.GET,
            request,
            Map.class
        );
        
        Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
        return "success".equals(data.get("status"));
    }
    
    private String generatePaymentReference() {
        return "PAY" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
```

## 🎨 Frontend Updates

### Step 1: Update Checkout Screen

Add payment method selection and Mobile Money number input.

### Step 2: Create Payment OTP Screen

New screen for entering payment verification OTP.

### Step 3: Update Order Flow

Add payment status indicators in order tracking.

## 🧪 Testing

### Test Mode Testing

1. **Test Mobile Money Numbers** (Paystack provides these):
```
MTN: 0241234567
Vodafone: 0501234567
AirtelTigo: 0261234567
```

2. **Test OTP**: Any 6-digit code works in test mode

3. **Test Flow**:
```bash
# 1. Place order
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"items": [...], "deliveryAddress": "..."}'

# 2. Initiate payment
curl -X POST http://localhost:8080/api/v1/payments/initialize \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"orderId": "uuid", "paymentMethod": "mobile_money", "provider": "mtn", "phoneNumber": "+233241234567"}'

# 3. Verify OTP
curl -X POST http://localhost:8080/api/v1/payments/verify-otp \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"orderId": "uuid", "otp": "123456"}'
```

## 🚀 Deployment

### Step 1: Update Production Environment Variables
```bash
# In Railway/Vercel
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
PAYSTACK_CALLBACK_URL=https://api.foodhub.gh/api/v1/webhooks/paystack
```

### Step 2: Run Database Migrations
```bash
# Connect to production database
psql $DATABASE_URL

# Run migration scripts
\i migrations/001_add_payment_tables.sql
```

### Step 3: Deploy Backend
```bash
cd backend
mvn clean package
railway up
```

### Step 4: Deploy Frontend
```bash
cd frontend/customer
npm run build
vercel --prod
```

## ✅ Post-Migration Checklist

- [ ] Paystack account created and verified
- [ ] API keys obtained (test & live)
- [ ] Mobile Money enabled
- [ ] SMS enabled and funded
- [ ] Database migrated
- [ ] Backend code updated
- [ ] Frontend code updated
- [ ] Test mode testing completed
- [ ] Live mode testing completed
- [ ] Webhook configured
- [ ] Monitoring setup
- [ ] Support team trained
- [ ] Documentation updated

## 📞 Support

- **Paystack Support**: support@paystack.com
- **Technical Issues**: tech@foodhub.gh
- **Documentation**: docs/PAYMENT_SYSTEM.md

---

**Migration complete! Your system now supports secure Mobile Money payments with Paystack.** 🚀
