"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface MascotProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "happy" | "thinking" | "success" | "empty";
  className?: string;
  animated?: boolean;
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

export function Mascot({
  size = "md",
  variant = "default",
  className,
  animated = false,
}: MascotProps) {
  const pixelSize = sizeMap[size];

  // Animation-Klassen basierend auf Variante
  const animationClass = cn({
    "animate-bounce": variant === "success" && animated,
    "animate-pulse": variant === "thinking" && animated,
    "animate-[wiggle_1s_ease-in-out_infinite]": variant === "happy" && animated,
    "opacity-60": variant === "empty",
  });

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center",
        "transition-all duration-300",
        animationClass,
        className
      )}
    >
      <Image
        src="/logo.png"
        alt="AzuBite Maskottchen"
        width={pixelSize}
        height={pixelSize}
        className={cn(
          "object-contain",
          variant === "empty" && "grayscale opacity-50",
          variant === "success" && "drop-shadow-lg"
        )}
        priority={size === "xl"}
      />
    </div>
  );
}

// Spezielle Varianten für verschiedene Kontexte
export function EmptyStateMascot({ 
  message, 
  action 
}: { 
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Mascot size="lg" variant="empty" className="mb-4" />
      <p className="text-gray-500 text-center max-w-md mb-4">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function SuccessMascot({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <Mascot size="md" variant="success" animated className="mb-2" />
      {message && <p className="text-sm text-gray-600 text-center">{message}</p>}
    </div>
  );
}

export function TooltipMascot({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
      <Mascot size="sm" variant="thinking" animated className="flex-shrink-0 mt-0.5" />
      <div className="flex-1 text-sm text-gray-700">{children}</div>
    </div>
  );
}

