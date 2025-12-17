import { Membership, MembershipType, User } from './types'

export interface MembershipPricing {
  trialDays: number
  monthlyPrice: number
  lifetimePrice: number
}

export const DEFAULT_PRICING: MembershipPricing = {
  trialDays: 15,
  monthlyPrice: 9.99,
  lifetimePrice: 24.99,
}

export function createTrialMembership(): Membership {
  const startDate = Date.now()
  const endDate = startDate + (15 * 24 * 60 * 60 * 1000)
  
  return {
    type: 'trial',
    startDate,
    endDate,
    isActive: true,
  }
}

export function createMonthlyMembership(): Membership {
  const startDate = Date.now()
  const endDate = startDate + (30 * 24 * 60 * 60 * 1000)
  
  return {
    type: 'monthly',
    startDate,
    endDate,
    isActive: true,
  }
}

export function createLifetimeMembership(): Membership {
  return {
    type: 'lifetime',
    startDate: Date.now(),
    isActive: true,
  }
}

export function isMembershipActive(membership?: Membership): boolean {
  if (!membership) return false
  if (!membership.isActive) return false
  if (membership.type === 'lifetime') return true
  if (!membership.endDate) return false
  
  return Date.now() < membership.endDate
}

export function getDaysRemaining(membership?: Membership): number | null {
  if (!membership || membership.type === 'lifetime') return null
  if (!membership.endDate) return null
  
  const msRemaining = membership.endDate - Date.now()
  const daysRemaining = Math.ceil(msRemaining / (24 * 60 * 60 * 1000))
  
  return Math.max(0, daysRemaining)
}

export function getMembershipLabel(type: MembershipType): string {
  switch (type) {
    case 'trial':
      return 'Prueba Gratuita'
    case 'monthly':
      return 'Mensual'
    case 'lifetime':
      return 'Vitalicia'
  }
}
