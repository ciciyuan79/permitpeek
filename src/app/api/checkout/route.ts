import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Lazy-init so build doesn't fail when env var is absent
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "sk_test_placeholder") {
    return null;
  }
  return new Stripe(key, {
    apiVersion: "2024-12-18.acacia",
  });
}

export async function POST(req: NextRequest) {
  try {
    const { city, address } = await req.json();

    if (!city || !address) {
      return NextResponse.json(
        { error: "Missing city or address" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Dev fallback: if no real Stripe key, return mock URL so local testing works
    if (!stripe) {
      return NextResponse.json({
        url: `${baseUrl}/report?city=${city}&address=${encodeURIComponent(address)}&unlocked=true&mock=true`,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "PermitPeek Full Report",
              description: `Complete permit history for ${address}`,
            },
            unit_amount: 900, // $9.00
          },
          quantity: 1,
        },
      ],
      metadata: { city, address },
      success_url: `${baseUrl}/report?city=${city}&address=${encodeURIComponent(address)}&unlocked=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/report?city=${city}&address=${encodeURIComponent(address)}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}
