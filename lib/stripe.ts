import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY環境変数が設定されていません");
    }
    stripeInstance = new Stripe(key, {
      apiVersion: "2023-10-16",
    });
  }
  return stripeInstance;
}

export async function createCheckoutSession(
  productName: string,
  unitPrice: number,
  quantity: number,
  successUrl: string,
  cancelUrl: string
) {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "jpy",
          product_data: {
            name: productName,
          },
          unit_amount: unitPrice,
        },
        quantity,
      },
    ],
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}
