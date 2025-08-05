export interface Vehicle {
  id: string
  licensePlate: string
  brandModel: string
  fuelCardId: string
  serviceInterval: number
  currentMileage: number
  lastServiceDate: string
  createdAt: string
  updatedAt: string
}

export interface MileageRecord {
  id: string
  vehicleId: string
  date: string
  kilometers: number
  createdAt: string
}

export interface FuelRecord {
  id: string
  vehicleId: string
  date: string
  quantity: number
  amount: number
  odometerReading: number
  createdAt: string
}

export interface FuelCard {
  id: string
  cardNumber: string
  totalValue: number
  amountSpent: number
  remainingBalance: number
  expiryDate: string
  assignedToVehicleId?: string
  issuedBy: string
  notes?: string
  lastUpdated: string
  createdAt: string
}

export interface ServiceAlert {
  id: string
  vehicleId: string
  type: 'SERVICE_DUE' | 'LOW_FUEL_BALANCE' | 'ANOMALY'
  message: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: string
  resolvedAt?: string
}

export interface MonthlyReport {
  vehicleId: string
  month: string
  totalKilometers: number
  totalFuelUsed: number
  averageEfficiency: number
  totalCost: number
} 