/**
 * Veterinarian color assignment utility
 * Provides consistent color mapping for veterinarians based on their ID
 * Uses a deterministic modulo-based approach for consistency across all events
 */

const VET_COLORS = [
  '#2c8a59', // primary
  '#7dd89f', // primary-light
  '#0f3d25', // primary-dark
  '#a8e6b8', // primary-lighter
  '#198754', // success
  '#4d9e6a', // shade 1
  '#5ba877', // shade 2
]

/**
 * Get a consistent color for a veterinarian based on their ID
 * Same vetId will always return the same color
 * @param vetId - The veterinarian's ID
 * @returns Hex color string
 */
export function getVeterinarianColor(vetId: number): string {
  return VET_COLORS[vetId % VET_COLORS.length]
}
