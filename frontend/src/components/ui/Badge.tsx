import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "neutral";
  children: React.ReactNode;
}

export function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-[#E8F8F5] text-[#0E9F6E]", // Soft green background, vivid green text
    warning: "bg-[#FFF8F1] text-[#D97706]", // Soft orange
    danger: "bg-[#FDF2F2] text-[#E02424]", // Soft red
    info: "bg-[#EBF5FF] text-[#3F83F8]", // Soft blue
    neutral: "bg-gray-100 text-gray-500", // Soft gray
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

