# FoodHub OTP Timing Guide

## 🕐 OTP Expiry Times

### Payment OTP: **10 Minutes**
```
Purpose: Verify Mobile Money payment
Expiry: 10 minutes (600 seconds)
Reason: Payment should be completed quickly
```

### Delivery OTP: **60 Minutes (1 Hour)**
```
Purpose: Confirm delivery completion
Expiry: 60 minutes (3600 seconds)
Reason: Allows time for food preparation and delivery
```

## 📊 Timing Comparison

| OTP Type | Expiry Time | Use Case | Reason |
|----------|-------------|----------|--------|
| **Payment OTP** | 10 minutes | Payment verification | Quick payment process |
| **Delivery OTP** | 60 minutes | Delivery confirmation | Accounts for prep + delivery time |

## ⏱️ Typical Order Timeline

```
0 min    → Order placed
         → Payment initiated
         
1 min    → Customer pays via Mobile Money
         → Payment OTP sent (expires in 10 min)
         
2 min    → Customer enters Payment OTP
         → Payment verified ✓
         → Order sent to vendor
         
5 min    → Vendor accepts order
         → Food preparation begins
         
25 min   → Food ready
         → Rider assigned
         → Delivery OTP sent (expires in 60 min)
         
45 min   → Rider arrives at customer
         → Customer shares Delivery OTP
         → Rider verifies OTP
         → Order marked delivered ✓
```

## 🎯 Why These Times?

### Payment OTP (10 minutes)
✅ **Quick verification** - Payment should be immediate  
✅ **Security** - Shorter window reduces fraud risk  
✅ **User experience** - Customer is actively engaged  
✅ **Mobile Money flow** - USSD approval is fast  

### Delivery OTP (60 minutes)
✅ **Food preparation** - Typically 15-25 minutes  
✅ **Delivery time** - Typically 15-30 minutes  
✅ **Buffer time** - Accounts for delays (traffic, distance)  
✅ **Customer flexibility** - May not be immediately available  
✅ **Reduced frustration** - Fewer expired OTP issues  

## 📱 SMS Templates

### Payment OTP SMS
```
FoodHub: Your payment verification code is: 123456
Valid for 10 minutes. Order #ORD202604150001
```

### Delivery OTP SMS
```
FoodHub: Your order is on the way! 
Rider: Kofi (+233261234567)
Delivery OTP: 654321 (Valid for 1 hour)
```

## 🔄 OTP Resend Rules

### Payment OTP
- **Cooldown**: 2 minutes between resends
- **Max resends**: 3 times
- **New expiry**: 10 minutes from resend time

### Delivery OTP
- **Cooldown**: 5 minutes between resends
- **Max resends**: 2 times
- **New expiry**: 60 minutes from resend time

## 🚨 Expired OTP Handling

### Payment OTP Expired
```
Scenario: Customer takes >10 minutes to enter OTP
Action: 
1. Show "OTP expired" message
2. Offer "Resend OTP" button
3. Generate new OTP with fresh 10-minute expiry
4. Send new SMS
```

### Delivery OTP Expired
```
Scenario: Delivery takes >60 minutes
Action:
1. Rider sees "OTP expired" message
2. Rider can request new OTP
3. System generates new OTP with fresh 60-minute expiry
4. Send new SMS to customer
5. Customer shares new OTP with rider
```

## 🔒 Security Features

### Both OTP Types
- **6-digit random code** (100,000 - 999,999)
- **SHA-256 hashing** in database
- **Maximum 3 attempts** before lockout
- **Rate limiting** - 1 OTP per order/payment
- **Cryptographically secure** random generation

### Additional Payment OTP Security
- **Shorter expiry** (10 min) reduces attack window
- **Tied to payment transaction** - Cannot be reused
- **Paystack verification** - Double-checked with payment provider

### Additional Delivery OTP Security
- **Longer expiry** (60 min) for user convenience
- **Tied to order** - Cannot be used for different orders
- **Rider verification** - Only riders can submit
- **Location verification** (future) - Verify rider is near delivery location

## 📊 Statistics & Monitoring

### Key Metrics to Track

1. **Payment OTP Success Rate**
   - Target: >95% verified within 10 minutes
   - Alert if: <90%

2. **Delivery OTP Success Rate**
   - Target: >98% verified within 60 minutes
   - Alert if: <95%

3. **Average Verification Time**
   - Payment OTP: Target <2 minutes
   - Delivery OTP: Target <45 minutes

4. **Expiry Rate**
   - Payment OTP: Target <5% expired
   - Delivery OTP: Target <2% expired

5. **Resend Rate**
   - Payment OTP: Target <10% require resend
   - Delivery OTP: Target <5% require resend

## 🛠️ Configuration

### Backend Configuration (application.yml)
```yaml
app:
  payment:
    otp:
      length: 6
      expiration: 600000      # 10 minutes in milliseconds
      max-attempts: 3
  
  otp:
    length: 6
    expiration: 3600000       # 60 minutes in milliseconds
    max-attempts: 3
```

### Environment Variables
```bash
# Payment OTP (10 minutes)
PAYMENT_OTP_EXPIRATION=600000

# Delivery OTP (60 minutes)
DELIVERY_OTP_EXPIRATION=3600000
```

## 🧪 Testing

### Test Scenarios

#### Payment OTP
1. **Happy path**: Enter OTP within 10 minutes ✓
2. **Expired**: Wait 11 minutes, try to enter OTP ✗
3. **Wrong OTP**: Enter incorrect code 3 times ✗
4. **Resend**: Request new OTP after expiry ✓

#### Delivery OTP
1. **Happy path**: Rider enters OTP within 60 minutes ✓
2. **Expired**: Wait 61 minutes, try to enter OTP ✗
3. **Wrong OTP**: Rider enters incorrect code 3 times ✗
4. **Resend**: Request new OTP after expiry ✓

### Test Data
```
Payment OTP (Test Mode): Any 6-digit code works
Delivery OTP (Test Mode): Any 6-digit code works

Production: Real OTPs generated and sent via SMS
```

## 📞 Customer Support

### Common Issues

**Q: I didn't receive the Payment OTP**
- Check phone number is correct
- Check SMS inbox and spam
- Wait 2 minutes, then click "Resend OTP"
- Contact support if still not received

**Q: My Payment OTP expired**
- Click "Resend OTP" button
- New OTP will be sent with fresh 10-minute expiry
- Complete payment verification quickly

**Q: I didn't receive the Delivery OTP**
- Check SMS inbox
- OTP is sent when order is out for delivery
- Contact rider if you can't find it
- Rider can request resend

**Q: My Delivery OTP expired**
- Rider can request new OTP
- New OTP will be sent with fresh 60-minute expiry
- Share new OTP with rider

## ✅ Best Practices

### For Customers
1. ✅ Keep phone nearby during payment
2. ✅ Enter Payment OTP immediately (within 10 min)
3. ✅ Save Delivery OTP SMS for when rider arrives
4. ✅ Be available during estimated delivery time

### For Riders
1. ✅ Call customer before arriving
2. ✅ Confirm customer has OTP ready
3. ✅ Enter OTP carefully (3 attempts max)
4. ✅ Request resend if customer can't find OTP

### For Vendors
1. ✅ Prepare food promptly after payment verification
2. ✅ Notify rider when food is ready
3. ✅ Ensure realistic preparation times

## 🔮 Future Enhancements

### Planned Improvements
- [ ] **Dynamic expiry** - Adjust based on distance/traffic
- [ ] **Biometric verification** - Fingerprint/Face ID option
- [ ] **QR code alternative** - Scan instead of typing OTP
- [ ] **Voice OTP** - Call with automated OTP for accessibility
- [ ] **Smart resend** - Auto-resend if approaching expiry
- [ ] **Location-based verification** - Verify rider is at location

---

**Last Updated**: April 16, 2026  
**Version**: 1.0.1  
**Status**: Production Ready ✅
