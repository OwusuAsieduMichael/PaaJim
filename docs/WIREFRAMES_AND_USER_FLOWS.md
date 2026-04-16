# FoodHub Wireframes & User Flows

## 📱 Customer App

### 1. Home / Menu Screen

```
┌─────────────────────────────────────────┐
│  ☰  FoodHub              🔔(3)  🛒(2)  │ ← Header
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   🍽️ Mama Esi's Kitchen          │ │ ← Vendor Card
│  │   Authentic Ghanaian Cuisine      │ │
│  │   ⭐ 4.8  •  20-30 mins  •  Open  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Categories:                            │
│  ┌────────┐ ┌────────┐ ┌────────┐     │
│  │  Rice  │ │ Soups  │ │Grilled │     │ ← Category Pills
│  │ Dishes │ │& Stews │ │& Fried │     │
│  └────────┘ └────────┘ └────────┘     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ┌─────────┐                    │   │
│  │  │         │  Jollof Rice       │   │
│  │  │  [IMG]  │  with Chicken      │   │ ← Menu Item Card
│  │  │         │                    │   │
│  │  └─────────┘  Spicy Ghanaian    │   │
│  │               jollof with...    │   │
│  │                                 │   │
│  │  GH₵25.00        [+ Add]        │   │
│  │  ~20 mins                       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ┌─────────┐                    │   │
│  │  │         │  Waakye with       │   │
│  │  │  [IMG]  │  Fish              │   │
│  │  │         │                    │   │
│  │  └─────────┘  Rice and beans    │   │
│  │               with fried...     │   │
│  │                                 │   │
│  │  GH₵20.00        [+ Add]        │   │
│  │  ~15 mins                       │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Interactions:**
- Tap category → Filter menu
- Tap menu item → View details modal
- Tap "+ Add" → Add to cart (show toast)
- Tap cart icon → Go to cart screen
- Tap bell icon → View notifications

---

### 2. Cart Screen

```
┌─────────────────────────────────────────┐
│  ←  Your Cart                           │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Jollof Rice with Chicken       │   │
│  │  GH₵25.00                       │   │
│  │                                 │   │
│  │  [-]  2  [+]        GH₵50.00   │   │ ← Quantity Controls
│  │                                 │   │
│  │  Special instructions:          │   │
│  │  Extra spicy please             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Waakye with Fish               │   │
│  │  GH₵20.00                       │   │
│  │                                 │   │
│  │  [-]  1  [+]        GH₵20.00   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Subtotal          GH₵70.00     │   │
│  │  Delivery Fee      GH₵ 5.00     │   │
│  │  ─────────────────────────────  │   │
│  │  Total             GH₵75.00     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     Proceed to Checkout         │   │ ← Primary CTA
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Interactions:**
- Tap [-] → Decrease quantity (min 1)
- Tap [+] → Increase quantity
- Tap item → Edit special instructions
- Tap "Proceed to Checkout" → Go to checkout

---

### 3. Checkout Screen

```
┌─────────────────────────────────────────┐
│  ←  Checkout                            │
├─────────────────────────────────────────┤
│                                         │
│  Delivery Location                      │
│  ┌─────────────────────────────────┐   │
│  │  📍 House 23, Effiduasi New     │   │
│  │     Town                        │   │
│  │                                 │   │
│  │  [Change Location]              │   │ ← Opens map modal
│  └─────────────────────────────────┘   │
│                                         │
│  Delivery Notes (Optional)              │
│  ┌─────────────────────────────────┐   │
│  │  White gate, call when you      │   │
│  │  arrive                         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Phone Number                           │
│  ┌─────────────────────────────────┐   │
│  │  +233 24 123 4567               │   │
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
│  ┌─────────────────────────────────┐   │
│  │       Place Order               │   │ ← Primary CTA
│  └─────────────────────────────────┘   │
│                                         │
│  Payment: Cash on Delivery              │
│                                         │
└─────────────────────────────────────────┘
```

**Interactions:**
- Tap "Change Location" → Open map modal
- Tap "Place Order" → Submit order → Go to order status

---

### 4. Location Picker Modal

```
┌─────────────────────────────────────────┐
│  ×  Select Delivery Location            │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │         [Google Map]            │   │
│  │                                 │   │
│  │            📍                   │   │ ← Draggable marker
│  │                                 │   │
│  │                                 │   │
│  │                        [🧭]     │   │ ← Current location
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📍 Selected Location           │   │
│  │     House 23, Effiduasi New     │   │
│  │     Town, Ghana                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Drag marker or tap map to select      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     Confirm Location            │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

### 5. Order Status Screen

```
┌─────────────────────────────────────────┐
│  ←  Order #ORD202604150001              │
├─────────────────────────────────────────┤
│                                         │
│  Order Status                           │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │  ●━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  ✓ Order Placed                 │   │
│  │    15 Apr, 12:00 PM             │   │
│  │                                 │   │
│  │  ●━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  ✓ Confirmed                    │   │
│  │    15 Apr, 12:05 PM             │   │
│  │                                 │   │
│  │  ●━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │  🚴 Out for Delivery  [Current] │   │
│  │    15 Apr, 12:25 PM             │   │
│  │    Rider will call you shortly  │   │
│  │                                 │   │
│  │  ○                              │   │
│  │  Delivered                      │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ⚠️ Important                           │
│  ┌─────────────────────────────────┐   │
│  │  Please share the OTP code sent │   │
│  │  to your phone with the rider   │   │
│  │  upon delivery.                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Delivery Details                       │
│  ┌─────────────────────────────────┐   │
│  │  📍 House 23, Effiduasi New     │   │
│  │     Town                        │   │
│  │                                 │   │
│  │  📞 Rider: Kofi (+233 26 123...)│   │
│  │                                 │   │
│  │  💰 Total: GH₵75.00             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Order Items                            │
│  • Jollof Rice with Chicken (2x)        │
│  • Waakye with Fish (1x)                │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🏪 Vendor App

### 1. Dashboard / Orders Screen

```
┌─────────────────────────────────────────┐
│  ☰  Mama Esi's Kitchen    🔔(2)  [●]   │ ← Open/Closed toggle
├─────────────────────────────────────────┤
│                                         │
│  Today's Orders                         │
│  ┌─────────────────────────────────┐   │
│  │  📊 5 Pending  •  3 Confirmed   │   │
│  │     2 Out for Delivery          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Filters: [All] [Pending] [Active]     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Order #ORD202604150001  [NEW]  │   │
│  │  ⏰ 12:00 PM                    │   │
│  │                                 │   │
│  │  👤 Kwame Mensah                │   │
│  │  📞 +233 24 123 4567            │   │
│  │  📍 House 23, Effiduasi...      │   │
│  │                                 │   │
│  │  Items:                         │   │
│  │  • Jollof Rice x2    GH₵50.00   │   │
│  │  • Waakye x1         GH₵20.00   │   │
│  │                                 │   │
│  │  Total: GH₵75.00                │   │
│  │                                 │   │
│  │  ┌───────────────────────────┐  │   │
│  │  │   ✓ Accept Order          │  │   │ ← Primary action
│  │  └───────────────────────────┘  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Order #ORD202604150002         │   │
│  │  ⏰ 11:45 AM  [CONFIRMED]       │   │
│  │                                 │   │
│  │  👤 Ama Serwaa                  │   │
│  │  💰 Total: GH₵45.00             │   │
│  │                                 │   │
│  │  ✓ Confirmed • Waiting for      │   │
│  │    rider assignment             │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Interactions:**
- Tap toggle → Open/close restaurant
- Tap order card → View full details
- Tap "Accept Order" → Confirm order
- Tap bell → View notifications
- Tap filter → Filter orders by status

---

### 2. Order Details (Expanded)

```
┌─────────────────────────────────────────┐
│  ←  Order #ORD202604150001              │
├─────────────────────────────────────────┤
│                                         │
│  [NEW ORDER]                            │
│  Placed at 12:00 PM                     │
│                                         │
│  Customer Information                   │
│  ┌─────────────────────────────────┐   │
│  │  👤 Kwame Mensah                │   │
│  │  📞 +233 24 123 4567  [Call]    │   │
│  │  📍 House 23, Effiduasi New     │   │
│  │     Town                        │   │
│  │     Note: White gate, call when │   │
│  │     you arrive                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Order Items                            │
│  ┌─────────────────────────────────┐   │
│  │  Jollof Rice with Chicken       │   │
│  │  Qty: 2              GH₵50.00   │   │
│  │  Note: Extra spicy please       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Waakye with Fish               │   │
│  │  Qty: 1              GH₵20.00   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Order Total                            │
│  ┌─────────────────────────────────┐   │
│  │  Subtotal          GH₵70.00     │   │
│  │  Delivery Fee      GH₵ 5.00     │   │
│  │  ─────────────────────────────  │   │
│  │  Total             GH₵75.00     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     ✓ Accept Order              │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🚴 Rider App

### 1. Deliveries Screen

```
┌─────────────────────────────────────────┐
│  ☰  Deliveries              🔔(1)  [●]  │ ← Available toggle
├─────────────────────────────────────────┤
│                                         │
│  Status: Available for deliveries       │
│  ┌─────────────────────────────────┐   │
│  │  📦 2 Active Deliveries         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Order #ORD202604150001         │   │
│  │  [IN PROGRESS]                  │   │
│  │  Started at 12:25 PM            │   │
│  │                                 │   │
│  │  Customer                       │   │
│  │  👤 Kwame Mensah                │   │
│  │  📞 +233 24 123 4567  [📞 Call] │   │
│  │                                 │   │
│  │  Delivery Address               │   │
│  │  📍 House 23, Effiduasi New     │   │
│  │     Town                        │   │
│  │     Note: White gate, call when │   │
│  │     you arrive                  │   │
│  │                                 │   │
│  │  ┌───────────────────────────┐  │   │
│  │  │  🗺️ Open in Maps          │  │   │
│  │  └───────────────────────────┘  │   │
│  │                                 │   │
│  │  💰 Total: GH₵75.00             │   │
│  │                                 │   │
│  │  Enter OTP from Customer        │   │
│  │  ┌───────────────────────────┐  │   │
│  │  │      [0][0][0][0][0][0]   │  │   │ ← OTP input
│  │  └───────────────────────────┘  │   │
│  │                                 │   │
│  │  ┌───────────────────────────┐  │   │
│  │  │  ✓ Confirm Delivery       │  │   │
│  │  └───────────────────────────┘  │   │
│  │                                 │   │
│  │  Ask customer for 6-digit OTP   │   │
│  │  sent to their phone            │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Interactions:**
- Tap toggle → Mark available/unavailable
- Tap "Call" → Phone call to customer
- Tap "Open in Maps" → Open Google Maps
- Enter OTP → Enable confirm button
- Tap "Confirm Delivery" → Verify OTP

---

## 🔔 Notifications Panel (All Apps)

```
┌─────────────────────────────────────────┐
│  ×  Notifications                       │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ● New Order                    │   │
│  │    Order #ORD202604150001       │   │
│  │    2 minutes ago                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ✓ Order Confirmed              │   │
│  │    Your order has been confirmed│   │
│  │    by Mama Esi's Kitchen        │   │
│  │    15 minutes ago               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  🚴 Out for Delivery            │   │
│  │    Your order is on the way!    │   │
│  │    1 hour ago                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Mark all as read]                     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔄 Complete User Flows

### Flow 1: Customer Places Order

```
1. Home Screen
   ↓ Browse menu
2. Tap "+ Add" on menu item
   ↓ Item added to cart (toast notification)
3. Tap cart icon (shows badge: 2)
   ↓ Navigate to cart
4. Cart Screen
   ↓ Review items, adjust quantities
5. Tap "Proceed to Checkout"
   ↓ Navigate to checkout
6. Checkout Screen
   ↓ Select delivery location (map modal)
   ↓ Enter delivery notes
   ↓ Confirm phone number
7. Tap "Place Order"
   ↓ API call: POST /orders
   ↓ Order created (PENDING)
   ↓ SMS sent to vendor
   ↓ Navigate to order status
8. Order Status Screen
   ↓ Shows "Order Placed" step complete
   ↓ Waiting for vendor confirmation
```

### Flow 2: Vendor Confirms Order

```
1. Vendor Dashboard
   ↓ Notification: "New Order"
2. Tap notification or order card
   ↓ Navigate to order details
3. Order Details Screen
   ↓ Review customer info
   ↓ Review order items
   ↓ Check special instructions
4. Tap "Accept Order"
   ↓ API call: PUT /orders/{id}/confirm
   ↓ Order status → CONFIRMED
   ↓ SMS sent to customer
   ↓ Notification sent to customer
5. Order card updates to "CONFIRMED"
   ↓ Shows "Waiting for rider assignment"
```

### Flow 3: Rider Delivers Order

```
1. Admin assigns rider (manual)
   ↓ API call: PUT /orders/{id}/assign-rider
   ↓ Notification sent to rider
2. Rider Dashboard
   ↓ New delivery appears
3. Tap delivery card
   ↓ View customer details
4. Tap "Call" button
   ↓ Phone call to customer
   ↓ Confirm location
5. Tap "Open in Maps"
   ↓ Google Maps opens with destination
   ↓ Navigate to customer
6. Arrive at location
   ↓ Tap "Mark Out for Delivery" (if not already)
   ↓ API call: PUT /orders/{id}/out-for-delivery
   ↓ OTP generated and sent to customer
7. Ask customer for OTP
   ↓ Customer shares 6-digit code
8. Enter OTP in app
   ↓ Input: 1-2-3-4-5-6
9. Tap "Confirm Delivery"
   ↓ API call: POST /otp/verify
   ↓ OTP validated
   ↓ Order status → DELIVERED
   ↓ SMS sent to all parties
   ↓ Success screen shown
10. Delivery complete
    ↓ Return to deliveries list
```

### Flow 4: OTP Verification (Error Handling)

```
1. Rider enters OTP: 1-2-3-4-5-7 (wrong)
   ↓ Tap "Confirm Delivery"
2. API validates OTP
   ↓ OTP incorrect
   ↓ Increment attempts (1/3)
3. Error message shown
   ↓ "Invalid OTP. 2 attempts remaining."
4. Rider asks customer again
   ↓ Customer provides correct OTP
5. Rider enters: 1-2-3-4-5-6
   ↓ Tap "Confirm Delivery"
6. API validates OTP
   ↓ OTP correct
   ↓ Order status → DELIVERED
7. Success!
```

---

## 🎨 Design Annotations

### Spacing
- **Page margins**: 16px (mobile), 24px (tablet)
- **Card padding**: 16px
- **Element spacing**: 8px (tight), 16px (normal), 24px (loose)
- **Section spacing**: 24px

### Typography
- **Page title**: 24px, semibold
- **Card title**: 18px, semibold
- **Body text**: 16px, regular
- **Secondary text**: 14px, regular
- **Caption**: 12px, regular

### Colors
- **Primary action**: Orange (#FF6B35)
- **Success**: Green (#10B981)
- **Background**: Light gray (#FAFAFA)
- **Card**: White (#FFFFFF)
- **Text**: Dark gray (#171717)
- **Secondary text**: Medium gray (#737373)

### Interactive Elements
- **Buttons**: 44px min height (touch target)
- **Input fields**: 48px height
- **Icons**: 20-24px size
- **Badges**: 24px height

### Animations
- **Page transitions**: 300ms ease-out
- **Button hover**: 200ms ease-in-out
- **Toast notifications**: Slide up, 3s duration
- **Loading spinners**: Continuous rotation

---

## 📐 Responsive Breakpoints

### Mobile (< 640px)
- Single column layout
- Full-width cards
- Bottom navigation (optional)
- Stacked forms

### Tablet (640px - 1024px)
- Two-column grid for menu
- Side-by-side cart/summary
- Larger touch targets

### Desktop (> 1024px)
- Three-column grid for menu
- Fixed sidebar for cart
- Hover states enabled
- Keyboard shortcuts

---

## ✅ Accessibility Checklist

- [ ] All interactive elements have 44x44px min size
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Focus indicators visible
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Error messages are clear
- [ ] Success states announced
- [ ] Loading states indicated

---

**These wireframes represent the MVP design. Future iterations can add:**
- Dark mode
- Multiple languages
- Advanced filters
- Order history
- Favorites/saved items
- Ratings and reviews
- Loyalty program
- In-app chat
