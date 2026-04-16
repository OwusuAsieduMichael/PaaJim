# FoodHub Changelog

## [1.0.1] - 2026-04-16

### Changed
- **Delivery OTP Expiry**: Extended from 30 minutes to **60 minutes (1 hour)**
  - Provides more flexibility for delivery time
  - Reduces customer frustration with expired OTPs
  - Better accommodates traffic and distance variations
  - Payment OTP remains at 10 minutes (appropriate for payment verification)

### Updated Files
- `backend/src/main/resources/application.yml` - OTP expiration config
- `docs/SYSTEM_ARCHITECTURE.md` - OTP security documentation
- `docs/PAYMENT_SYSTEM.md` - SMS templates and security
- `database/schema.sql` - Database comments
- `README.md` - OTP flow documentation
- `PAYSTACK_UPDATE_SUMMARY.md` - Summary documentation

### Technical Details
```yaml
# Configuration
app:
  otp:
    expiration: 3600000  # 60 minutes in milliseconds (was 1800000)
```

### SMS Template Update
```
Old: "Delivery OTP: 654321"
New: "Delivery OTP: 654321 (Valid for 1 hour)"
```

---

## [1.0.0] - 2026-04-15

### Added
- **Paystack Integration**: Mobile Money payments (MTN, Vodafone, AirtelTigo)
- **Payment-Before-Delivery Flow**: Secure payment verification before order processing
- **Two OTP System**: 
  - Payment OTP (10 min) for payment verification
  - Delivery OTP (60 min) for delivery confirmation
- **New Order States**: PAYMENT_INITIATED, PAYMENT_VERIFIED, PAYMENT_FAILED
- **Payment Tables**: `payments` and `payment_otp_codes`
- **Paystack SMS**: Integrated SMS via Paystack API

### Changed
- **Payment Provider**: Migrated from Hubtel to Paystack
- **SMS Provider**: Migrated from Hubtel to Paystack
- **Payment Method**: Changed from Cash on Delivery to Mobile Money
- **Order Flow**: Added payment verification step before vendor confirmation

### Removed
- Hubtel API integration
- Cash on Delivery payment method

### Documentation
- Added `docs/PAYMENT_SYSTEM.md` - Complete payment system documentation
- Added `docs/PAYSTACK_MIGRATION_GUIDE.md` - Migration guide
- Added `PAYSTACK_UPDATE_SUMMARY.md` - Quick summary
- Updated all existing documentation for Paystack integration

### Security
- Payment verification with OTP before order processing
- Two-factor authentication (Payment OTP + Delivery OTP)
- Automatic refunds on cancellation
- Digital payment proof and audit trail

### Cost Optimization
- SMS cost reduced from GH₵0.03 to GH₵0.025 per message (17% savings)
- Transaction fee: 1.5% + GH₵0.50 per order
- Single provider integration (reduced complexity)

---

## Version History

- **v1.0.1** (2026-04-16): Extended delivery OTP expiry to 1 hour
- **v1.0.0** (2026-04-15): Initial release with Paystack integration

---

## Upcoming Features

### v1.1.0 (Planned)
- [ ] Multi-vendor support
- [ ] Automatic rider assignment
- [ ] Push notifications
- [ ] Order history and favorites
- [ ] Customer ratings and reviews

### v1.2.0 (Planned)
- [ ] Real-time order tracking
- [ ] In-app chat support
- [ ] Loyalty program
- [ ] Advanced analytics dashboard
- [ ] iOS and Android native apps

### v2.0.0 (Future)
- [ ] Microservices architecture
- [ ] Multiple payment methods (cards, bank transfer)
- [ ] Subscription plans
- [ ] Restaurant management tools
- [ ] Delivery fleet management

---

## Migration Notes

### From v1.0.0 to v1.0.1
No database migration required. Only configuration change:

```bash
# Update environment variable (optional, defaults to 1 hour)
export OTP_EXPIRATION=3600000
```

### From Hubtel to Paystack (v1.0.0)
See `docs/PAYSTACK_MIGRATION_GUIDE.md` for complete migration instructions.

---

## Support

For questions or issues:
- **Technical**: tech@foodhub.gh
- **Documentation**: See `/docs` folder
- **GitHub Issues**: [Create an issue](https://github.com/foodhub/issues)

---

**Last Updated**: April 16, 2026  
**Current Version**: 1.0.1  
**Status**: Production Ready ✅
