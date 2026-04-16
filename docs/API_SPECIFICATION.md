# FoodHub API Specification

## Base URL
```
Production: https://api.foodhub.gh/v1
Development: http://localhost:8080/api/v1
```

## Authentication
All endpoints (except auth) require JWT Bearer token:
```
Authorization: Bearer <jwt_token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/register
Register a new user

**Request:**
```json
{
  "phoneNumber": "+233241234567",
  "fullName": "Kwame Mensah",
  "email": "kwame@example.com",
  "password": "SecurePass123!",
  "role": "CUSTOMER"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "phoneNumber": "+233241234567",
    "fullName": "Kwame Mensah",
    "role": "CUSTOMER",
    "token": "jwt_token_here"
  }
}
```

### POST /auth/login
Login user

**Request:**
```json
{
  "phoneNumber": "+233241234567",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "fullName": "Kwame Mensah",
    "role": "CUSTOMER",
    "token": "jwt_token_here"
  }
}
```

---

## 👤 User Endpoints

### GET /users/profile
Get current user profile

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "phoneNumber": "+233241234567",
    "fullName": "Kwame Mensah",
    "email": "kwame@example.com",
    "role": "CUSTOMER",
    "isActive": true,
    "createdAt": "2026-04-15T10:00:00Z"
  }
}
```

### PUT /users/profile
Update user profile

**Request:**
```json
{
  "fullName": "Kwame Mensah Jr.",
  "email": "kwame.new@example.com"
}
```

**Response:** `200 OK`

---

## 🏪 Vendor Endpoints

### GET /vendor/profile
Get vendor profile and business info

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "businessName": "Mama Esi's Kitchen",
    "description": "Authentic Ghanaian cuisine",
    "logoUrl": "https://...",
    "bannerUrl": "https://...",
    "address": "Effiduasi Market Street",
    "latitude": 6.7833,
    "longitude": -1.4167,
    "isOpen": true,
    "openingTime": "08:00:00",
    "closingTime": "20:00:00"
  }
}
```

### PUT /vendor/profile
Update vendor profile

### PUT /vendor/status
Toggle vendor open/closed status

**Request:**
```json
{
  "isOpen": false
}
```

---

## 🍽️ Menu Endpoints

### GET /menu/categories
Get all menu categories

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Rice Dishes",
      "displayOrder": 1,
      "isActive": true
    }
  ]
}
```

### GET /menu/products
Get all products (menu items)

**Query Parameters:**
- `categoryId` (optional): Filter by category
- `available` (optional): Filter by availability

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Jollof Rice with Chicken",
      "description": "Spicy Ghanaian jollof with grilled chicken",
      "price": 25.00,
      "imageUrl": "https://...",
      "isAvailable": true,
      "preparationTime": 20,
      "category": {
        "id": "uuid",
        "name": "Rice Dishes"
      }
    }
  ]
}
```

### POST /menu/products
Create new product (Vendor only)

**Request:**
```json
{
  "categoryId": "uuid",
  "name": "Jollof Rice with Chicken",
  "description": "Spicy Ghanaian jollof with grilled chicken",
  "price": 25.00,
  "imageUrl": "https://...",
  "preparationTime": 20
}
```

**Response:** `201 Created`

### PUT /menu/products/{productId}
Update product

### DELETE /menu/products/{productId}
Delete product (soft delete - sets isAvailable to false)

### PUT /menu/products/{productId}/availability
Toggle product availability

**Request:**
```json
{
  "isAvailable": false
}
```

---

## 🛒 Order Endpoints

### POST /orders
Create new order (Customer only)

**Request:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "specialInstructions": "Extra spicy please"
    }
  ],
  "deliveryAddress": "House 23, Effiduasi New Town",
  "deliveryLatitude": 6.7833,
  "deliveryLongitude": -1.4167,
  "deliveryNotes": "White gate, call when you arrive",
  "customerPhone": "+233241234567"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "orderNumber": "ORD202604150001",
    "status": "PENDING",
    "subtotal": 50.00,
    "deliveryFee": 5.00,
    "total": 55.00,
    "estimatedDeliveryTime": 45,
    "placedAt": "2026-04-15T12:00:00Z"
  }
}
```

### GET /orders
Get orders list

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (default: 0)
- `size` (default: 20)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "uuid",
        "orderNumber": "ORD202604150001",
        "status": "CONFIRMED",
        "total": 55.00,
        "placedAt": "2026-04-15T12:00:00Z",
        "vendor": {
          "businessName": "Mama Esi's Kitchen"
        },
        "itemCount": 2
      }
    ],
    "totalElements": 10,
    "totalPages": 1,
    "currentPage": 0
  }
}
```

### GET /orders/{orderId}
Get order details

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD202604150001",
    "status": "OUT_FOR_DELIVERY",
    "subtotal": 50.00,
    "deliveryFee": 5.00,
    "total": 55.00,
    "deliveryAddress": "House 23, Effiduasi New Town",
    "deliveryLatitude": 6.7833,
    "deliveryLongitude": -1.4167,
    "deliveryNotes": "White gate, call when you arrive",
    "customerPhone": "+233241234567",
    "placedAt": "2026-04-15T12:00:00Z",
    "confirmedAt": "2026-04-15T12:05:00Z",
    "outForDeliveryAt": "2026-04-15T12:25:00Z",
    "estimatedDeliveryTime": 45,
    "customer": {
      "fullName": "Kwame Mensah",
      "phoneNumber": "+233241234567"
    },
    "vendor": {
      "businessName": "Mama Esi's Kitchen",
      "phoneNumber": "+233501234567"
    },
    "rider": {
      "fullName": "Kofi Rider",
      "phoneNumber": "+233261234567"
    },
    "items": [
      {
        "id": "uuid",
        "productName": "Jollof Rice with Chicken",
        "quantity": 2,
        "price": 25.00,
        "subtotal": 50.00,
        "specialInstructions": "Extra spicy please"
      }
    ]
  }
}
```

### PUT /orders/{orderId}/confirm
Confirm order (Vendor only)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Order confirmed successfully",
  "data": {
    "orderId": "uuid",
    "status": "CONFIRMED",
    "confirmedAt": "2026-04-15T12:05:00Z"
  }
}
```

### PUT /orders/{orderId}/assign-rider
Assign rider to order (Admin/System)

**Request:**
```json
{
  "riderId": "uuid"
}
```

**Response:** `200 OK`

### PUT /orders/{orderId}/out-for-delivery
Mark order as out for delivery (Rider only)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Order marked as out for delivery. OTP sent to customer.",
  "data": {
    "orderId": "uuid",
    "status": "OUT_FOR_DELIVERY",
    "outForDeliveryAt": "2026-04-15T12:25:00Z",
    "otpGenerated": true
  }
}
```

### PUT /orders/{orderId}/cancel
Cancel order

**Request:**
```json
{
  "reason": "Customer requested cancellation"
}
```

**Response:** `200 OK`

---

## 🔐 OTP Endpoints

### POST /otp/verify
Verify OTP for delivery confirmation (Rider only)

**Request:**
```json
{
  "orderId": "uuid",
  "code": "123456"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Delivery confirmed successfully",
  "data": {
    "orderId": "uuid",
    "status": "DELIVERED",
    "deliveredAt": "2026-04-15T12:45:00Z",
    "verified": true
  }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "error": "Invalid OTP code",
  "attemptsRemaining": 2
}
```

### POST /otp/resend
Resend OTP to customer

**Request:**
```json
{
  "orderId": "uuid"
}
```

**Response:** `200 OK`

---

## 🔔 Notification Endpoints

### GET /notifications
Get user notifications

**Query Parameters:**
- `unreadOnly` (optional): boolean
- `page` (default: 0)
- `size` (default: 20)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "uuid",
        "type": "ORDER_CONFIRMED",
        "title": "Order Confirmed",
        "message": "Your order #ORD202604150001 has been confirmed by Mama Esi's Kitchen",
        "isRead": false,
        "createdAt": "2026-04-15T12:05:00Z",
        "order": {
          "id": "uuid",
          "orderNumber": "ORD202604150001"
        }
      }
    ],
    "unreadCount": 3,
    "totalElements": 15
  }
}
```

### PUT /notifications/{notificationId}/read
Mark notification as read

**Response:** `200 OK`

### PUT /notifications/read-all
Mark all notifications as read

**Response:** `200 OK`

---

## 🚴 Rider Endpoints

### GET /rider/deliveries
Get assigned deliveries (Rider only)

**Query Parameters:**
- `status` (optional): Filter by order status

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "orderId": "uuid",
      "orderNumber": "ORD202604150001",
      "status": "OUT_FOR_DELIVERY",
      "customerName": "Kwame Mensah",
      "customerPhone": "+233241234567",
      "deliveryAddress": "House 23, Effiduasi New Town",
      "deliveryLatitude": 6.7833,
      "deliveryLongitude": -1.4167,
      "deliveryNotes": "White gate, call when you arrive",
      "total": 55.00,
      "outForDeliveryAt": "2026-04-15T12:25:00Z",
      "mapsUrl": "https://maps.google.com/?q=6.7833,-1.4167"
    }
  ]
}
```

### PUT /rider/availability
Update rider availability status

**Request:**
```json
{
  "isAvailable": true,
  "latitude": 6.7833,
  "longitude": -1.4167
}
```

**Response:** `200 OK`

### GET /rider/availability
Get current availability status

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "isAvailable": true,
    "currentLatitude": 6.7833,
    "currentLongitude": -1.4167,
    "lastLocationUpdate": "2026-04-15T12:00:00Z"
  }
}
```

---

## 📊 Analytics Endpoints (Admin)

### GET /analytics/orders/summary
Get order statistics

**Query Parameters:**
- `startDate` (optional)
- `endDate` (optional)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalOrders": 150,
    "pendingOrders": 5,
    "confirmedOrders": 3,
    "outForDeliveryOrders": 2,
    "deliveredOrders": 140,
    "cancelledOrders": 0,
    "totalRevenue": 8250.00,
    "averageOrderValue": 55.00
  }
}
```

---

## 🌍 Location Endpoints

### POST /location/geocode
Convert address to coordinates

**Request:**
```json
{
  "address": "Effiduasi Market Street, Ghana"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "address": "Effiduasi Market Street, Ghana",
    "latitude": 6.7833,
    "longitude": -1.4167,
    "formattedAddress": "Market St, Effiduasi, Ghana"
  }
}
```

### POST /location/reverse-geocode
Convert coordinates to address

**Request:**
```json
{
  "latitude": 6.7833,
  "longitude": -1.4167
}
```

**Response:** `200 OK`

---

## 📱 Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE",
  "timestamp": "2026-04-15T12:00:00Z",
  "path": "/api/v1/orders"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `422` - Unprocessable Entity (business logic error)
- `500` - Internal Server Error

### Common Error Codes
- `AUTH_001` - Invalid credentials
- `AUTH_002` - Token expired
- `AUTH_003` - Insufficient permissions
- `ORDER_001` - Order not found
- `ORDER_002` - Invalid order status transition
- `ORDER_003` - Cannot modify completed order
- `OTP_001` - Invalid OTP code
- `OTP_002` - OTP expired
- `OTP_003` - Maximum attempts exceeded
- `PRODUCT_001` - Product not available
- `VENDOR_001` - Vendor is closed

---

## 🔄 Webhook Events (Future)

For SMS delivery status callbacks from Hubtel:

### POST /webhooks/sms/status
Receive SMS delivery status

**Request:**
```json
{
  "messageId": "msg_123",
  "status": "delivered",
  "phoneNumber": "+233241234567",
  "timestamp": "2026-04-15T12:00:00Z"
}
```

---

## 📝 Notes

1. **Pagination**: All list endpoints support pagination with `page` and `size` parameters
2. **Timestamps**: All timestamps are in ISO 8601 format (UTC)
3. **Phone Numbers**: Must be in E.164 format (+233XXXXXXXXX)
4. **Prices**: All prices are in GHS (Ghana Cedis) with 2 decimal places
5. **Rate Limiting**: 100 requests per minute per user
6. **API Versioning**: Version is included in URL path (/v1/)

## 🔒 Security

- All endpoints use HTTPS in production
- JWT tokens expire after 24 hours
- Passwords are hashed using BCrypt (strength 12)
- OTP codes expire after 30 minutes
- Maximum 3 OTP verification attempts
- CORS enabled for approved domains only
