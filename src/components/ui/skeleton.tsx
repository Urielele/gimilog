import { cn } from "cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("rounded-none bg-surface-raised", className)}
      {...props}
    />
  )
}

export { Skeleton }
