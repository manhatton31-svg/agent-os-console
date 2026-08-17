import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-opacity duration-150 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-fg hover:opacity-90",
        secondary: "bg-raised text-fg border border-line hover:bg-surface",
        ghost: "text-muted hover:text-fg hover:bg-raised",
        outline: "border border-line bg-transparent text-fg hover:bg-raised",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-5",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>
>(({ className, variant, size, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(buttonVariants({ variant, size }), className)}
    {...props}
  />
));
Button.displayName = "Button";
