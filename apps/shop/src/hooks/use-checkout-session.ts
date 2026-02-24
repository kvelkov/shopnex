import type { CheckoutSession } from "@shopnex/types";

import { payloadSdk } from "@/utils/payload-sdk";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useCheckoutSession = () => {
    const [session, setSession] = useState<CheckoutSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const sessionId = Cookies.get("checkout-session");

                let sessionData: CheckoutSession | null = null;

                if (!sessionId) {
                    setSession(null);
                } else {
                    const existingSession = await payloadSdk.find({
                        collection: "checkout-sessions",
                        where: {
                            sessionId: {
                                equals: sessionId,
                            },
                        },
                    });

                    sessionData = existingSession.docs?.[0] || null;
                }

                setSession(sessionData);

                if (
                    !sessionData?.shippingAddress ||
                    !sessionData?.billingAddress
                ) {
                    if (pathname !== "/checkout/address") {
                        router.replace("/checkout/address");
                        return;
                    }
                }
                if (
                    !sessionData?.shipping &&
                    sessionData?.shippingAddress &&
                    sessionData.billingAddress
                ) {
                    if (pathname !== "/checkout/shipping") {
                        router.replace("/checkout/shipping");
                        return;
                    }
                }

                if (
                    !sessionData?.payment &&
                    sessionData?.shipping &&
                    sessionData.billingAddress &&
                    sessionData.shippingAddress
                ) {
                    if (pathname !== "/checkout/payment") {
                        router.replace("/checkout/payment");
                        return;
                    }
                }
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, []);

    return { error, loading, session };
};
