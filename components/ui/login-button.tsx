"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LoginButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  variant?: "navbar" | "page";
}

export function LoginButton({
  href,
  onClick,
  className,
  children,
  variant = "navbar",
}: LoginButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const buttonContent = (
    <div
      className={cn(
        "relative overflow-hidden group",
        variant === "navbar"
          ? "px-6 py-2.5 rounded-full"
          : "px-8 py-4 rounded-xl w-full",
        "bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500",
        "text-white font-semibold",
        "shadow-lg shadow-primary-500/50",
        "transform transition-all duration-300",
        "hover:scale-105 hover:shadow-xl hover:shadow-primary-500/60",
        "active:scale-95",
        "cursor-pointer",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Animated Background Gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-accent-500 via-primary-500 to-accent-500",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          "bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]"
        )}
        style={{
          backgroundPosition: isHovered ? "200% 0" : "0% 0",
        }}
      />

      {/* Shimmer Effect */}
      <div
        className={cn(
          "absolute inset-0 -translate-x-full group-hover:translate-x-full",
          "transition-transform duration-1000 ease-in-out",
          "bg-gradient-to-r from-transparent via-white/20 to-transparent",
          "w-1/2"
        )}
      />

      {/* Glowing Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute rounded-full bg-white/30",
              "animate-pulse",
              variant === "navbar" ? "w-1 h-1" : "w-2 h-2"
            )}
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Button Text */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
        <svg
          className={cn(
            "transition-transform duration-300",
            variant === "navbar" ? "w-4 h-4" : "w-5 h-5",
            "group-hover:translate-x-1"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </span>

      {/* Ripple Effect on Click */}
      <div className="absolute inset-0 rounded-full opacity-0 group-active:opacity-100 group-active:animate-ping bg-white/30" />
    </div>
  );

  if (href) {
    return <Link href={href}>{buttonContent}</Link>;
  }

  return buttonContent;
}

