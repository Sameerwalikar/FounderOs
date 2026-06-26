import { auth } from "@clerk/nextjs/server";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { getOrCreateSubscription } from "@/lib/billing/subscription.service";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  let creditsRemaining: number | undefined;
  let creditsTotal: number | undefined;

  if (userId) {
    const subscription = await getOrCreateSubscription(userId);
    creditsRemaining = subscription.creditsRemaining;
    creditsTotal = subscription.monthlyCredits;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        creditsRemaining={creditsRemaining}
        creditsTotal={creditsTotal}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
