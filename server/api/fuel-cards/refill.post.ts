import { defineEventHandler, readBody } from 'h3'

interface RefillRequest {
  cardId: string
  amount: number
  notes?: string
}

interface FuelCard {
  id: string
  cardNumber: string
  cardHolder: string
  totalValueIssued: number
  amountSpent: number
  remainingBalance: number
  status: string
  lowBalanceThreshold: number
  isLowBalance: boolean
  lastTransactionDate: string
  createdAt: string
  updatedAt: string
}

// Mock fuel cards data (in a real app, this would come from a database)
const fuelCards: FuelCard[] = [
  {
    id: 'CARD-001',
    cardNumber: '1234-5678-9012-3456',
    cardHolder: 'John Doe',
    totalValueIssued: 10000,
    amountSpent: 4750,
    remainingBalance: 5250,
    status: 'Active',
    lowBalanceThreshold: 2000,
    isLowBalance: false,
    lastTransactionDate: '2024-06-05',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-05T14:30:00Z'
  },
  {
    id: 'CARD-002',
    cardNumber: '2345-6789-0123-4567',
    cardHolder: 'Jane Smith',
    totalValueIssued: 8000,
    amountSpent: 3000,
    remainingBalance: 5000,
    status: 'Active',
    lowBalanceThreshold: 1600,
    isLowBalance: false,
    lastTransactionDate: '2024-06-02',
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2024-06-02T11:00:00Z'
  },
  {
    id: 'CARD-003',
    cardNumber: '3456-7890-1234-5678',
    cardHolder: 'Mike Johnson',
    totalValueIssued: 12000,
    amountSpent: 2750,
    remainingBalance: 9250,
    status: 'Active',
    lowBalanceThreshold: 2400,
    isLowBalance: false,
    lastTransactionDate: '2024-06-03',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-06-03T09:15:00Z'
  },
  {
    id: 'CARD-004',
    cardNumber: '4567-8901-2345-6789',
    cardHolder: 'Sarah Wilson',
    totalValueIssued: 6000,
    amountSpent: 5200,
    remainingBalance: 800,
    status: 'Active',
    lowBalanceThreshold: 1200,
    isLowBalance: true,
    lastTransactionDate: '2024-06-04',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-06-04T16:45:00Z'
  }
]

export default defineEventHandler(async (event) => {
  try {
    const body: RefillRequest = await readBody(event)
    const { cardId, amount, notes } = body

    // Validate input
    if (!cardId || !amount || amount <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid input: cardId and amount are required, amount must be positive'
      })
    }

    if (amount > 50000) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Maximum refill amount is 50,000 ETB'
      })
    }

    // Find the card
    const cardIndex = fuelCards.findIndex(card => card.id === cardId)
    if (cardIndex === -1) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Fuel card not found'
      })
    }

    const card = fuelCards[cardIndex]

    // Check if card is active
    if (card.status !== 'Active') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot refill inactive card'
      })
    }

    // Update card balance
    const newBalance = card.remainingBalance + amount
    const newTotalValueIssued = card.totalValueIssued + amount
    const now = new Date().toISOString()

    // Update the card
    fuelCards[cardIndex] = {
      ...card,
      remainingBalance: newBalance,
      totalValueIssued: newTotalValueIssued,
      lastTransactionDate: now,
      updatedAt: now,
      isLowBalance: newBalance <= card.lowBalanceThreshold
    }

    // Create fuel record entry (in a real app, this would be saved to database)
    const fuelRecord = {
      id: `FR-${Date.now()}`,
      cardId: cardId,
      amount: amount,
      type: 'refill',
      notes: notes || '',
      date: now,
      createdAt: now
    }

    return {
      success: true,
      message: `Card refilled successfully with ${amount.toLocaleString()} ETB`,
      data: {
        card: fuelCards[cardIndex],
        fuelRecord: fuelRecord
      }
    }

  } catch (error) {
    console.error('Error processing refill:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
}) 