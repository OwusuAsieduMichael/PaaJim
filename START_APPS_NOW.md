# 🚀 Start FoodHub Apps - Quick Guide

## ⚡ Super Quick Start (Recommended)

### Option 1: Automated PowerShell Scripts

**Step 1: Install all dependencies**
```powershell
.\install-all-deps.ps1
```

**Step 2: Start all apps**
```powershell
.\start-all-apps.ps1
```

That's it! All apps will open in separate windows.

---

## 📋 Manual Start (Alternative)

### Step 1: Install Dependencies

Open PowerShell and run these commands **one at a time**:

```powershell
# Customer App
cd frontend/customer
npm install
cd ../..

# Vendor App
cd frontend/vendor
npm install
cd ../..

# Rider App
cd frontend/rider
npm install
cd ../..
```

### Step 2: Start Each App

Open **3 separate PowerShell windows** and run:

**Window 1 - Customer App:**
```powershell
cd frontend/customer
npm run dev
```

**Window 2 - Vendor App:**
```powershell
cd frontend/vendor
npm run dev
```

**Window 3 - Rider App:**
```powershell
cd frontend/rider
npm run dev
```

---

## 🌐 Access Your Apps

Once started, open these URLs in your browser:

| App | URL | Description |
|-----|-----|-------------|
| 🍽️ **Customer** | http://localhost:3000 | Order food, track delivery |
| 👨‍🍳 **Vendor** | http://localhost:3001 | Accept orders |
| 🚴 **Rider** | http://localhost:3002 | Deliver orders |
| 🔧 **Backend** | http://localhost:8080 | API (already running) |

---

## ✅ What to Expect

### Customer App (Port 3000)
- Browse menu with food items
- Add items to cart
- View cart total
- Track order status

### Vendor App (Port 3001)
- View incoming orders
- Accept orders with one click
- See order details and totals

### Rider App (Port 3002)
- View active deliveries
- Call customer
- Open location in maps
- Verify delivery OTP

---

## ⏱️ First Time Setup

**npm install** may take 2-5 minutes per app depending on your internet speed.

You'll see output like:
```
added 234 packages, and audited 235 packages in 2m
```

**npm run dev** will compile and start the app. You'll see:
```
VITE v5.1.4  ready in 1234 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

---

## 🐛 Troubleshooting

### "npm is not recognized"
Install Node.js from: https://nodejs.org/

### "Port 3000 is already in use"
Kill the process:
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### npm install timeout
Increase timeout:
```powershell
npm install --timeout=60000
```

### Backend not running
Start it:
```powershell
cd backend
mvn spring-boot:run
```

---

## 📚 Need More Help?

- **Detailed Setup:** `WINDOWS_SETUP_GUIDE.md`
- **Quick Reference:** `QUICK_REFERENCE.md`
- **Complete Guide:** `FRONTEND_SETUP_COMPLETE.md`
- **Testing:** `TESTING_GUIDE.md`

---

## 🎯 Current Status

✅ Backend running on port 8080  
✅ All frontend files created  
✅ Configuration files ready  
✅ Components implemented  
⏳ **Next:** Install dependencies and start apps

---

## 💡 Pro Tips

1. **Keep all PowerShell windows open** while developing
2. **Changes auto-reload** - just save your files
3. **Check browser console** for any errors
4. **Use Ctrl+C** in PowerShell to stop an app

---

## 🎉 Ready to Go!

Choose your method:
- **Easy:** Run `.\install-all-deps.ps1` then `.\start-all-apps.ps1`
- **Manual:** Follow the "Manual Start" section above

**Let's build something amazing!** 🚀
