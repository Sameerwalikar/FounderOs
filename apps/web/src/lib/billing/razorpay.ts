import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function createOrder(amount: number, userId: string, plan: string) {
  // Receipt must be max 40 chars — use short hash
  const shortId = userId.slice(-8);
  const receipt = `${shortId}_${plan}_${Date.now().toString(36)}`.slice(0, 40);

  const order = await razorpay.orders.create({
    amount: amount * 100, // Razorpay expects paise
    currency: "INR",
    receipt,
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
