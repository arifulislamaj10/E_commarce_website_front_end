/** Format a number as Bangladeshi Taka. */
export function bdt(amount) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}
