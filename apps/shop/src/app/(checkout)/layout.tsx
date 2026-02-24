import type { ReactNode } from "react";

import { ShopNexIcon } from "@/components/icons/shopnex-icon";
import { Card, CardContent } from "@/components/ui/card";
import { OrderSummery } from "@/templates/checkout/order-summary";
import { Steps } from "@/templates/checkout/steps";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const steps = [
    {
        id: 1,
        name: "Shipping Address",
        description: "Enter your shipping details",
        route: "/checkout/address",
    },
    {
        id: 2,
        name: "Delivery",
        description: "Choose delivery method",
        route: "/checkout/shipping",
    },
    {
        id: 3,
        name: "Payment",
        description: "Enter payment details",
        route: "/checkout/payment",
    },
    {
        id: 4,
        name: "Review",
        description: "Review your order",
        route: "/checkout/review",
    },
];

export default async function CheckoutLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="w-full bg-white relative small:min-h-screen">
            <div className="h-16 bg-white border-b ">
                <nav className="flex h-full items-center content-container justify-between">
                    <Link
                        className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase flex-1 basis-0"
                        data-testid="back-to-cart-link"
                        href="/cart"
                    >
                        <ChevronDown className="rotate-90" size={16} />
                        <span className="mt-px hidden small:block txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base ">
                            Back to shopping cart
                        </span>
                        <span className="mt-px block small:hidden txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
                            Back
                        </span>
                    </Link>
                    <Link
                        className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
                        data-testid="store-link"
                        href="/"
                    >
                        ShopNex Store
                    </Link>
                    <div className="flex-1 basis-0" />
                </nav>
            </div>
            <div className="relative" data-testid="checkout-container">
                <div className="min-h-screen py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2">
                                {/* Step UI could be reused via context */}
                                <Steps steps={steps} />

                                {/* Step Content */}
                                <Card>
                                    <CardContent className="p-6">
                                        {children}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Summary */}
                            <OrderSummery />
                        </div>
                    </div>
                </div>
            </div>
            <div className="content-container flex flex-col w-full">
                <div className="flex w-full mb-16 justify-between text-ui-fg-muted">
                    <p className="font-normal font-sans txt-medium txt-compact-small">
                        ShopNex all rights reserved
                    </p>
                    <div className="flex gap-x-2 txt-compact-small-plus items-center">
                        <Link
                            className="font-normal font-sans txt-medium flex gap-x-2 txt-compact-small-plus items-center"
                            href="https://github.com/shopnex-ai/shopnex"
                            rel="noreferrer"
                            target="_blank"
                        >
                            Powered by <ShopNexIcon fill="#9ca3af" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
