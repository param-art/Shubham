# 🚀 Quick Start Guide - Shubham Garments Management System

## One-Time Setup

### 1. Install MongoDB (if not already installed)
Download from: https://www.mongodb.com/try/download/community

### 2. Backend Setup
```bash
cd server
npm install
```

### 3. Frontend Setup
```bash
cd client
npm install
```

## Running the Application

### Terminal 1 - Start MongoDB
```bash
# On Windows
mongod

# On Mac/Linux
brew services start mongodb-community
# or
mongo
```

### Terminal 2 - Start Backend Server
```bash
cd server
npm run dev
```
**Backend running on:** `http://localhost:5000`

### Terminal 3 - Start Frontend Server
```bash
cd client
npm run dev
```
**Frontend running on:** `http://localhost:3000`

## Access the Application
Open your browser and go to: `http://localhost:3000`

## First Steps After Login
1. **Go to Dashboard** - Overview of your business metrics
2. **Add a Sale** - Record your first transaction
3. **Add Expenses** - Track your daily/other expenses
4. **Add Purchases** - Record supplier purchases
5. **View Reports** - Analyze monthly performance

## Key Features

### 📊 Dashboard
- Real-time financial overview
- Sales trends graph
- Profit/Loss analysis
- Transaction count

### 💰 Sales Management
- Record daily sales
- Split cash and online sales
- Date-based search
- Daily sales reports

### 💸 Expense Management
- Daily expenses tracking
- Categorized other expenses
- Automatic calculations
- Monthly reports

### 📦 Purchase Management
- Record purchases with supplier details
- Track invoice numbers
- Payment method recording
- Supplier analysis

### 📈 Reports
- Monthly financial reports
- Profit & Loss analysis
- Revenue vs Expenses charts
- Financial metrics and KPIs

## File Structure Reference

```
website/
├── server/           # Backend (Node.js/Express)
│   ├── models/       # Database schemas
│   ├── controllers/  # Business logic
│   ├── routes/       # API endpoints
│   └── server.js     # Main server file
├── client/           # Frontend (React)
│   ├── src/
│   │   ├── pages/    # Main pages
│   │   ├── components/ # Reusable components
│   │   └── utils/    # Helper functions
│   └── index.html
└── README.md         # Full documentation
```

## Important Configuration Files

### Backend
- `.env` - Environment variables (MongoDB, Port, etc.)
- `server/package.json` - Dependencies

### Frontend
- `client/vite.config.js` - Vite configuration
- `client/package.json` - Dependencies

## Troubleshooting

### Port Already in Use
```bash
# Change port in server/.env
PORT=5001

# Or change frontend port in vite.config.js
port: 3001
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `server/.env`
- Default: `mongodb://localhost:27017/shubham_garments`

### API Calls Failing
- Check backend is running on port 5000
- Verify CORS is enabled
- Check browser console for errors

## Environment Variables

### Required Server (.env)
```
MONGODB_URI=mongodb://localhost:27017/shubham_garments
PORT=5000
NODE_ENV=development
```

## Building for Production

### Frontend Build
```bash
cd client
npm run build
```
Output will be in `client/dist/`

### Deploy Backend
Use services like Heroku, Railway, or Render

## Support & Documentation
See `README.md` for complete documentation and API reference

## Default Admin Credentials
Currently, the system is open. You may want to add authentication later.

---

**Happy managing! 🎉**
