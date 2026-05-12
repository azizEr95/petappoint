/**
 * Maps calculated age in months to original approximate age range string.
 * Used when animal was created with approximate age instead of exact birthdate.
 */
export function mapMonthsToAgeRange(months: number): string {
  if (months < 6) return 'jünger 6 Monate'
  if (months <= 24) return '6-24 Monate'
  if (months <= 48) return '2-4 Jahre'
  if (months <= 72) return '4-6 Jahre'
  if (months <= 96) return '6-8 Jahre'
  if (months <= 120) return '8-10 Jahre'
  if (months <= 180) return '10-15 Jahre'
  return 'älter 15 Jahre'
}
