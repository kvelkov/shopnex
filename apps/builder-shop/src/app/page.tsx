import _ from "lodash";

import { getTopCollections } from "@/services/collections";
import { getProducts } from "@/services/products";
import { BuilderPage } from "./components/BuilderPage";

export const revalidate = 60;

const HomePage = async () => {
    const products = await getProducts().catch(() => []);
    const collections = await getTopCollections().catch(() => []);
    const mappedCollections = collections.map((collection) => ({
        imageUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}${collection.imageUrl}`,
        ...collection,
    }));
    const mappedProducts = products.map((product) => {
        const imageUrl =
            _.get(product, "variants[0].gallery[0].url") ||
            _.get(product, "variants[0].imageUrl");
        const formattedImageUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}${imageUrl}`;
        return {
            ...product,
            category: "Category 1",
            description: _.get(product, "collections[0].title"),
            image: formattedImageUrl,
            originalPrice: product.variants[0].originalPrice,
            pageUrl: `/products/${product.handle}`,
            price: product.variants[0].price,
        };
    });

    return (
        <BuilderPage
            data={{
                collections: mappedCollections,
                products: mappedProducts,
            }}
            page={[""]}
        />
    );
};

export default HomePage;
