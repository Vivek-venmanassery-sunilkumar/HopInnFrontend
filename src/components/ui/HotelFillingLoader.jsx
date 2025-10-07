import React from 'react'

function HotelFillingLoader({
  fullscreen = true,
  message = "Loading...",
  size = "md", // "sm" | "md" | "lg"
  showMessage = true,
}) {
  const sizeClass = size === "sm" ? "h-5 w-5" : size === "lg" ? "h-12 w-12" : "h-8 w-8"

  const Spinner = (
    <span
      aria-hidden="true"
      className={[
        "inline-block rounded-full border-2",
        "border-muted-foreground/30 border-t-transparent",
        "animate-spin",
        sizeClass,
      ].join(" ")}
    />
  )

  const Content = (
    <div className="flex items-center gap-3">
      {Spinner}
      {showMessage && message ? <span className="text-sm text-muted-foreground">{message}</span> : null}
      <span className="sr-only">Loading</span>
    </div>
  )

  if (!fullscreen) {
    return (
      <div role="status" aria-live="polite" aria-busy="true">
        {Content}
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={["fixed inset-0 z-50 grid place-items-center", "bg-background/80 backdrop-blur-sm"].join(" ")}
    >
      <div className="flex flex-col items-center gap-4">{Content}</div>
    </div>
  )
}

export default HotelFillingLoader