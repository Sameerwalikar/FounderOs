import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getOrCreateSubscription,
  getPaymentHistory,
  getCreditTransactions,
} from "@/lib/billing/subscription.service";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await getOrCreateSubscription(userId);
  const payments = await getPaymentHistory(userId);
  const transactions = await getCreditTransactions(userId);

  return NextResponse.json({
    data: { subscription, payments, transactions },
  });
}
