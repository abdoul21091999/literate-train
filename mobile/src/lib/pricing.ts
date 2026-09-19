// Flat service fee (FCFA) charged once per booking, on top of the ride
// price — mirrors web/src/lib/pricing.ts, keep both in sync.
export const SERVICE_FEE = 300;

export function computeBookingTotal(pricePerSeat: number, seats: number) {
  const rideTotal = pricePerSeat * seats;
  return {
    rideTotal,
    serviceFee: SERVICE_FEE,
    total: rideTotal + SERVICE_FEE,
  };
}
