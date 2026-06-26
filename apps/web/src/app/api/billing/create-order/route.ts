import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createOrder } from "@/lib/billing/razorpay";
import { PLANS } from "@/lib/constants/plans";
import type { PlanId } from "@/lib/constants/plans";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await req.json();

  if (!plan || !PLANS[plan as PlanId]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const planConfig = PLANS[plan as PlanId];

  if (planConfig.price === 0) {
    return NextResponse.json(
      { error: "Cannot create order for free plan" },
      { status: 400 },
    );
  }

  try {
    const order = await createOrder(planConfig.price, userId, plan);

    return NextResponse.json({
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        plan,
      },
    });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 },
    );
  }
}
