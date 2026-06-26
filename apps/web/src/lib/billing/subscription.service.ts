import { prisma } from "@/lib/db/client";
import { PLANS } from "@/lib/constants/plans";
import type { PlanId } from "@/lib/constants/plans";

export async function getOrCreateSubscription(userId: string) {
  let subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    subscription = await prisma.subscription.create({
      data: {
        userId,
        plan: "free",
        status: "active",
        creditsRemaining: PLANS.free.credits,
        monthlyCredits: PLANS.free.credits,
        renewalDate: getNextMonth(),
      },
    });
  }

  return subscription;
}

export async function upgradePlan(
  userId: string,
  plan: PlanId,
  razorpayPaymentId: string,
  razorpayOrderId: string,
) {
  const planConfig = PLANS[plan];

  // Update subscription
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      plan,
      status: "active",
      creditsRemaining: planConfig.credits,
      monthlyCredits: planConfig.credits,
      renewalDate: getNextMonth(),
    },
    create: {
      userId,
      plan,
      status: "active",
      creditsRemaining: planConfig.credits,
      monthlyCredits: planConfig.credits,
      renewalDate: getNextMonth(),
    },
  });

  // Record payment
  await prisma.payment.create({
    data: {
      userId,
      amount: planConfig.price,
      currency: "INR",
      status: "captured",
      razorpayOrderId,
      razorpayPaymentId,
      plan,
    },
  });

  return { success: true };
}

export async function deductCredits(userId: string, amount: number, action: string) {
  const subscription = await getOrCreateSubscription(userId);

  if (subscription.creditsRemaining < amount) {
    return { success: false, error: "Insufficient credits" };
  }

  const updated = await prisma.subscription.update({
    where: { userId },
    data: { creditsRemaining: subscription.creditsRemaining - amount },
  });

  // Log transaction
  await prisma.creditTransaction.create({
    data: {
      userId,
      action,
      creditsUsed: amount,
      creditsRemaining: updated.creditsRemaining,
    },
  });

  return { success: true, remaining: updated.creditsRemaining };
}

export async function getCredits(userId: string) {
  const subscription = await getOrCreateSubscription(userId);
  return {
    remaining: subscription.creditsRemaining,
    total: subscription.monthlyCredits,
    plan: subscription.plan,
  };
}

export async function getPaymentHistory(userId: string) {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function getCreditTransactions(userId: string) {
  return prisma.creditTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

function getNextMonth(): Date {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date;
}
