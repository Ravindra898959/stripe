const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Use async/await to handle the asynchronous method
export default async function handler(req, res){
    if (req.method === "GET") {
        console.log(req.query.id)
        const sessionId = req.query.id;
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

// Call the function to get the list of transactions
// getStripeTransactions();
