import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getOrCreateSubscription,
  getPaymentHistory,
} from "@/lib/billing/subscription.service";
import { PLANS } from "@/lib/constants/plans";
import type { PlanId } from "@/lib/constants/plans";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingCards } from "@/components/billing/pricing-cards";

export const metadata: Metadata = {
  title: "Billing",
};

export default async function BillingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const subscription = await getOrCreateSubscription(userId);
  const payments = await getPaymentHistory(userId);
  const currentPlan = PLANS[subscription.plan as PlanId] || PLANS.free;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your subscription and credits
      </p>

      {/* Current Plan */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{currentPlan.name}</span>
              <Badge variant="secondary">Active</Badge>
            </div>
            {currentPlan.price > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                ₹{currentPlan.price}/month
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Credits Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscription.creditsRemaining}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}/ {subscription.monthlyCredits}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${(subscription.creditsRemaining / subscription.monthlyCredits) * 100}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Renewal Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {subscription.renewalDate
                ? new Date(subscription.renewalDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })
                : "—"}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Cards */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold">Upgrade Plan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose the plan that fits your needs
        </p>
        <div className="mt-6">
          <PricingCards currentPlan={subscription.plan} />
        </div>
      </div>

      {/* Payment History */}
      {payments.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold">Payment History</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Plan</th>
                  <th className="px-4 py-3 text-left font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 capitalize">{p.plan}</td>
                    <td className="px-4 py-3">₹{p.amount}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={p.status === "captured" ? "default" : "secondary"}
                      >
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
