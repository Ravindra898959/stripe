const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log(req.body.price, "price");
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "inr",
              unit_amount: req.body.price, // amount in pais.e (in this case, 500 INR)
              product_data: {
                name: "Aalu bhajiya", // Set the name of your product
                description: "Some description", // Set the description of your product
              },
            },
            quantity: 1, // Set the quantity of your product
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      });
      console.log(session.url, "session-url");
      res.json(session);

    } catch (err) {
      console.log(err, "backend-erro");
      res.status(err.statusCode || 500).json(err.message);
    }
  } else if (req.method === "GET") {
    console.log(req)
    const sessionId = "cs_test_a1Mq7cWoe16ShugvIK71Jm1LIPQySurC9xvuCd36NSKxANxFvIcx54RA5r";
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      console.log(session);
      res.json(session);
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Failed to retrieve session" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
