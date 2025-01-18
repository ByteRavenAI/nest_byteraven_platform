import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'process';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(private config: ConfigService) {}

  stripeSecretKey = this.config.get('STRIPE_SECRET_KEY') || '';
  stripe = new Stripe(this.stripeSecretKey, {
    apiVersion: '2024-12-18.acacia',
  });

  // const stripe = new Stripe(stripeSecretKey || "", {});

  async createOrGetCustomerStripeService(
    email: string,
    name: string,
  ): Promise<string | null> {
    try {
      // check if customer already exists
      const customers = await this.stripe.customers.list({
        email,
      });

      if (customers.data.length > 0) {
        return customers.data[0].id;
      } else {
        const customer = await this.stripe.customers.create({
          email,
          name,
        });
        return customer.id;
      }
    } catch (error: any) {
      console.error('Error creating customer:', error);
      return null;
    }
  }

  // export const createOrganisationBillingStripePaymentIntentService = async (
  //   amount: number,
  //   orgId: string
  // ): Promise<string | null> => {
  //   try {
  //     const paymentIntent = await stripe.paymentIntents.create({
  //       amount: amount * 100, // Amount in cents
  //       currency: "usd",
  //       payment_method_types: ["card"],
  //       metadata: {
  //         orgId: orgId,
  //         amount: amount,
  //         type: "byteraven-organisation-billing",
  //       },
  //     });

  //     return paymentIntent.client_secret;
  //   } catch (error) {
  //     logger.error(
  //       `Error in createOrganisationBillingStripePaymentIntentService: ${error}`
  //     );
  //     return null;
  //   }
  // };

  // // create a stripe payment sesssion for webapps

  async createOrganisationBillingStripePaymentSessionService(
    amount: number,
    orgId: string,
    customerId: string,
    type: string,
  ): Promise<string | null> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Organisation Balance Update',
              },
              unit_amount: amount * 100, // Amount in cents
            },
            quantity: 1,
          },
        ],
        metadata: {
          orgId: orgId,
          amount: amount,
          type: type,
          customerId: customerId,
        }, // To identify the user
        success_url:
          'https://app.byteraven.ai/organisationBilling/payment-success', // Redirect after success
        cancel_url: 'http://app.byteraven.ai/organisationBilling/cancel', // Redirect after cancellation
      });

      return session.id;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return null;
    }
  }

  // export const createMbaCraftStripeSubscriptionCheckoutSession = async (
  //   customerId: string,
  //   priceId: string,
  //   orgId: string,
  //   orgAlias: string,
  //   userId: string
  // ): Promise<string | null> => {
  //   try {
  //     const session = await stripe.checkout.sessions.create({
  //       payment_method_types: ["card"],
  //       mode: "subscription",
  //       customer: customerId,
  //       line_items: [
  //         {
  //           price: priceId, // Price ID for the subscription
  //           quantity: 1,
  //         },
  //       ],
  //       success_url: `https://mbacraft.com/subscriptions/payment-success`,
  //       cancel_url: `https://mbacraft.com/subscriptions/payment-failed`,
  //       subscription_data: {
  //         metadata: {
  //           orgId: orgId,
  //           orgAlias: orgAlias,
  //           userId: userId,
  //           priceId: priceId,
  //           type: "byteraven-mbacraft-subscription",
  //         },
  //       },
  //     });

  //     return session.url; // Redirect URL for the Stripe Checkout
  //   } catch (error) {
  //     console.error("Error creating subscription session:", error);
  //     return null;
  //   }
  // };
}
