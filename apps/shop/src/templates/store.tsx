import type { SortOptions } from "@/utils/sort-options";
import type { Product } from "@shopnex/types";

import RefinementList from "@/components/refinement-list";
import SkeletonProductGrid from "@/components/skeleton-product-grid";
import { Suspense } from "react";

import PaginatedProducts from "./paginated-product";

const StoreTemplate = ({
    collectionId,
    page,
    products,
    productsIds,
    sortBy,
    totalPages,
}: {
    collectionId?: string;
    page?: string;
    products: Product[];
    productsIds?: string[];
    sortBy?: SortOptions;
    totalPages: number;
}) => {
    const pageNumber = page ? Number.parseInt(page) : 1;
    const sort = sortBy || "created_at";

    return (
        <div
            className="flex flex-col small:flex-row small:items-start py-6 content-container"
            data-testid="category-container"
        >
            <RefinementList sortBy={sort} />
            <div className="w-full">
                <div className="mb-8 text-2xl-semi">
                    <h1 data-testid="store-page-title">All products</h1>
                </div>
                <Suspense fallback={<SkeletonProductGrid />}>
                    <PaginatedProducts
                        page={pageNumber}
                        products={products}
                        productsIds={productsIds}
                        sortBy={sort}
                    />
                </Suspense>
            </div>
        </div>
    );
};

export default StoreTemplate;
