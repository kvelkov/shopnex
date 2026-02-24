"use client";

import type { Item } from "react-use-cart";

import Thumbnail from "@/components/thumbnail";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { payloadSdk } from "@/utils/payload-sdk";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "react-use-cart";

export const OrderSummery = () => {
    const { cartTotal, items, metadata } = useCart();
    const [shippingFee, setShippingFee] = useState(0);

    useEffect(() => {
        const calculateShippingCost = async () => {
            const shippingMethods = await payloadSdk.find({
                collection: "shipping",
                where: {
                    enabled: {
                        equals: true,
                    },
                },
            });

            const shippingMethod =
                shippingMethods.docs.find(
                    (method) => method.id === metadata?.shippingMethodId
                ) || shippingMethods.docs[0];

            if (!shippingMethod) {
                return;
            }

            const shippingProvider = shippingMethod.shippingProvider?.[0];
            setShippingFee(shippingProvider?.baseRate || 0);
        };
        calculateShippingCost();
    }, [metadata]);

    return (
        <div className="lg:col-span-1">
            <Card className="sticky top-8">
                <CardHeader>
                    <CardTitle>In your Cart</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {items.map((item: Item) => (
                        <div
                            className="flex items-center space-x-4"
                            key={item.id}
                        >
                            <Thumbnail
                                className="small:w-24 w-12"
                                size="square"
                                thumbnail={item.gallery?.[0]?.url}
                            />
                            <div className="flex-1">
                                <h3 className="font-medium">
                                    {item.productName}
                                </h3>
                                {item.options?.length > 0 && (
                                    <p className="text-sm text-gray-500">
                                        {item.options
                                            .map(
                                                (opt: any) =>
                                                    `${opt.option}: ${opt.value}`
                                            )
                                            .join(", ")}
                                    </p>
                                )}
                                <div className="flex items-center space-x-2 text-sm">
                                    {item.originalPrice && (
                                        <span className="text-gray-400 line-through">
                                            {item.quantity}x $
                                            {item.originalPrice.toFixed(2)}
                                        </span>
                                    )}
                                    <span className="text-blue-600">
                                        ${item.price.toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-sm font-medium">
                                    ${item.itemTotal?.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}

                    <Separator />

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="flex items-center space-x-1">
                                <span className="flex gap-x-1 items-center">
                                    Subtotal
                                </span>
                                <Info className="w-4 h-4 text-gray-400" />
                            </span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>${shippingFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Taxes</span>
                            <span>$0.00</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${(cartTotal + shippingFee).toFixed(2)}</span>
                    </div>

                    <Button className="text-blue-600 p-0 h-auto" variant="link">
                        <span className="flex items-center space-x-1">
                            <span>Add gift card or discount code</span>
                            <Info className="w-4 h-4" />
                        </span>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
