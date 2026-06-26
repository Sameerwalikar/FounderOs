import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function createOrder(amount: number, userId: string, plan: string) {
  const order = await razorpay.orders.create({
    amount: amount * 100, // Razorpay expects paise
    currency: "INR",
    receipt: `${userId}_${plan}_${Date.now()}`,
    notes: { userId, plan },
  });
  return order;
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
}

export { razorpay };
