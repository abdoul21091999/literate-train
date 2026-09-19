"use client";

import { useState } from "react";
import { Users, CreditCard } from "lucide-react";
import { createBooking } from "@/app/trajets/[id]/actions";
import { computeBookingTotal } from "@/lib/pricing";

export default function BookingForm({
  trajetId,
  pricePerSeat,
  seatsAvailable,
}: {
  trajetId: string;
  pricePerSeat: number;
  seatsAvailable: number;
}) {
  const [seats, setSeats] = useState(1);
  const boundAction = createBooking.bind(null, trajetId);
  const { rideTotal, serviceFee, total } = computeBookingTotal(pricePerSeat, seats);

  return (
    <form action={boundAction} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-muted">
          Nombre de places
        </label>
        <div className="relative">
          <Users
            size={16}
            strokeWidth={2.25}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <select
            name="seats"
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="w-full appearance-none rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-3 outline-none transition-colors focus:border-brand"
          >
            {Array.from({ length: seatsAvailable }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} place{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5 rounded-lg bg-surface-2 px-4 py-3">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>Prix du trajet</span>
          <span>{rideTotal.toLocaleString("fr-FR")} FCFA</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted">
          <span>Frais de service</span>
          <span>{serviceFee.toLocaleString("fr-FR")} FCFA</span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-1.5">
          <span className="text-sm font-medium">Total à payer</span>
          <span className="text-xl font-extrabold text-brand">
            {total.toLocaleString("fr-FR")} FCFA
          </span>
        </div>
      </div>

      <button
        type="submit"
        className="btn-brand flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-bold"
      >
        <CreditCard size={16} strokeWidth={2.25} />
        Réserver et payer
      </button>
    </form>
  );
}
