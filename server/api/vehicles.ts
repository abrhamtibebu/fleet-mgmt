import { defineEventHandler } from 'h3'

export default defineEventHandler(() => [
  {
    id: 'FL-001-ABC',
    licensePlate: 'ABC-123-ET',
    brand: 'Toyota',
    model: 'Hilux',
    year: 2022,
    status: 'active',
    currentMileage: 45000,
    lastServiceMileage: 40000,
    lastServiceDate: '2024-01-15',
    nextServiceMileage: 50000,
    serviceInterval: 10000,
    fuelCardId: 'CARD-001',
    assignedDriver: 'John Doe',
    location: 'Addis Ababa',
    fuelEfficiency: 12.5, // km/l
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z'
  },
  {
    id: 'FL-002-DEF',
    licensePlate: 'DEF-456-ET',
    brand: 'Isuzu',
    model: 'NPR',
    year: 2021,
    status: 'maintenance',
    currentMileage: 32500,
    lastServiceMileage: 25000,
    lastServiceDate: '2023-12-15',
    nextServiceMileage: 35000,
    serviceInterval: 10000,
    fuelCardId: 'CARD-002',
    assignedDriver: 'Jane Smith',
    location: 'Bole',
    fuelEfficiency: 10.2, // km/l
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2024-05-15T00:00:00Z'
  },
  {
    id: 'FL-003-GHI',
    licensePlate: 'GHI-789-ET',
    brand: 'Ford',
    model: 'Ranger',
    year: 2023,
    status: 'active',
    currentMileage: 18500,
    lastServiceMileage: 15000,
    lastServiceDate: '2024-03-20',
    nextServiceMileage: 25000,
    serviceInterval: 10000,
    fuelCardId: 'CARD-003',
    assignedDriver: 'Mike Johnson',
    location: 'Addis Ababa',
    fuelEfficiency: 11.8, // km/l
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z'
  }
]) 