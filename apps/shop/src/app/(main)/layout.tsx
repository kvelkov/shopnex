import type { Metadata } from "next";

import { getStoreSettings } from "@/services/store-settings";
import Footer from "@/templates/footer";
import Nav from "@/templates/nav";

export const metadata: Metadata = {
    description:
        "A performant frontend ecommerce starter template with Payload and Shopnex.",
    title: "Shopnex Payload CMS Starter Template",
};

export default async function PageLayout(props: { children: React.ReactNode }) {
    const storeSettings = await getStoreSettings();
    return (
        <>
            <Nav storeSettings={storeSettings} />
            {props.children}
            <Footer storeSettings={storeSettings} />
        </>
    );
}
