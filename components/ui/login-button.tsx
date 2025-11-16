"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LoginButtonProps {
  href?: string;
  onClick?: (e?: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
  variant?: "navbar" | "page" | "hero";
  type?: "button" | "submit";
  disabled?: boolean;
}

export function LoginButton({
  href,
  onClick,
  className,
  children,
  variant = "navbar",
  type = "button",
  disabled = false,
}: LoginButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const buttonContent = (
    <button
      type={type}
      className={cn(
        "relative overflow-hidden group inline-flex items-center justify-center",
        // Gleiche Größe wie "Jetzt starten" Button
        variant === "hero" || variant === "page"
          ? "h-12 px-6 text-lg font-semibold rounded-md"
          : variant === "navbar"
          ? "px-6 py-2.5 rounded-full text-sm"
          : "px-8 py-4 rounded-xl w-full",
        "bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500",
        "text-white font-semibold",
        "shadow-lg shadow-primary-500/50",
        "transform transition-all duration-300",
        "hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/70",
        "active:scale-95",
        "cursor-pointer",
        "border-2 border-transparent",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Animated Background Gradient - Mehrschichtig */}
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

      {/* Rotating Gradient Overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-700"
        style={{
          background: `conic-gradient(from ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(255,255,255,0.1) 0deg, 
            rgba(59,130,246,0.3) 90deg, 
            rgba(249,115,22,0.3) 180deg, 
            rgba(255,255,255,0.1) 270deg)`,
          transform: isHovered ? `rotate(${mousePosition.x * 0.1}deg)` : "rotate(0deg)",
          transition: "transform 0.3s ease-out",
        }}
      />

      {/* Shimmer Effect - Verstärkt */}
      <div
        className={cn(
          "absolute inset-0 -translate-x-full group-hover:translate-x-full",
          "transition-transform duration-1000 ease-in-out",
          "bg-gradient-to-r from-transparent via-white/30 to-transparent",
          "w-full"
        )}
      />

      {/* Animated Border Glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-md opacity-0 group-hover:opacity-100",
          "transition-opacity duration-500",
          "border-2 border-white/50",
          "shadow-[0_0_20px_rgba(59,130,246,0.6)]"
        )}
        style={{
          boxShadow: isHovered
            ? `0 0 30px rgba(59,130,246,0.8), 0 0 60px rgba(249,115,22,0.4)`
            : "0 0 20px rgba(59,130,246,0.6)",
        }}
      />

      {/* Glowing Particles - Mehr und größer */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute rounded-full bg-white/40",
              "animate-pulse",
              variant === "navbar" ? "w-1 h-1" : "w-2.5 h-2.5"
            )}
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${1.5 + i * 0.3}s`,
              transform: isHovered ? `scale(${1.5 + Math.sin(i) * 0.5})` : "scale(1)",
              transition: "transform 0.3s ease-out",
            }}
          />
        ))}
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(2)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-white/20 to-transparent blur-sm"
            style={{
              width: `${40 + i * 20}px`,
              height: `${40 + i * 20}px`,
              left: `${30 + i * 40}%`,
              top: `${50}%`,
              transform: `translate(-50%, -50%) ${isHovered ? "scale(1.2)" : "scale(0.8)"}`,
              opacity: isHovered ? 0.6 : 0.3,
              transition: "all 0.5s ease-out",
              animation: `float ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Button Text mit starkem Kontrast */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        <span
          className={cn(
            "text-white font-semibold",
            "transition-all duration-300",
            "drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]",
            "group-hover:drop-shadow-[0_2px_8px_rgba(0,0,0,0.7),0_0_12px_rgba(255,255,255,0.3)]",
            "[text-shadow:0_1px_2px_rgba(0,0,0,0.8),0_0_8px_rgba(255,255,255,0.2)]"
          )}
        >
          {children}
        </span>
        <svg
          className={cn(
            "text-white",
            "transition-all duration-300",
            variant === "navbar" ? "w-4 h-4" : "w-5 h-5",
            "group-hover:translate-x-1 group-hover:scale-110",
            "drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]",
            "[filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.8))]"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </span>

      {/* Multiple Ripple Effects on Click */}
      <div className="absolute inset-0 rounded-md opacity-0 group-active:opacity-100 group-active:animate-ping bg-white/40" />
      <div
        className="absolute inset-0 rounded-md opacity-0 group-active:opacity-60 group-active:animate-ping bg-primary-400/50"
        style={{ animationDelay: "0.1s", animationDuration: "0.8s" }}
      />
    </button>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block" style={{ textDecoration: 'none' }}>
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
}

