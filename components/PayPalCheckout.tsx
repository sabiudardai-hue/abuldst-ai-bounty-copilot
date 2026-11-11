"use client";

import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PayPalCheckout() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return <p>PayPal Client ID is missing.</p>;
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-[#111522] p-5">
      <h3 className="text-lg font-semibold text-white">
        Unlock Abuldst AI Bounty Copilot
      </h3>
      <p className="my-2 text-sm text-slate-300">
        One-time payment: $5.00 USD
      </p>

      <PayPalScriptProvider
        options={{
          clientId,
          currency: "USD",
          intent: "capture",
        }}
      >
        <PayPalButtons
          style={{ layout: "vertical", shape: "rect", label: "pay" }}
          createOrder={async () => {
            setError("");
            setMessage("");

            const response = await fetch("/api/paypal/create-order", {
              method: "POST",
            });

            const data = await response.json();

            if (!response.ok || !data.id) {
              throw new Error(data.error || "Could not create PayPal order");
            }

            return data.id;
          }}
          onApprove={async (data) => {
            const response = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderID: data.orderID }),
            });

            const result = await response.json();

            if (!response.ok) {
              throw new Error(result.error || "Payment capture failed");
            }

            setMessage("Payment successful! Thank you.");
          }}
          onError={(err) => {
            setError("PayPal checkout failed. Please try again.");
            console.error("PayPal error:", err);
          }}
        />
      </PayPalScriptProvider>

      {message && <p className="mt-3 text-sm text-green-400">{message}</p>}
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
}
