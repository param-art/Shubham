<!-- Shubham Garments Business Management System - Custom Instructions -->

This project is a comprehensive full-stack business management platform for Shubham Garments featuring:

## Project Overview
- **Frontend**: React 18 with Vite, featuring black and neon green theme
- **Backend**: Node.js/Express with MongoDB
- **Database**: MongoDB for persistent data storage
- **Key Features**: Sales tracking, expense management, purchase reports, comprehensive analytics

## Architecture
- **Client**: React SPA with Vite bundler
- **Server**: Express REST API with MongoDB integration
- **Database**: MongoDB with Mongoose ODM

## Development Workflow

### Backend Development
- Server files in `/server` directory
- Models in `/server/models` for data schemas
- Controllers in `/server/controllers` for business logic
- Routes in `/server/routes` for API endpoints
- Start with: `cd server && npm run dev`

### Frontend Development
- React components in `/client/src/components`
- Pages in `/client/src/pages`
- Styling in `/client/src/styles` with CSS
- API utilities in `/client/src/utils/api.js`
- Start with: `cd client && npm run dev`

## Key Coding Standards

### Backend (Node.js/Express)
- Use async/await for database operations
- Implement error handling in all controllers
- Validate input data before processing
- Use Mongoose models for MongoDB operations
- Follow RESTful API conventions

### Frontend (React)
- Use functional components with hooks
- Implement proper error handling with try/catch
- Use axios for API calls via utility functions
- Apply consistent CSS classes with BEM naming
- Maintain responsive design

## Color Scheme (Black & Neon Green)
- Primary Background: #1a1a1a
- Secondary Background: #2d2d2d
- Neon Green (Primary): #39ff14
- Neon Green (Light): #7eff7e
- Text Primary: #ffffff
- Text Secondary: #b0b0b0

## API Routes Structure

### Sales
- `POST /api/sales` - Add sale
- `GET /api/sales` - Get sales by date range
- `GET /api/sales/daily-report` - Daily report
- `GET /api/sales/monthly-report` - Monthly report

### Expenses
- `POST /api/expenses` - Add expense
- `GET /api/expenses` - Get expenses
- `GET /api/expenses/daily-report` - Daily report
- `GET /api/expenses/monthly-report` - Monthly report

### Purchases
- `POST /api/purchases` - Add purchase
- `GET /api/purchases` - Get purchases
- `GET /api/purchases/daily-report` - Daily report
- `GET /api/purchases/monthly-report` - Monthly report

### Reports
- `GET /api/reports/comprehensive` - Full monthly report
- `GET /api/reports/dashboard` - Dashboard data

## Database Requirements
- MongoDB instance running (local or Atlas)
- Connection string in `.env` file
- Collections auto-created via Mongoose schemas

## Testing Checklist Before Deployment
- [ ] All API endpoints functioning
- [ ] Date filtering works correctly
- [ ] Charts render without errors
- [ ] Forms validate input properly
- [ ] Reports generate accurately
- [ ] Responsive design on mobile
- [ ] All CRUD operations working
- [ ] No console errors in browser
- [ ] Database properly indexed

## Performance Considerations
- Implement pagination for large datasets
- Add database indexes on frequently queried fields
- Cache frequently accessed data
- Optimize image sizes and assets
- Minimize CSS/JS bundle sizes
- Lazy load components where appropriate

## Security Notes
- Never commit `.env` files
- Validate all user inputs
- Use parameterized database queries
- Implement rate limiting for APIs
- Add CORS restrictions in production
- Use HTTPS in production
- Sanitize HTML content

## Common Commands

### Backend
```bash
cd server
npm install          # Install dependencies
npm run dev         # Start development server
npm start           # Start production server
```

### Frontend
```bash
cd client
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure database name matches

### API Errors
- Check server console for error logs
- Verify request body format
- Confirm API endpoint paths
- Check CORS configuration

### Frontend Issues
- Clear browser cache
- Check console for errors
- Verify API endpoint in `.env`
- Ensure backend is running

## Future Enhancements
- User authentication and roles
- Advanced search and filters
- Email/SMS notifications
- Batch import/export functionality
- Mobile app version
- Real-time notifications
- Multi-user support with access control
- Backup and recovery system
