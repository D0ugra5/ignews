import Stripe from "stripe";
import { fauna } from "./fauna";
import { query as q } from "faunadb";
export interface Product {
  priceId: string;
  amount: string;
}
type User = {
  ref: {
    id: string;
  };

  data: {
    stripe_customer_id: string;
  };
};

export class StripeApi {
  private price: string = "price_1Ie0JtBviOVVIhB8g0TdNz2v";
  public stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: "2020-08-27",
    appInfo: {
      name: "Ignews",
      version: "1.0",
    },
  });

  async stripeFindPriceProduct(): Promise<Product> {
    const price = await this.stripe.prices.retrieve(this.price, {
      expand: ["product"],
    });
    const product = {
      priceId: price.id,
      amount: new Intl.NumberFormat("en-us", {
        style: "currency",
        currency: "USD",
      }).format(price.unit_amount ? price.unit_amount / 100 : 0),
    };

    return product;
  }

  async checkoutSession(email: string) {
    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index("users_by_email"), q.Casefold(email)))
    );
    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      let stripeCustomer = await this.stripe.customers.create({
        email,
      });

      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        })
      );

      customerId = stripeCustomer.id;
    }

    const checkoutSession = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: this.price,
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url:
        process.env.STRIPE_SUCCESS_URL || "http://localhost:3000/posts",
      cancel_url: process.env.STRIPE_CANCEL_URL || "http://localhost:3000/",
    });

    return checkoutSession;
  }
}
