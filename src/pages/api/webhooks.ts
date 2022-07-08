import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { StripeApi } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk, "utf8") : chunk);
  }
  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export const webHook = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    console.log("dentro do webhook");
    const secret = req.headers["stripe-signature"]!;
    const buf = await buffer(req);
    let event: Stripe.Event;

    try {
      console.log("dentro do try");

      const stripeApi = new StripeApi();
      event = stripeApi.stripe.webhooks.constructEvent(
        buf.toString(),
        secret,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.log("dentro do catch");
      console.log(err);
      return res.status(400).send(`WebHook Error: ${err}`);
    }

    const { type } = event;
    console.log(type);
    if (relevantEvents.has(type)) {
      try {
        console.log("dentro do segundo try");

        switch (type) {
          case "customer.subscription.updated":

          case "customer.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription;
            await saveSubscription(
              subscription.id.toString(),
              subscription.customer.toString(),
              false
            );

            break;

          case "checkout.session.completed":
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;
            await saveSubscription(
              checkoutSession.subscription?.toString() || "",
              checkoutSession.customer?.toString() || "",
              true
            );
            break;
          default:
            throw new Error(`Unknown event type: ${type}`);
        }
      } catch (error) {
        return res.json({ error: "webhook error" });
      }
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
