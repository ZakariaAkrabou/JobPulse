import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default:
        "bg-[#3F5D9E] text-white hover:bg-[#2F4A85] focus-visible:ring-[#3F5D9E]",
      secondary:
        "bg-[#F2EFE9] text-[#2A2B2F] hover:bg-[#E5E1D8] focus-visible:ring-[#3F5D9E]",
      outline:
        "border border-[#E5E1D8] bg-transparent text-[#2A2B2F] hover:bg-[#F2EFE9] hover:border-[#D8D2C4] focus-visible:ring-[#3F5D9E]",
      ghost:
        "text-[#2A2B2F] hover:bg-[#F2EFE9] focus-visible:ring-[#3F5D9E]",
      link: "text-[#3F5D9E] underline-offset-4 hover:underline focus-visible:ring-[#3F5D9E]",
    };

    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 px-3 text-xs",
      lg: "h-11 px-6 text-sm",
      icon: "h-10 w-10 p-2 justify-center",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-[8px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
