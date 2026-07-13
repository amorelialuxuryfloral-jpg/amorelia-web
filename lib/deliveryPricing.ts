/**
 * Amorelia delivery cost based on miles.
 * 0-10 miles: $30 flat
 * 10-90 miles: $30 + $1.60 per mile over 10
 */
export function calculateDeliveryCost(miles: number): number {
  if (miles <= 0) return 0;
  if (miles <= 10) return 30;
  return Math.round((30 + (miles - 10) * 1.60) * 100) / 100;
}

/**
 * Calculate delivery cost for Room Decors.
 * 0-10 miles: FREE (included)
 * 10+ miles: $1.60 per mile over 10
 */
export function calculateRoomDecorDeliveryCost(miles: number): number {
  if (miles <= 10) return 0;
  return Math.round(((miles - 10) * 1.60) * 100) / 100;
}

/** Format delivery cost for display */
export function formatDeliveryCost(cost: number): string {
  return cost % 1 === 0 ? `$${cost}` : `$${cost.toFixed(2)}`;
}
