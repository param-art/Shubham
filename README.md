# Shubham Garments - Business Management System

A comprehensive full-stack business management platform for Shubham Garments with sales tracking, expense management, purchase reports, and advanced analytics.

## 🎨 Features

### Dashboard
- Real-time sales, expenses, and purchase overview
- Daily sales trends with interactive charts
- Profit/Loss analysis and financial metrics
- Sales breakdown by payment method (Cash vs Online)
- Transaction summaries

### Sales Management
- Record daily sales with multiple payment methods
- Track cash and online sales separately
- Date-based filtering and search
- Daily sales report generation
- Edit and delete sales records
- Visual analytics of sales trends

### Expense Tracking
- Daily expense management
- Other expenses with categorization
- Automatic total calculations
- Date filtering for expense analysis
- Monthly expense reports
- Breakdown of daily and other expenses

### Purchase Management
- Track purchases from suppliers
- Invoice number tracking
- Payment method recording
- Supplier-wise purchase analysis
- Date filtering for purchase history
- Purchase report generation

### Advanced Reports
- Monthly comprehensive financial reports
- Profit and Loss analysis
- Revenue vs Expenses vs Purchases comparison
- Sales breakdown by payment method
- Financial metrics and KPIs
- Profit margin calculation
- Cost ratio analysis

### Key Points Implemented
✅ Powerful website with high graphics
✅ Data analysis and reporting
✅ Monthly profit/loss analysis
✅ Daily sales reports (cash, online, total)
✅ Graphics and charts with Chart.js
✅ MongoDB database for all transactions
✅ Date filtering for sales and purchases
✅ Expense management with categorization
✅ Daily and other expense separation
✅ Automatic sum calculations
✅ Particular day sales reports
✅ Purchase reports with supplier names
✅ Transaction tabs for sales and purchases
✅ Professional frontend and backend architecture

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool
- **Chart.js & React-ChartJS-2** - Data visualization
- **Axios** - HTTP client
- **React Router** - Navigation
- **CSS3** - Styling with black and neon green theme

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Cors** - Cross-origin support
- **Dotenv** - Environment variables

## 📋 Project Structure

```
website/
├── server/
│   ├── models/
│   │   ├── Sale.js
│   │   ├── Expense.js
│   │   └── Purchase.js
│   ├── controllers/
│   │   ├── saleController.js
│   │   ├── expenseController.js
│   │   ├── purchaseController.js
│   │   └── reportController.js
│   ├── routes/
│   │   ├── salesRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── purchaseRoutes.js
│   │   └── reportRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── Card.jsx
    │   │   ├── Modal.jsx
    │   │   └── Table.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Sales.jsx
    │   │   ├── Expenses.jsx
    │   │   ├── Purchases.jsx
    │   │   └── Reports.jsx
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── helpers.js
    │   ├── styles/
    │   │   └── global.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or Atlas connection)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
MONGODB_URI=mongodb://localhost:27017/shubham_garments
PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Client will run on `http://localhost:3000`

## 📚 API Documentation

### Base URL: `http://localhost:5000/api`

### Sales Endpoints
- `POST /sales` - Add new sale
- `GET /sales` - Get sales by date range
- `GET /sales/id/:id` - Get specific sale
- `GET /sales/daily-report` - Get daily sales report
- `GET /sales/monthly-report` - Get monthly sales report
- `PUT /sales/:id` - Update sale
- `DELETE /sales/:id` - Delete sale

### Expenses Endpoints
- `POST /expenses` - Add new expense
- `GET /expenses` - Get expenses by date range
- `GET /expenses/daily-report` - Get daily expense report
- `GET /expenses/monthly-report` - Get monthly expense report
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense

### Purchases Endpoints
- `POST /purchases` - Add new purchase
- `GET /purchases` - Get purchases by date range
- `GET /purchases/supplier` - Get purchases by supplier
- `GET /purchases/daily-report` - Get daily purchase report
- `GET /purchases/monthly-report` - Get monthly purchase report
- `PUT /purchases/:id` - Update purchase
- `DELETE /purchases/:id` - Delete purchase

### Reports Endpoints
- `GET /reports/comprehensive` - Get comprehensive monthly report
- `GET /reports/dashboard` - Get dashboard data

## 🎨 Theme & Design

The application uses a modern dark theme with neon green accents:
- **Primary Background**: #1a1a1a
- **Secondary Background**: #2d2d2d
- **Neon Green**: #39ff14
- **Text Primary**: #ffffff
- **Text Secondary**: #b0b0b0

## 💾 Database Schema

### Sales Collection
```json
{
  "date": "Date",
  "totalSale": "Number",
  "cashSale": "Number",
  "onlineSale": "Number",
  "items": [{"name": "String", "quantity": "Number", "price": "Number"}],
  "notes": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Expenses Collection
```json
{
  "date": "Date",
  "dailyExpense": "Number",
  "otherExpenses": [{"name": "String", "amount": "Number"}],
  "totalExpense": "Number",
  "notes": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Purchases Collection
```json
{
  "date": "Date",
  "supplierName": "String",
  "totalPurchase": "Number",
  "items": [{"name": "String", "quantity": "Number", "unitPrice": "Number"}],
  "paymentMethod": "String",
  "invoiceNumber": "String",
  "notes": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 📊 Key Reports & Metrics

1. **Daily Sales Report** - Total, cash, and online sales for a specific day
2. **Monthly Sales Report** - Aggregated sales data for a month
3. **Daily Expense Report** - Daily and other expenses breakdown
4. **Monthly Expense Report** - Complete expense analysis
5. **Daily Purchase Report** - Supplier-wise purchase breakdown
6. **Monthly Purchase Report** - Comprehensive purchase analysis
7. **Comprehensive Report** - Full P&L statement with metrics
8. **Dashboard Metrics** - Real-time KPIs and trends

## 🔍 Features in Detail

### Profit Analysis
- **Gross Profit** = Total Sales - Total Purchases
- **Net Profit** = Gross Profit - Total Expenses
- **Profit Margin** = (Net Profit / Total Sales) × 100
- **Cost Ratio** = (Total Expenses / Total Sales) × 100

### Data Visualization
- Line charts for sales trends
- Bar charts for comparative analysis
- Doughnut charts for percentage breakdown
- Real-time dashboard with 7-day sales trend

### Filtering & Search
- Date-range filtering
- Monthly/Yearly report generation
- Supplier-wise filtering
- Daily transaction lookup

## 🔐 Security Considerations

For production deployment:
1. Implement user authentication
2. Add JWT token validation
3. Use environment variables for sensitive data
4. Enable HTTPS
5. Implement rate limiting
6. Add input validation and sanitization
7. Use secure password hashing

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (Below 768px)

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Push to Git repository
2. Connect to deployment platform
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy build folder
3. Set API endpoint in environment variables

## 📝 License

This project is proprietary to Shubham Garments.

## 👨‍💼 Support

For issues and feature requests, please contact the development team.

---

**Built with ❤️ for Shubham Garments Business Management**
