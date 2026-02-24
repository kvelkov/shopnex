import type { Order } from "@shopnex/types";
import type { BasePayload, CollectionAfterChangeHook, Document } from "payload";

import { cjSdk } from "../sdk/cj-sdk";

export const createOrderHook: CollectionAfterChangeHook<Order> = async ({
    doc,
    req,
}) => {
    if (doc.orderStatus !== "processing" || doc.source !== "cj") {
        return;
    }
    const payload: BasePayload = req.payload;
    const cjSettings = await payload.find({
        collection: "cj-settings" as any,
    });
    const cjConfig: any = cjSettings?.docs[0];
    const podProperties = cjConfig?.pod?.url
        ? [
              {
                  type: "1",
                  areaName: "LogoArea",
                  layer: [],
                  links: [cjConfig?.pod?.url],
              },
          ]
        : [];
    const sdk = cjSdk({ accessToken: cjConfig?.accessToken });
    const result = await sdk.orders.createOrder({
        consigneeID: doc.billingAddress?.name || "",
        email: doc.billingAddress?.email || "",
        fromCountryCode: "CN",
        houseNumber: doc.shippingAddress?.address?.line2 || "",
        iossType: 1,
        logisticName: "CJPacket Liquid US",
        orderNumber: doc.orderId,
        payType: 2,
        // products: doc.items.map((item) => ({
        //     quantity: item.quantity,
        //     vid: item.variant.variantId,
        // })),
        podProperties,
        remark: "",
        shippingAddress: doc.shippingAddress?.address?.line1 || "",
        shippingAddress2: doc.shippingAddress?.address?.line2 || "",
        shippingCity: doc.shippingAddress?.address?.city || "",
        shippingCountry: doc.shippingAddress?.address?.country || "",
        shippingCountryCode: doc.shippingAddress?.address?.country || "",
        shippingCounty: doc.shippingAddress?.address?.city || "",
        shippingCustomerName: doc.shippingAddress?.name || "",
        shippingPhone: doc.shippingAddress?.phone || "+9999999999",
        shippingProvince: doc.shippingAddress?.address?.state || "",
        shippingZip: doc.shippingAddress?.address?.postal_code || "",
        taxId: "",
    });

    const orderResult = await payload.update({
        collection: "orders" as any,
        data: {
            orderStatus: "shipped",
        },
        where: {
            id: {
                equals: doc.orderId,
            },
        },
    });

    return {
        cjResult: result,
        orderResult,
    };
};
