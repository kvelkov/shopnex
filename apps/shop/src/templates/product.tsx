"use client";

import type { Product } from "@shopnex/types";
import type React from "react";

import ImageGallery from "@/components/products/image-gallery/image-gallery";
import ProductActions from "@/components/products/product-actions/product-actions";
import ProductTabs from "@/components/products/product-tabs/product-tabs";
import { getVariantImage } from "@/utils/get-variant-image";
import { notFound } from "next/navigation";
import { useState } from "react";

import ProductInfo from "./product-info";

type ProductTemplateProps = {
    product: Product;
};

const ProductTemplate: React.FC<ProductTemplateProps> = ({ product }) => {
    const [selectedOptions, setSelectedOptions] = useState<
        Record<string, string>
    >({});
    const selectedVariant =
        product.variants?.find((variant) =>
            variant.options?.every(
                (opt) => selectedOptions[opt.option] === opt.value
            )
        ) || product.variants[0];
    if (!product || !product.id) {
        return notFound();
    }

    return (
        <>
            <div
                className="content-container flex flex-col small:flex-row small:items-start py-6 relative"
                data-testid="product-container"
            >
                <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
                    <ProductInfo product={product} />
                    <ProductTabs product={product} />
                </div>
                <div className="block w-full relative">
                    <ImageGallery
                        thumbnail={getVariantImage(selectedVariant)}
                    />
                </div>
                <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
                    <ProductActions
                        product={product}
                        selectedOptions={selectedOptions}
                        setSelectedOptions={setSelectedOptions}
                    />
                </div>
            </div>
            {/* <div className="content-container my-16 small:my-32" data-testid="related-products-container">
        <Suspense fallback={null}>
          <RelatedProducts product={product} />
        </Suspense>
      </div> */}
        </>
    );
};

export default ProductTemplate;
