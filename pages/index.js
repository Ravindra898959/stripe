import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {useRouter} from "next/router";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function PreviewPage() {
  const [sessionData, setSessionData] = useState(null);


  const router = useRouter()
  console.log(router.query)

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get("session_id");
      if (sessionId) {
        console.log(sessionId),"session-id"
        retrieveSession(sessionId);
      }
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
      
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: 75000, // Update this with the correct price value
        }),
      });
      const session = await response.json();
      console.log(session);
      window.location.href = session.url;
    } catch (error) {
      console.log(error);
    }
  };

  const retrieveSession = async (sessionId) => {
    try {
      const response = await fetch(`/api/stripe/${sessionId}`);
      const data = await response.json();
      console.log(data);
      setSessionData(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <section>
          <button type="submit" role="link">
            Checkout
          </button>
        </section>
        <style jsx>{`
          section {
            background: #ffffff;
            display: flex;
            flex-direction: column;
            width: 400px;
            height: 112px;
            border-radius: 6px;
            justify-content: space-between;
          }
          button {
            height: 36px;
            background: #556cd6;
            border-radius: 4px;
            color: white;
            border: 0;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
          }
          button:hover {
            opacity: 0.8;
          }
        `}</style>
      </form>
      {sessionData && (
        <div>
          <h2>Transaction Details</h2>
          <p>Payment ID: {sessionData.payment_intent}</p>
          <p>Status: {sessionData.payment_status}</p>
          <p>Amount: {sessionData.amount_total / 100} {sessionData.currency}</p>
        </div>
      )}
    </div>
  );
}
