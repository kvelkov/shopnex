"use client";

import { useCheckoutSession } from "@/hooks/use-checkout-session";
import { Button } from "@medusajs/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReviewPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { session } = useCheckoutSession();
    const checkoutSession = session as any;

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        try {
            // Here you would typically create an order
            console.log("Placing order with:", checkoutSession);

            const fetchResult = await fetch(`/api/orders/checkout`, {
                body: JSON.stringify({}),
                credentials: "include",
                method: "POST",
            });

            if (!fetchResult.ok) {
                throw new Error("Failed to create order");
            }

            const result = await fetchResult.json();
            const redirectUrl = result.redirectUrl.startsWith("http")
                ? result.redirectUrl
                : new URL(result.redirectUrl, window.location.origin).href;
            window.location.href = redirectUrl;
        } catch (error) {
            console.error("Error placing order:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!checkoutSession) {
        return <div>Loading checkout session...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Review Order</h2>

            <div className="space-y-4">
                {checkoutSession.shippingAddress && (
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Shipping Address</h3>
                        <div className="text-sm text-gray-600">
                            <p>
                                {checkoutSession.shippingAddress.first_name}{" "}
                                {checkoutSession.shippingAddress.last_name}
                            </p>
                            <p>{checkoutSession.shippingAddress.address_1}</p>
                            <p>
                                {checkoutSession.shippingAddress.city},{" "}
                                {checkoutSession.shippingAddress.province}{" "}
                                {checkoutSession.shippingAddress.postal_code}
                            </p>
                        </div>
                    </div>
                )}

                {checkoutSession.shipping && (
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Shipping Method</h3>
                        <div className="text-sm text-gray-600">
                            <p>{checkoutSession.shipping.name}</p>
                        </div>
                    </div>
                )}

                {checkoutSession.payment && (
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Payment Method</h3>
                        <div className="text-sm text-gray-600">
                            <p>{checkoutSession.payment.name}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex space-x-4">
                <Button
                    onClick={() => router.push("/checkout/payment")}
                    type="button"
                    variant="secondary"
                >
                    Back to payment
                </Button>
                <Button disabled={isLoading} onClick={handlePlaceOrder}>
                    {isLoading ? "Placing order..." : "Place order"}
                </Button>
            </div>
        </div>
    );
}
