"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] font-body font-semibold text-base leading-none transition-[transform,opacity,background-color,color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--brand-primary)] text-white shadow-[0_4px_12px_rgba(224,123,64,0.35)] hover:brightness-105",
        secondary:
          "bg-[var(--surface-sunken)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)]",
        ghost:
          "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)]",
        outline:
          "border border-[var(--border-medium)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-sunken)]",
        gold:
          "bg-[var(--brand-gold)] text-white shadow-[0_4px_12px_rgba(201,149,26,0.35)] hover:brightness-105",
        destructive:
          "bg-[var(--semantic-error)] text-white hover:brightness-105",
      },
      size: {
        sm: "h-8 px-4 text-xs",
        md: "h-12 px-6",
        lg: "h-16 px-8 text-lg",
        icon: "h-12 w-12 rounded-[var(--radius-sm)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
