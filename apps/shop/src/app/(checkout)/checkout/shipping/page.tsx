"use client";

import type { Shipping } from "@shopnex/types";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCheckoutSession } from "@/hooks/use-checkout-session";
import { updateCheckoutSession } from "@/services/checkout-session";
import { payloadSdk } from "@/utils/payload-sdk";
import { Button, Label } from "@medusajs/ui";
import { Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "react-use-cart";

interface ShippingFormData {
    shippingMethod: string;
}

export default function ShippingPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [deliveryMethods, setDeliveryMethods] = useState<Shipping[]>([]);
    const { setCartMetadata } = useCart();
    const {} = useCheckoutSession();

    const {
        formState: { errors },
        handleSubmit,
        register,
        setValue,
        watch,
    } = useForm<ShippingFormData>();

    const selectedMethod = watch("shippingMethod");

    useEffect(() => {
        const fetchDeliveryMethods = async () => {
            try {
                const data = await payloadSdk.find({
                    collection: "shipping",
                    where: {
                        enabled: {
                            equals: true,
                        },
                    },
                });
                const sortedMethods = (data.docs || []).sort(
                    (a: any, b: any) => {
                        return (
                            a.shippingProvider[0].baseRate -
                            b.shippingProvider[0].baseRate
                        );
                    }
                );
                setDeliveryMethods(sortedMethods);

                if (
                    data.docs?.length > 0 &&
                    (data.docs[0] as any)?.shippingProvider?.length > 0
                ) {
                    const defaultMethod = `${data.docs[0].id}:0`;
                    setValue("shippingMethod", defaultMethod);
                }
            } catch (error) {
                console.error("Error fetching delivery methods:", error);
            }
        };

        fetchDeliveryMethods();
    }, [setValue]);

    useEffect(() => {
        const [shippingId, blockIndex] = selectedMethod?.split(":") || [];
        const method = deliveryMethods.find((m) => m.id === Number(shippingId));
        const shippingProvider = method?.shippingProvider?.[Number(blockIndex)];

        if (shippingProvider) {
            setCartMetadata({
                shippingMethodId: method.id,
            });
        }
    }, [selectedMethod, deliveryMethods]);

    const onSubmit = async (data: ShippingFormData) => {
        setIsLoading(true);
        try {
            const [shippingId, blockIndex] = data.shippingMethod.split(":");
            const shipping = deliveryMethods.find(
                (m) => m.id === Number(shippingId)
            );

            await updateCheckoutSession({
                shipping: shipping?.id,
            });

            router.push("/checkout/payment");
        } catch (error) {
            console.error("Error updating shipping method:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderShippingOptions = () => {
        return deliveryMethods.flatMap((method) => {
            if (!method.shippingProvider) {
                return [];
            }

            return method.shippingProvider.map(
                (providerBlock: any, idx: number) => {
                    const {
                        id,
                        baseRate,
                        estimatedDeliveryDays,
                        label,
                        notes,
                    } = providerBlock;

                    const value = `${method.id}:${idx}`;

                    return (
                        <div
                            className="flex items-center space-x-3 p-4 border rounded-lg"
                            key={value}
                        >
                            <RadioGroupItem id={value} value={value} />
                            <div className="flex-1">
                                <Label
                                    className="flex items-center justify-between cursor-pointer"
                                    htmlFor={value}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Truck className="h-5 w-5" />
                                        <div>
                                            <div className="font-medium">
                                                {label}
                                            </div>
                                            {estimatedDeliveryDays && (
                                                <div className="text-sm text-gray-500">
                                                    {estimatedDeliveryDays}
                                                </div>
                                            )}
                                            {notes && (
                                                <div className="text-sm text-gray-400 italic">
                                                    {notes}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="font-medium">
                                        {baseRate === 0
                                            ? "Free"
                                            : `$${baseRate.toFixed(2)}`}
                                    </span>
                                </Label>
                            </div>
                        </div>
                    );
                }
            );
        });
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <h2 className="text-2xl font-semibold mb-6">Delivery</h2>
                <RadioGroup
                    onValueChange={(value) => {
                        setValue("shippingMethod", value);
                    }}
                    value={selectedMethod}
                >
                    <div className="space-y-4">{renderShippingOptions()}</div>
                </RadioGroup>
                {errors.shippingMethod && (
                    <p className="text-red-500 text-sm mt-2">
                        Please select a shipping method
                    </p>
                )}
            </div>
            <div className="flex space-x-4">
                <Button
                    onClick={() => router.push("/checkout/address")}
                    type="button"
                    variant="secondary"
                >
                    Back to address
                </Button>
                <Button disabled={isLoading} type="submit">
                    {isLoading ? "Saving..." : "Continue to payment"}
                </Button>
            </div>
        </form>
    );
}
