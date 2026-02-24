import type { Payment } from "@shopnex/types";
import type { PaginatedDocs, PayloadRequest } from "payload";

export const getStripeBlock = async ({
    req,
    shopId,
}: {
    req: PayloadRequest;
    shopId: number;
}) => {
    const paymentsDocument = (await req.payload.find({
        collection: "payments",
        where: {
            shop: {
                equals: shopId,
            },
        },
    }));

    const stripeBlock = paymentsDocument.docs[0]?.providers?.find(
        (provider: any) => provider.blockType === "stripe"
    );
    if (stripeBlock?.blockType === "stripe") {
        return stripeBlock;
    }
};
