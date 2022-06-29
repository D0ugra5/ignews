import Stripe from "stripe";
import { version as version } from '../../package.json'

export interface Product {
    priceId: string;
    amount: string;
}
export class StripeApi {
    stripe = new Stripe(
        process.env.STRIPE_API_KEY || '000000',
        {
            apiVersion: "2020-08-27",
            appInfo: {
                name: 'Ignews',
                version
            }
        }
    );

    async stripeFindPriceProduct(): Promise<Product> {
        const price = await this.stripe.prices.retrieve('price_1Ie0JtBviOVVIhB8g0TdNz2v', {
            expand: ['product']
        });
        const product = {
            priceId: price.id,
            amount: new Intl.NumberFormat('en-us', {
                style: 'currency',
                currency: 'USD'
            }).format(price.unit_amount ? price.unit_amount / 100 : 0),
        };

        return product;
    }
}
