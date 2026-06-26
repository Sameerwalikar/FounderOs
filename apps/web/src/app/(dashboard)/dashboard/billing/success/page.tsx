import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/constants/plans";
import type { PlanId } from "@/lib/constants/plans";

export const metadata: Metadata = {
  title: "Payment Successful",
};

interface PageProps {
  searchParams: Promise<{ plan?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const planId = (params.plan || "pro") as PlanId;
  const plan = PLANS[planId] || PLANS.pro;

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>

        {/* Thank You Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Payment Successful! 🎉
          </h1>
          <p className="text-muted-foreground">
            Thank you for upgrading to the{" "}
            <span className="font-semibold text-foreground">{plan.name}</span>{" "}
            plan.
          </p>
        </div>

        {/* Plan Details Card */}
        <div className="rounded-xl border border-border bg-card p-6 text-left">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Your Plan
              </p>
              <p className="text-lg font-bold">{plan.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground">
                Monthly
              </p>
              <p className="text-lg font-bold">₹{plan.price}</p>
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm">
                <span className="font-semibold text-foreground">
                  {plan.credits} AI Credits
                </span>{" "}
                <span className="text-muted-foreground">
                  added to your account
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link href="/dashboard">
            <Button className="w-full gap-2" size="lg">
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/billing">
            <Button variant="outline" className="w-full" size="lg">
              View Billing Details
            </Button>
          </Link>
        </div>

        {/* Note */}
        <p className="text-xs text-muted-foreground">
          Your credits have been activated immediately. You can start generating
          blueprints and chatting with your AI Co-Founder right away.
        </p>
      </div>
    </div>
  );
}
