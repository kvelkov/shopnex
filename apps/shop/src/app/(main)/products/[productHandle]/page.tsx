import type { Metadata } from "next";

import ProductTemplate from "@/templates/product";
import { payloadSdk } from "@/utils/payload-sdk";
import { notFound } from "next/navigation";

type ProductPageProps = {
    params: Promise<{ productHandle: string }>;
};

export async function generateMetadata(
    props: ProductPageProps
): Promise<Metadata> {
    const params = await props.params;
    const { productHandle } = params;

    const result = await payloadSdk.find({
        collection: "products",
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
                equals: productHandle,
            },
        },
    });

    if (!result.docs.length) {
        notFound();
    }

    const product = result.docs[0];

    return {
        description: product.meta?.title || `${product.title}`, // Fallback to title if no meta description
        openGraph: {
            description: product.meta?.description || `${product.title}`,
            title: product.meta?.title || `${product.title} | ShopNex`, // Fallback if no meta title
            // images: product.thumbnail ? [product.thumbnail] : [],
        },
        title: product.meta?.title || `${product.title} | ShopNex`,
    };
}

export default async function ProductPage(props: ProductPageProps) {
    const params = await props.params;

    const product = await payloadSdk.find({
        collection: "products",
        limit: 1,
        where: {
            handle: {
                equals: params.productHandle,
            },
        },
    });

    if (!product.docs.length) {
        notFound();
    }

    return <ProductTemplate product={product.docs[0]} />;
}
