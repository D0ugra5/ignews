import { query as q } from "faunadb";
import { StripeApi } from "../../../services/stripe";

import { fauna } from "./../../../services/fauna";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction: boolean
) {
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(q.Match(q.Index("user_by_stripe_customer_id"), customerId))
    )
  );
  const stripe = new StripeApi();
  const subscription = await stripe.stripe.subscriptions.retrieve(
    subscriptionId
  );

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };


  if (createAction) {
    await fauna.query(
      q.Create(q.Collection("subscriptions"), {data:subscriptionData})
    );
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(q.Match(q.Index("subscription_by_id"), subscriptionId))
        ),
        { data: subscriptionData }
      )
    );
  }
}
