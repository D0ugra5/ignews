import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { StripeApi } from "../../services/stripe";

export const subscribe =  async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("aqu")
  if (req.method === "POST") {
    const session = await getSession({ req });

    const StripeCustomerEmail = session?.user?.email || "";
    const stripeApi = new StripeApi();
   const respStripe =  await stripeApi.checkoutSession(StripeCustomerEmail);

    return res.status(200).json({
       sessionId:respStripe.id,
    });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
