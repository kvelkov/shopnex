import type { Config, Data } from "@puckeditor/core";

import type { BreadcrumbProps } from "../config/blocks/Breadcrumb";
import type { ButtonProps } from "../config/blocks/Button";
import type { CardProps } from "../config/blocks/Card";
import type { FlexProps } from "../config/blocks/Flex";
import type { FooterProps } from "../config/blocks/Footer";
import type { GridProps } from "../config/blocks/Grid";
import type { HeadingProps } from "../config/blocks/Heading";
import type { Hero1Props } from "../config/blocks/Hero1";
import type { Hero2Props } from "../config/blocks/Hero2";
import type { Hero3Props } from "../config/blocks/Hero3";
import type { Hero4Props } from "../config/blocks/Hero4";
import type { Hero5Props } from "../config/blocks/Hero5";
import type { LogosProps } from "../config/blocks/Logos";
import type { NavBarProps } from "../config/blocks/NavBar";
import type { ProductDetailsProps } from "../config/blocks/ProductDetails";
import type { ProductsGrid1Props } from "../config/blocks/ProductsGrid1";
import type { SpaceProps } from "../config/blocks/Space";
import type { StatsProps } from "../config/blocks/Stats";
import type { TextProps } from "../config/blocks/Text";
import type { TopHeaderProps } from "../config/blocks/TopHeader";
import type { RootProps } from "../config/root";

export type Components = {
    Breadcrumb: BreadcrumbProps;
    Button: ButtonProps;
    Card: CardProps;
    Flex: FlexProps;
    Footer: FooterProps;
    Grid: GridProps;
    Heading: HeadingProps;
    Hero1: Hero1Props;
    Hero2: Hero2Props;
    Hero3: Hero3Props;
    Hero4: Hero4Props;
    Hero5: Hero5Props;
    Logos: LogosProps;
    NavBar: NavBarProps;
    ProductDetails: ProductDetailsProps;
    ProductsGrid1: ProductsGrid1Props;
    Space: SpaceProps;
    Stats: StatsProps;
    Text: TextProps;
    TopHeader: TopHeaderProps;
};

export type UserConfig = Config<{
    categories: [
        "navigation",
        "heroes",
        "ecommerce",
        "layout",
        "typography",
        "interactive",
    ];
    components: Components;
    fields: {
        description: {
            label: string;
            type: "text";
        };
        title: {
            label: string;
            type: "text";
        };
        userField: {
            option: boolean;
            type: "userField";
        };
    };
    root: RootProps;
}>;

export type UserData = Data<Components, RootProps>;
