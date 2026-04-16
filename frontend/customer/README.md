# FoodHub Customer App

React application for customers to browse menu, place orders, and track deliveries.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
# Create .env file
cp .env.example .env

# Edit with your values
VITE_API_URL=http://localhost:8080/api/v1
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

3. **Run development server**
```bash
npm run dev
```

4. **Open browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── MenuCard.jsx
│   ├── OrderStatusTimeline.jsx
│   ├── LocationPicker.jsx
│   ├── NotificationPanel.jsx
│   └── CartSummary.jsx
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── OrderStatus.jsx
│   └── Login.jsx
├── context/            # React context
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── NotificationContext.jsx
├── services/           # API services
│   ├── api.js
│   ├── authService.js
│   ├── orderService.js
│   └── menuService.js
├── hooks/              # Custom hooks
│   ├── useAuth.js
│   ├── useCart.js
│   └── useNotifications.js
├── utils/              # Utility functions
│   ├── formatters.js
│   └── validators.js
├── styles/             # Global styles
│   └── index.css
└── App.jsx             # Root component
```

## 🎨 Styling

Using Tailwind CSS with custom design system:

```jsx
// Primary button
<button className="btn btn-primary">
  Place Order
</button>

// Card
<div className="card card-hover">
  Content
</div>

// Input
<input className="input" />
```

See [UI_UX_DESIGN_SYSTEM.md](../../docs/UI_UX_DESIGN_SYSTEM.md) for complete design system.

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Build
npm run build            # Build for production
npm run preview          # Preview production build

# Linting
npm run lint             # Run ESLint
```

## 📱 Key Features

### 1. Menu Browsing
- View all menu items
- Filter by category
- Search products
- View product details

### 2. Cart Management
- Add/remove items
- Update quantities
- Add special instructions
- View order summary

### 3. Checkout
- Select delivery location (map)
- Enter delivery notes
- Confirm phone number
- Place order

### 4. Order Tracking
- Real-time status updates
- Timeline visualization
- Delivery details
- OTP instructions

### 5. Notifications
- In-app notification panel
- Order status updates
- Unread count badge

## 🗺️ Google Maps Integration

```jsx
import LocationPicker from './components/LocationPicker';

<LocationPicker
  onLocationSelect={(location) => {
    console.log(location.latitude, location.longitude, location.address);
  }}
  initialLocation={{ lat: 6.7833, lng: -1.4167 }}
/>
```

## 🔐 Authentication

```jsx
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  const handleLogin = async () => {
    await login(phoneNumber, password);
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.fullName}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

## 🛒 Cart Management

```jsx
import { useCart } from './hooks/useCart';

function MenuCard({ product }) {
  const { addItem, items } = useCart();
  
  const handleAdd = () => {
    addItem(product);
  };
  
  return (
    <button onClick={handleAdd}>
      Add to Cart ({items.length})
    </button>
  );
}
```

## 📡 API Integration

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## 🎯 Environment Variables

```bash
# API
VITE_API_URL=http://localhost:8080/api/v1

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_key_here

# Optional
VITE_APP_NAME=FoodHub
VITE_APP_VERSION=1.0.0
```

## 🧪 Testing

```bash
# Unit tests (future)
npm run test

# E2E tests (future)
npm run test:e2e
```

## 📦 Building for Production

```bash
# Build
npm run build

# Output in dist/
ls dist/

# Preview build
npm run preview
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Manual Deployment

```bash
# Build
npm run build

# Upload dist/ folder to your hosting
# Configure:
# - Build command: npm run build
# - Output directory: dist
# - Node version: 18
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#FF6B35', // Change brand color
      },
    },
  },
}
```

### Logo
Replace `public/logo.svg` with your logo.

### Vendor Info
Update vendor details in API or hardcode in `src/config.js`.

## 🐛 Troubleshooting

### Maps not loading
```bash
# Check API key is set
echo $VITE_GOOGLE_MAPS_API_KEY

# Verify key restrictions in Google Cloud Console
# Add your domain to allowed referrers
```

### API connection failed
```bash
# Check backend is running
curl http://localhost:8080/api/v1/actuator/health

# Verify CORS is configured
# Check CORS_ORIGINS in backend includes http://localhost:3000
```

### Build errors
```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

## 📱 Progressive Web App (PWA)

To enable PWA features:

```bash
# Install plugin
npm install vite-plugin-pwa -D

# Configure in vite.config.js
import { VitePWA } from 'vite-plugin-pwa';

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'FoodHub',
        short_name: 'FoodHub',
        theme_color: '#FF6B35',
      },
    }),
  ],
};
```

## 📞 Support

- Technical issues: tech@foodhub.gh
- UI/UX questions: See [UI_UX_DESIGN_SYSTEM.md](../../docs/UI_UX_DESIGN_SYSTEM.md)
- API documentation: See [API_SPECIFICATION.md](../../docs/API_SPECIFICATION.md)
