import type { UserConfig } from "../types/user-config";

import { Breadcrumb } from "./blocks/Breadcrumb";
import { Button } from "./blocks/Button";
import { Card } from "./blocks/Card";
import { Flex } from "./blocks/Flex";
import { Footer } from "./blocks/Footer";
import { Grid } from "./blocks/Grid";
import { Heading } from "./blocks/Heading";
import { Hero1 } from "./blocks/Hero1";
import { Hero2 } from "./blocks/Hero2";
import { Hero3 } from "./blocks/Hero3";
import { Hero4 } from "./blocks/Hero4";
import { Hero5 } from "./blocks/Hero5";
import { Logos } from "./blocks/Logos";
import { NavBar } from "./blocks/NavBar";
import { ProductDetails } from "./blocks/ProductDetails";
import { ProductsGrid1 } from "./blocks/ProductsGrid1";
import { Space } from "./blocks/Space";
import { Stats } from "./blocks/Stats";
import { Text } from "./blocks/Text";
import { TopHeader } from "./blocks/TopHeader";
import Root from "./root";

export const clientConfig: UserConfig = {
    categories: {
        ecommerce: {
            components: ["ProductsGrid1", "ProductDetails"],
            title: "E-commerce",
        },
        heroes: {
            components: ["Hero1", "Hero2", "Hero3", "Hero4", "Hero5"],
            title: "Heroes",
        },
        interactive: {
            components: ["Button"],
            title: "Actions",
        },
        layout: {
            components: ["Grid", "Flex", "Space"],
        },
        navigation: {
            components: ["TopHeader", "NavBar", "Footer", "Breadcrumb"],
            title: "Navigation",
        },
        other: {
            components: ["Card", "Logos", "Stats"],
            title: "Other",
        },
        typography: {
            components: ["Heading", "Text"],
        },
    },
    components: {
        Breadcrumb,
        Button,
        Card,
        Flex,
        Footer,
        Grid,
        Heading,
        Hero1,
        Hero2,
        Hero3,
        Hero4,
        Hero5,
        Logos,
        NavBar,
        ProductDetails,
        ProductsGrid1,
        Space,
        Stats,
        Text,
        TopHeader,
    },
    root: Root,
};
