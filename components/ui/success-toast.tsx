"use client";

import { useEffect } from "react";
import { Mascot } from "./mascot";

// Custom Toast Component für Erfolgsmeldungen mit Maskottchen
export function SuccessToastWithMascot({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3">
      <Mascot size="sm" variant="success" animated />
      <span>{message}</span>
    </div>
  );
}

