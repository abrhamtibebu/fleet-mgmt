import { defineEventHandler } from 'h3'

export default defineEventHandler(() => [
  {
    id: 'FR-001',
    vehicleId: 'FL-001-ABC',
    licensePlate: 'ABC-123-ET',
    date: '2024-06-01',
    quantity: 50, // liters
    amount: 2500, // ETB
    odometerReading: 44500,
    fuelCardId: 'CARD-001',
    station: 'Total Bole',
    fuelEfficiency: 12.5, // km/l
    createdAt: '2024-06-01T10:00:00Z'
  },
  {
    id: 'FR-002',
    vehicleId: 'FL-002-DEF',
    licensePlate: 'DEF-456-ET',
    date: '2024-06-02',
    quantity: 60, // liters
    amount: 3000, // ETB
    odometerReading: 32000,
    fuelCardId: 'CARD-002',
    station: 'OilLibya Sarbet',
    fuelEfficiency: 10.2, // km/l
    createdAt: '2024-06-02T11:00:00Z'
  },
  {
    id: 'FR-003',
    vehicleId: 'FL-001-ABC',
    licensePlate: 'ABC-123-ET',
    date: '2024-06-05',
    quantity: 45, // liters
    amount: 2250, // ETB
    odometerReading: 45100,
    fuelCardId: 'CARD-001',
    station: 'Total Bole',
    fuelEfficiency: 13.3, // km/l
    createdAt: '2024-06-05T14:30:00Z'
  },
  {
    id: 'FR-004',
    vehicleId: 'FL-003-GHI',
    licensePlate: 'GHI-789-ET',
    date: '2024-06-03',
    quantity: 55, // liters
    amount: 2750, // ETB
    odometerReading: 19000,
    fuelCardId: 'CARD-003',
    station: 'Shell Addis',
    fuelEfficiency: 11.8, // km/l
    createdAt: '2024-06-03T09:15:00Z'
  }
]) 