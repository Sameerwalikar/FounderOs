import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left side — Branding (hidden on mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-12 lg:flex">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="FounderOS" className="h-8 w-8 rounded-md" />
          <span className="text-lg font-semibold text-white">FounderOS</span>
        </Link>

        {/* Tagline */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight text-white">
            Build your startup
            <br />
            with an AI Co-Founder
          </h1>
          <p className="max-w-md text-base text-indigo-200">
            Generate complete startup blueprints, market research, business
            models, and investor pitch decks — all in minutes.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8">
          <div>
            <p className="text-2xl font-bold text-white">10K+</p>
            <p className="text-xs text-indigo-300">Ideas Analyzed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">9</p>
            <p className="text-xs text-indigo-300">AI Modules</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">60s</p>
            <p className="text-xs text-indigo-300">Avg Blueprint</p>
          </div>
        </div>
      </div>

      {/* Right side — Auth form */}
      <div className="flex w-full flex-col items-center justify-center px-4 lg:w-1/2">
        <div className="mb-8 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="FounderOS" className="h-8 w-8 rounded-md" />
            <span className="text-lg font-semibold">FounderOS</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
