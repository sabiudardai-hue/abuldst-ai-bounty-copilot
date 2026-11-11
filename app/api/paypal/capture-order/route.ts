import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "../../../../lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const { orderID } = await request.json();

    if (!orderID || typeof orderID !== "string") {
      return NextResponse.json(
        { error: "A valid PayPal order ID is required" },
        { status: 400 }
      );
    }

    const result = await capturePayPalOrder(orderID);

    return NextResponse.json(result);
  } catch (error) {
    console.error("PayPal capture error:", error);

    return NextResponse.json(
      { error: "Unable to capture PayPal payment" },
      { status: 500 }
    );
  }
}
