import type { Cart, Payment, Shipping } from "@shopnex/types";
import type { PayloadRequest } from "payload";

import { createCheckoutSession } from "../utilities/create-checkout-session";
import { mapToStripeLineItems } from "../utilities/map-to-stripe";

type StripeCheckoutProps = {
    cart: Cart;
    orderId: string;
    payment: Payment;
    req: PayloadRequest;
    shipping: Shipping;
    total: number;
};

export async function stripeCheckout({
    cart,
    orderId,
    payment,
    req,
    shipping,
    total,
}: StripeCheckoutProps) {
    const shopUrl = req.payload.config?.custom?.shopUrl;
    const order = await req.payload.create({
        collection: "orders",
        data: {
            cart: cart.id,
            currency: "usd",
            orderId,
            orderStatus: "pending",
            payment: payment?.id,
            paymentMethod: "stripe",
            paymentStatus: "pending",
            shipping: shipping?.id,
            totalAmount: total,
        },
        req,
    });

    const cancelUrl = `${shopUrl}/cart?canceled=true`;
    const successUrl = `${shopUrl}/order/confirmed/{CHECKOUT_SESSION_ID}`;
    if (!cart.cartItems?.length) {
        return {
            redirectUrl: null,
        };
    }
    const lineItems = mapToStripeLineItems(cart.cartItems);

    const session = await createCheckoutSession({
        cancelUrl,
        lineItems,
        orderId,
        successUrl,
    });

    // Update order with session info
    await req.payload.update({
        id: order.id,
        collection: "orders",
        data: {
            sessionId: session.id,
            sessionUrl: session.url,
        },
        req,
    });

    return {
        redirectUrl: session.url,
    };
}
