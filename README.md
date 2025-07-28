# Fleet Management Module

A comprehensive fleet management module built with Vue 3, Nuxt 3, and Vuetify 3, designed to be integrated into an existing ISP Inventory System.

## Features

### 1. Vehicle Management
- Add/edit vehicle records with fields:
  - License Plate (unique)
  - Brand/Model
  - Assigned Fuel Card ID
  - Service Interval (km)
- Vehicle list view with current mileage and last service date

### 2. Mileage Tracking
- Manual entry of vehicle mileage (Date, Kilometers)
- Auto-calculation of monthly mileage
- Alert system for service intervals

### 3. Fuel Management
- Manual entry of refueling:
  - Date
  - Quantity (liters)
  - Amount (ETB)
  - Odometer Reading
- Fuel Card tracking:
  - Total Value Issued
  - Amount Spent
  - Remaining Balance
- Low balance alerts (below 20%)

### 4. Efficiency & Anomaly Detection
- Fuel efficiency calculation (km/l)
- Anomaly detection:
  - Sudden fuel consumption changes
  - Mileage without refueling
  - Refueling without mileage change

### 5. Reporting
- Monthly Vehicle Report
  - Total kilometers
  - Fuel consumption
  - Efficiency metrics
- Fuel Card Balance Report
- Refill History Report
- Service Due Report

### 6. Notifications
- Dashboard alerts for:
  - Service due
  - Low fuel card balance
  - Data inconsistencies

### 7. User Interface
- Clean, responsive design using Vuetify components
- Exportable tables (CSV/Excel)
- Admin-friendly interface

## User Roles

1. Inventory Admin
   - Full access to all features
   - Can manage vehicles, fuel cards, and records
   - Can generate and export reports

2. Inventory Manager
   - View access to all data
   - Can audit records
   - Receives alerts and notifications

## Technical Stack

- Vue 3
- Nuxt 3
- Vuetify 3
- TypeScript
- Chart.js for data visualization

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
├── components/         # Reusable Vue components
├── composables/        # Vue composables for data management
├── layouts/           # Page layouts
├── pages/             # Application pages
├── plugins/           # Vue plugins
├── types/             # TypeScript type definitions
└── public/            # Static assets
```

## API Integration

The module is designed to be integrated with an existing backend API. The following endpoints are expected:

- `/api/vehicles` - Vehicle management
- `/api/fuel-records` - Fuel record management
- `/api/fuel-cards` - Fuel card management
- `/api/reports` - Report generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
