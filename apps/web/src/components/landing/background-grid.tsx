"use client";

export function BackgroundGrid() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Purple radial glow - top left */}
      <div
        className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: "radial-gradient(circle, hsl(239 84% 67% / 0.4) 0%, transparent 70%)",
        }}
      />

      {/* Blue radial glow - bottom right */}
      <div
        className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full opacity-15 blur-[100px]"
        style={{
          background: "radial-gradient(circle, hsl(217 91% 60% / 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Subtle purple glow - center */}
      <div
        className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full opacity-10 blur-[80px]"
        style={{
          background: "radial-gradient(circle, hsl(260 80% 60% / 0.3) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
