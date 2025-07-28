import { defineEventHandler } from 'h3'

export default defineEventHandler(() => [
  {
    id: 'MR-001',
    vehicleId: 'FL-001-ABC',
    licensePlate: 'ABC-123-ET',
    date: '2024-06-01',
    odometerReading: 44500,
    previousReading: 44000,
    distanceTraveled: 500, // km
    driver: 'John Doe',
    notes: 'Daily route completed',
    createdAt: '2024-06-01T18:00:00Z'
  },
  {
    id: 'MR-002',
    vehicleId: 'FL-002-DEF',
    licensePlate: 'DEF-456-ET',
    date: '2024-06-02',
    odometerReading: 32000,
    previousReading: 31800,
    distanceTraveled: 200, // km
    driver: 'Jane Smith',
    notes: 'Delivery route',
    createdAt: '2024-06-02T17:30:00Z'
  },
  {
    id: 'MR-003',
    vehicleId: 'FL-001-ABC',
    licensePlate: 'ABC-123-ET',
    date: '2024-06-05',
    odometerReading: 45100,
    previousReading: 44500,
    distanceTraveled: 600, // km
    driver: 'John Doe',
    notes: 'Weekly maintenance check',
    createdAt: '2024-06-05T16:00:00Z'
  },
  {
    id: 'MR-004',
    vehicleId: 'FL-003-GHI',
    licensePlate: 'GHI-789-ET',
    date: '2024-06-03',
    odometerReading: 19000,
    previousReading: 18800,
    distanceTraveled: 200, // km
    driver: 'Mike Johnson',
    notes: 'Client visit',
    createdAt: '2024-06-03T15:45:00Z'
  }
]) 