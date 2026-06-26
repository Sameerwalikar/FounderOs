"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PLANS } from "@/lib/constants/plans";
import type { PlanId } from "@/lib/constants/plans";

interface PricingCardsProps {
  currentPlan: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export function PricingCards({ currentPlan }: PricingCardsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleUpgrade(planId: PlanId) {
    if (planId === "free" || planId === currentPlan) return;

    setLoading(planId);

    try {
      // Create order
      const orderRes = await fetch("/api/billing/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create order");
      }

      const { data: order } = await orderRes.json();

      // Load Razorpay script if not loaded
      await loadRazorpayScript();

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "FounderOS AI",
        description: `${PLANS[planId].name} Plan - Monthly`,
        order_id: order.orderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // Verify payment on server
          const verifyRes = await fetch("/api/billing/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              plan: planId,
            }),
          });

          if (verifyRes.ok) {
            router.push(`/dashboard/billing/success?plan=${planId}`);
          }
        },
        theme: { color: "#6366f1" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(null);
    }
  }

  const plans = Object.values(PLANS);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan) => {
        const isCurrent = currentPlan === plan.id;
        return (
          <div
            key={plan.id}
            className={cn(
              "relative rounded-xl border p-6 transition-all",
              plan.popular
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border/60 bg-card",
            )}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-0.5 text-[10px] font-semibold text-primary-foreground">
                Most Popular
              </span>
            )}

            <h3 className="text-base font-semibold">{plan.name}</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">
                {plan.price === 0 ? "Free" : `₹${plan.price}`}
              </span>
              {plan.price > 0 && (
                <span className="text-sm text-muted-foreground">/mo</span>
              )}
            </div>

            <ul className="mt-4 space-y-2">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              className="mt-6 w-full"
              variant={plan.popular ? "default" : "outline"}
              size="sm"
              onClick={() => handleUpgrade(plan.id as PlanId)}
              disabled={isCurrent || loading === plan.id || plan.price === 0}
            >
              {loading === plan.id && (
                <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
              )}
              {isCurrent ? "Current Plan" : plan.price === 0 ? "Free" : "Upgrade"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}
