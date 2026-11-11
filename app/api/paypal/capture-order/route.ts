import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "../../../../lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const { orderID } = await request.json();

    if (
      typeof orderID !== "string" ||
      orderID.length < 5 ||
      orderID.length > 100
    ) {
      return NextResponse.json(
        { error: "A valid PayPal order ID is required" },
        { status: 400 }
      );
    }

    const result = await capturePayPalOrder(orderID);

    const purchaseUnit = result?.purchase_units?.[0];
    const capture = purchaseUnit?.payments?.captures?.[0];
    const amount = capture?.amount;

    if (
      result?.id !== orderID ||
      result?.status !== "COMPLETED" ||
      capture?.status !== "COMPLETED" ||
      amount?.currency_code !== "USD" ||
      amount?.value !== "5.00"
    ) {
      return NextResponse.json(
        { error: "Payment could not be verified" },
        { status: 402 }
      );
    }

    return NextResponse.json({
      status: "COMPLETED",
      orderID: result.id,
      amount: "5.00",
      currency: "USD"
    });
  } catch (error) {
    console.error("PayPal capture error:", error);

    return NextResponse.json(
      { error: "Unable to verify PayPal payment" },
      { status: 500 }
    );
  }
}
