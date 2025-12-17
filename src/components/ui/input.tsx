import { ComponentProps } from "react"

import { cn } from "@/lib/utils"
import { haptics } from "@/lib/haptics"

function Input({ className, type, onFocus, ...props }: ComponentProps<"input">) {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    haptics.selection()
    onFocus?.(e)
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-[16px] shadow-xs transition-all duration-150 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:h-9 md:py-1 md:text-sm touch-manipulation",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:scale-[1.01]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      onFocus={handleFocus}
      {...props}
    />
  )
}

export { Input }
