import * as React from "react";
import { cn } from "@/src/app/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "font-mono text-xs font-medium text-[#2A2B2F] tracking-tight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none",
          className
        )}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

export { Label };
