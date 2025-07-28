import { defineEventHandler } from 'h3'

export default defineEventHandler(() => [
  {
    id: 'AN-001',
    vehicleId: 'FL-001-ABC',
    licensePlate: 'ABC-123-ET',
    type: 'fuel_consumption_spike',
    severity: 'medium',
    description: 'Fuel consumption increased by 25% compared to average',
    details: {
      averageEfficiency: 12.5,
      currentEfficiency: 9.8,
      changePercentage: 25.2
    },
    detectedAt: '2024-06-05T14:30:00Z',
    status: 'open',
    resolvedAt: null
  },
  {
    id: 'AN-002',
    vehicleId: 'FL-002-DEF',
    licensePlate: 'DEF-456-ET',
    type: 'service_overdue',
    severity: 'high',
    description: 'Vehicle has exceeded service interval by 2,500 km',
    details: {
      currentMileage: 32500,
      lastServiceMileage: 25000,
      serviceInterval: 10000,
      overdueBy: 2500
    },
    detectedAt: '2024-06-01T09:00:00Z',
    status: 'open',
    resolvedAt: null
  },
  {
    id: 'AN-003',
    vehicleId: 'FL-004-JKL',
    licensePlate: 'JKL-012-ET',
    type: 'mileage_without_refuel',
    severity: 'low',
    description: 'Vehicle traveled 800 km without refueling',
    details: {
      distanceTraveled: 800,
      lastRefuelDate: '2024-05-28',
      currentDate: '2024-06-05'
    },
    detectedAt: '2024-06-05T16:00:00Z',
    status: 'open',
    resolvedAt: null
  },
  {
    id: 'AN-004',
    vehicleId: 'CARD-004',
    cardNumber: '4567-8901-2345-6789',
    type: 'low_fuel_card_balance',
    severity: 'medium',
    description: 'Fuel card balance below 20% threshold',
    details: {
      remainingBalance: 800,
      totalValue: 6000,
      threshold: 1200,
      percentageRemaining: 13.3
    },
    detectedAt: '2024-06-04T16:45:00Z',
    status: 'open',
    resolvedAt: null
  }
]) 