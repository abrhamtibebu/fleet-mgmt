import { defineEventHandler } from 'h3'

export default defineEventHandler(() => [
  {
    id: 'FR-001',
    vehicleId: 'FL-001-ABC',
    licensePlate: 'ABC-123-ET',
    date: '2024-01-15',
    quantity: 50, // liters
    amount: 2500, // ETB
    odometerReading: 44500,
    fuelCardId: 'CARD-001',
    station: 'Total Bole',
    fuelEfficiency: 12.5, // km/l
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'FR-002',
    vehicleId: 'FL-002-DEF',
    licensePlate: 'DEF-456-ET',
    date: '2024-01-20',
    quantity: 60, // liters
    amount: 3000, // ETB
    odometerReading: 32000,
    fuelCardId: 'CARD-002',
    station: 'OilLibya Sarbet',
    fuelEfficiency: 10.2, // km/l
    createdAt: '2024-01-20T11:00:00Z'
  },
  {
    id: 'FR-003',
    vehicleId: 'FL-001-ABC',
    licensePlate: 'ABC-123-ET',
    date: '2024-02-05',
    quantity: 45, // liters
    amount: 2250, // ETB
    odometerReading: 45100,
    fuelCardId: 'CARD-001',
    station: 'Total Bole',
    fuelEfficiency: 13.3, // km/l
    createdAt: '2024-02-05T14:30:00Z'
  },
  {
    id: 'FR-004',
    vehicleId: 'FL-003-GHI',
    licensePlate: 'GHI-789-ET',
    date: '2024-02-10',
    quantity: 55, // liters
    amount: 2750, // ETB
    odometerReading: 19000,
    fuelCardId: 'CARD-003',
    station: 'Shell Addis',
    fuelEfficiency: 11.8, // km/l
    createdAt: '2024-02-10T09:15:00Z'
  },
  {
    id: 'FR-005',
    vehicleId: 'FL-002-DEF',
    licensePlate: 'DEF-456-ET',
    date: '2024-03-01',
    quantity: 70, // liters
    amount: 3500, // ETB
    odometerReading: 33500,
    fuelCardId: 'CARD-002',
    station: 'OilLibya Sarbet',
    fuelEfficiency: 9.8, // km/l
    createdAt: '2024-03-01T08:30:00Z'
  },
  {
    id: 'FR-006',
    vehicleId: 'FL-001-ABC',
    licensePlate: 'ABC-123-ET',
    date: '2024-03-15',
    quantity: 40, // liters
    amount: 2000, // ETB
    odometerReading: 45800,
    fuelCardId: 'CARD-001',
    station: 'Total Bole',
    fuelEfficiency: 14.2, // km/l
    createdAt: '2024-03-15T12:00:00Z'
  },
  {
    id: 'FR-007',
    vehicleId: 'FL-003-GHI',
    licensePlate: 'GHI-789-ET',
    date: '2024-04-05',
    quantity: 65, // liters
    amount: 3250, // ETB
    odometerReading: 20500,
    fuelCardId: 'CARD-003',
    station: 'Shell Addis',
    fuelEfficiency: 11.5, // km/l
    createdAt: '2024-04-05T10:45:00Z'
  },
  {
    id: 'FR-008',
    vehicleId: 'FL-002-DEF',
    licensePlate: 'DEF-456-ET',
    date: '2024-05-10',
    quantity: 80, // liters
    amount: 4000, // ETB
    odometerReading: 35000,
    fuelCardId: 'CARD-002',
    station: 'OilLibya Sarbet',
    fuelEfficiency: 8.9, // km/l
    createdAt: '2024-05-10T14:20:00Z'
  },
  {
    id: 'FR-009',
    vehicleId: 'FL-001-ABC',
    licensePlate: 'ABC-123-ET',
    date: '2024-06-01',
    quantity: 55, // liters
    amount: 2750, // ETB
    odometerReading: 46500,
    fuelCardId: 'CARD-001',
    station: 'Total Bole',
    fuelEfficiency: 13.1, // km/l
    createdAt: '2024-06-01T09:15:00Z'
  },
  {
    id: 'FR-010',
    vehicleId: 'FL-003-GHI',
    licensePlate: 'GHI-789-ET',
    date: '2024-07-05',
    quantity: 75, // liters
    amount: 3750, // ETB
    odometerReading: 22000,
    fuelCardId: 'CARD-003',
    station: 'Shell Addis',
    fuelEfficiency: 10.8, // km/l
    createdAt: '2024-07-05T11:30:00Z'
  }
]) 