import type { SortOptions } from "@/utils/sort-options";
import type { Metadata } from "next";

import { getPaginatedProducts } from "@/services/products";
import StoreTemplate from "@/templates/store";
import decimal from "decimal.js";

export const metadata: Metadata = {
    description: "Explore all of our products.",
    title: "Store",
};

type Params = {
    params: Promise<{
        countryCode: string;
    }>;
    searchParams: Promise<{
        collectionId?: string;
        page?: string;
        productsIds?: string[];
        sortBy?: SortOptions;
    }>;
};

export default async function StorePage(props: Params) {
    const searchParams = await props.searchParams;
    const { collectionId, page, productsIds, sortBy } = searchParams;

    const { docs: products, total } = await getPaginatedProducts({
        collectionId,
        limit: 12,
        page: Number(page || 1),
        productsIds,
    });

    const sortedProducts = products.sort((a, b) => {
        const [sortName, sortDirection] = sortBy?.split("_") || [];
        if (sortName === "createdAt") {
            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
        }
        if (sortName === "price") {
            return (
                new decimal(b.variants[0].price)
                    .sub(new decimal(a.variants[0].price))
                    .toNumber() * (sortDirection === "asc" ? 1 : -1)
            );
        }
        return 0;
    });

    return (
        <StoreTemplate
            collectionId={collectionId}
            page={page}
            products={sortedProducts}
            productsIds={productsIds}
            sortBy={sortBy}
            totalPages={total}
        />
    );
}
