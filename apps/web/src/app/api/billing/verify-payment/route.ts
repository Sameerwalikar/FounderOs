import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyPaymentSignature } from "@/lib/billing/razorpay";
import { upgradePlan } from "@/lib/billing/subscription.service";
import type { PlanId } from "@/lib/constants/plans";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
  } = await req.json();

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan) {
    return NextResponse.json(
      { error: "Missing payment details" },
      { status: 400 },
    );
  }

  // Verify signature server-side
  const isValid = verifyPaymentSignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  );

  if (!isValid) {
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 400 },
    );
  }

  try {
    await upgradePlan(userId, plan as PlanId, razorpay_payment_id, razorpay_order_id);

    return NextResponse.json({
      data: { success: true, plan },
    });
  } catch (error) {
    console.error("Failed to activate subscription:", error);
    return NextResponse.json(
      { error: "Failed to activate subscription" },
      { status: 500 },
    );
  }
}
