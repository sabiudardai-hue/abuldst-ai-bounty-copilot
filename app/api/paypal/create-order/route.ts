import { NextResponse } from "next/server";
import { createPayPalOrder } from "../../../../lib/paypal";

export async function POST() {
  try {
    const order = await createPayPalOrder();

    return NextResponse.json({
      id: order.id,
      links: order.links,
    });
  } catch (error) {
    console.error("PayPal create order error:", error);

    return NextResponse.json(
      { error: "Unable to create PayPal order" },
      { status: 500 }
    );
  }
}
