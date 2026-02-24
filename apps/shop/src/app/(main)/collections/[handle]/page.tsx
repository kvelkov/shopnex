import type { SortOptions } from "@/utils/sort-options";
import type { Metadata } from "next";

import CollectionTemplate from "@/templates/collections";
import { payloadSdk } from "@/utils/payload-sdk";
import { notFound } from "next/navigation";

type CollectionsPageProps = {
    params: Promise<{ handle: string }>;
    searchParams: Promise<{
        page?: string;
        sortBy?: SortOptions;
    }>;
};

export async function generateMetadata(
    props: CollectionsPageProps
): Promise<Metadata> {
    const params = await props.params;
    const { handle } = params;

    // Fetch the collection metadata
    const result = await payloadSdk.find({
        collection: "collections",
        limit: 1,
        select: {
            meta: {
                description: true,
                title: true,
            },
            title: true,
        },
        where: {
            handle: {
                equals: handle,
            },
        },
    });

    if (!result.docs.length) {
        notFound();
    }

    const collection = result.docs[0];

    return {
        description: collection.meta?.description || `${collection.title}`, // Fallback to title if no meta description
        openGraph: {
            description: collection.meta?.description || `${collection.title}`,
            title: collection.meta?.title || `${collection.title} | ShopNex`, // Fallback if no meta title
            // images: collection.thumbnail ? [collection.thumbnail] : [],
        },
        title: collection.meta?.title || `${collection.title} | ShopNex`,
    };
}

export default async function CollectionPage(props: CollectionsPageProps) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const { page, sortBy } = searchParams;

    const collectionData = await payloadSdk.find({
        collection: "collections",
        depth: 10,
        sort: "createdAt",
        where: {
            handle: {
                equals: params.handle,
            },
        },
    });

    const collection = collectionData.docs[0];

    if (!collection) {
        notFound();
    }

    return (
        <CollectionTemplate
            collection={collection}
            page={page}
            sortBy={sortBy}
        />
    );
}
