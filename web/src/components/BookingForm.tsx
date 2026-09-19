"use client";

import { useState } from "react";
import { createBooking } from "@/app/trajets/[id]/actions";

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

  return (
    <form action={boundAction} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-muted">
          Nombre de places
        </label>
        <select
          name="seats"
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 outline-none focus:border-brand"
        >
          {Array.from({ length: seatsAvailable }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} place{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-surface-2 px-4 py-3">
        <span className="text-sm text-muted">Total à payer</span>
        <span className="text-xl font-extrabold text-brand">
          {(seats * pricePerSeat).toLocaleString("fr-FR")} FCFA
        </span>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-brand px-4 py-3 font-bold text-brand-foreground hover:opacity-90"
      >
        Réserver et payer
      </button>
    </form>
  );
}
