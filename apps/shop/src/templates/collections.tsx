import type { SortOptions } from "@/utils/sort-options";
import type { Collection } from "@shopnex/types";

import RefinementList from "@/components/refinement-list";
import SkeletonProductGrid from "@/components/skeleton-product-grid";
import { Suspense } from "react";

import PaginatedProducts from "./paginated-product";

export default function CollectionTemplate({
    collection,
    page,
    sortBy,
}: {
    collection: Collection;
    page?: string;
    sortBy?: SortOptions;
}) {
    const pageNumber = page ? Number.parseInt(page) : 1;
    const sort = sortBy || "created_at";

    return (
        <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
            <RefinementList sortBy={sort} />
            <div className="w-full">
                <div className="mb-8 text-2xl-semi">
                    <h1>{collection.title}</h1>
                    {collection.description && (
                        <div
                            className="mt-4 text-base text-ui-fg-subtle prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: collection.description }}
                        />
                    )}
                </div>
                <Suspense
                    fallback={
                        <SkeletonProductGrid
                            numberOfProducts={collection.products?.docs?.length}
                        />
                    }
                >
                    <PaginatedProducts
                        collectionId={collection.id}
                        page={pageNumber}
                        products={collection.products?.docs as any}
                        sortBy={sort}
                    />
                </Suspense>
            </div>
        </div>
    );
}
