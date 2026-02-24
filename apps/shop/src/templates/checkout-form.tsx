import Review from "@/components/checkout/review";
import Shipping from "@/components/checkout/shipping";
import { listCartShippingMethods } from "@/services/fulfillment";
import { listCartPaymentMethods } from "@/services/payment";

export default async function CheckoutForm({
    cart,
    customer,
}: {
    cart: any | null;
    customer: any | null;
}) {
    if (!cart) {
        return null;
    }

    const shippingMethods = await listCartShippingMethods(cart.id);
    const paymentMethods = await listCartPaymentMethods();

    if (!shippingMethods || !paymentMethods) {
        return null;
    }

    return (
        <div className="w-full grid grid-cols-1 gap-y-8">
            {/* <Addresses cart={cart} customer={customer} /> */}

            <Shipping availableShippingMethods={shippingMethods} cart={cart} />

            {/* <Payment availablePaymentMethods={paymentMethods} cart={cart} /> */}

            <Review cart={cart} />
        </div>
    );
}
