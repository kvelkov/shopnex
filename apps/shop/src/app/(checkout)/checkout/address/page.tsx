"use client";

import Checkbox from "@/components/checkbox";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCheckoutSession } from "@/hooks/use-checkout-session";
import {
    createCheckoutSession,
    updateCheckoutSession,
} from "@/services/checkout-session";
import { Button, Label } from "@medusajs/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface AddressFormData {
    address: string;
    billingAddressSame: boolean;
    city: string;
    company?: string;
    country: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    postalCode: string;
    state?: string;
}

export default function Address() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const {} = useCheckoutSession();

    const defaultValues =
        process.env.NODE_ENV === "development"
            ? {
                  address: "123 Testing Lane",
                  billingAddressSame: true,
                  city: "Testville",
                  company: "Test Corp",
                  country: "us",
                  email: "john.doe@example.com",
                  firstName: "John",
                  lastName: "Doe",
                  phone: "1234567890",
                  postalCode: "12345",
                  state: "Test State",
              }
            : {
                  billingAddressSame: true,
              };

    const {
        formState: { errors },
        handleSubmit,
        register,
        setValue,
        watch,
    } = useForm<AddressFormData>({
        defaultValues,
    });

    const billingAddressSame = watch("billingAddressSame");

    const onSubmit = async (data: AddressFormData) => {
        setIsLoading(true);
        try {
            const shippingAddress = {
                address_1: data.address,
                city: data.city,
                company: data.company,
                country_code: data.country,
                first_name: data.firstName,
                last_name: data.lastName,
                phone: data.phone,
                postal_code: data.postalCode,
                province: data.state,
            };

            const updateData = {
                billingAddress: data.billingAddressSame
                    ? shippingAddress
                    : undefined,
                shippingAddress,
            };

            await createCheckoutSession(updateData);

            router.push("/checkout/shipping");
        } catch (error) {
            console.error("Error updating address:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <h2 className="text-2xl font-semibold mb-6">
                    Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Input
                            autoComplete="given-name"
                            data-testid="shipping-first-name-input"
                            label="First name"
                            {...register("firstName", {
                                required: "First name is required",
                            })}
                            error={errors.firstName?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            label="Last name*"
                            {...register("lastName", {
                                required: "Last name is required",
                            })}
                            error={errors.lastName?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            label="Address*"
                            {...register("address", {
                                required: "Address is required",
                            })}
                            error={errors.address?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Input label="Company" {...register("company")} />
                    </div>
                    <div className="space-y-2">
                        <Input
                            label="Postal code*"
                            {...register("postalCode", {
                                required: "Postal code is required",
                            })}
                            error={errors.postalCode?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            label="City*"
                            {...register("city", {
                                required: "City is required",
                            })}
                            error={errors.city?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Select
                            defaultValue="us"
                            onValueChange={(value) =>
                                setValue("country", value)
                            }
                        >
                            <SelectTrigger className="bg-gray-50">
                                <SelectValue placeholder="Country*" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="us">
                                    United States
                                </SelectItem>
                                <SelectItem value="ca">Canada</SelectItem>
                                <SelectItem value="uk">
                                    United Kingdom
                                </SelectItem>
                                <SelectItem value="au">Australia</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.country && (
                            <p className="text-red-500 text-sm">
                                {errors.country.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Input
                            label="State / Province"
                            {...register("state")}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                checked={billingAddressSame}
                                id="billingAddressSame"
                                label="Billing address same as shipping address"
                                onChange={(checked: any) => {
                                    setValue(
                                        "billingAddressSame",
                                        checked.target.value
                                    );
                                }}
                            />
                            <Label htmlFor="billingAddressSame">
                                Billing address same as shipping address
                            </Label>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Input
                            label="Email*"
                            type="email"
                            {...register("email", {
                                pattern: {
                                    message: "Invalid email address",
                                    value: /^\S[^\s@]*@\S+$/,
                                },
                                required: "Email is required",
                            })}
                            error={errors.email?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            autoComplete="tel"
                            data-testid="shipping-phone-input"
                            label="Phone"
                            {...register("phone")}
                        />
                    </div>
                </div>
            </div>
            <Button disabled={isLoading} type="submit">
                {isLoading ? "Saving..." : "Continue to delivery"}
            </Button>
        </form>
    );
}
