"use client";

import type { CheckoutSession } from "@shopnex/types";

import Cookies from "js-cookie";

export const updateCheckoutSession = async (data: Partial<CheckoutSession>) => {
    const sessionId = Cookies.get("checkout-session");

    if (!sessionId) {
        return;
    }

    const result = await fetch(`/api/checkout-sessions/session/${sessionId}`, {
        body: JSON.stringify(data),
        credentials: "include",
        method: "PATCH",
    });

    if (result.ok) {
        const session = await result.json();
        return session.checkoutSession;
    }
};

export const createCheckoutSession = async (data: Partial<CheckoutSession>) => {
    const result = await fetch("/api/checkout-sessions/session", {
        body: JSON.stringify(data),
        credentials: "include",
        method: "POST",
    });

    if (result.ok) {
        const session = await result.json();
        return session.checkoutSession;
    }
};
