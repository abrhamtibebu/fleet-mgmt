import { defineEventHandler } from 'h3'

export default defineEventHandler(() => [
  {
    id: 'CARD-001',
    cardNumber: '1234-5678-9012-3456',
    cardHolder: 'John Doe',
    totalValueIssued: 10000, // ETB
    amountSpent: 4750, // ETB
    remainingBalance: 5250, // ETB
    status: 'Active',
    lowBalanceThreshold: 2000, // ETB (20% of total value)
    isLowBalance: false,
    lastTransactionDate: '2024-06-05',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-05T14:30:00Z'
  },
  {
    id: 'CARD-002',
    cardNumber: '2345-6789-0123-4567',
    cardHolder: 'Jane Smith',
    totalValueIssued: 8000, // ETB
    amountSpent: 3000, // ETB
    remainingBalance: 5000, // ETB
    status: 'Active',
    lowBalanceThreshold: 1600, // ETB (20% of total value)
    isLowBalance: false,
    lastTransactionDate: '2024-06-02',
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2024-06-02T11:00:00Z'
  },
  {
    id: 'CARD-003',
    cardNumber: '3456-7890-1234-5678',
    cardHolder: 'Mike Johnson',
    totalValueIssued: 12000, // ETB
    amountSpent: 2750, // ETB
    remainingBalance: 9250, // ETB
    status: 'Active',
    lowBalanceThreshold: 2400, // ETB (20% of total value)
    isLowBalance: false,
    lastTransactionDate: '2024-06-03',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-06-03T09:15:00Z'
  },
  {
    id: 'CARD-004',
    cardNumber: '4567-8901-2345-6789',
    cardHolder: 'Sarah Wilson',
    totalValueIssued: 6000, // ETB
    amountSpent: 5200, // ETB
    remainingBalance: 800, // ETB
    status: 'Active',
    lowBalanceThreshold: 1200, // ETB (20% of total value)
    isLowBalance: true,
    lastTransactionDate: '2024-06-04',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-06-04T16:45:00Z'
  }
]) 