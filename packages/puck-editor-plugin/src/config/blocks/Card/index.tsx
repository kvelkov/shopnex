import type { ComponentConfig } from "@puckeditor/core";
import type { ReactElement } from "react";

import dynamicIconImports from "lucide-react/dynamicIconImports";
import dynamic from "next/dynamic";
import React from "react";

import type { WithLayout } from "../../components/Layout";

import { withLayout } from "../../components/Layout";
import getClassNameFactory from "../../utils/get-class-name-factory";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Card", styles);

const icons = Object.keys(dynamicIconImports).reduce<
    Record<string, ReactElement>
>((acc, iconName) => {
    const El = dynamic((dynamicIconImports as any)[iconName]);

    return {
        ...acc,
        [iconName]: <El />,
    };
}, {});

const iconOptions = Object.keys(dynamicIconImports).map((iconName) => ({
    label: iconName,
    value: iconName,
}));

export type CardProps = WithLayout<{
    description: string;
    icon?: string;
    mode: "card" | "flat";
    title: string;
}>;

const CardInner: ComponentConfig<CardProps> = {
    defaultProps: {
        description: "Description",
        icon: "Feather",
        mode: "flat",
        title: "Title",
    },
    fields: {
        description: {
            type: "textarea",
            contentEditable: true,
        },
        icon: {
            type: "select",
            options: iconOptions,
        },
        mode: {
            type: "radio",
            options: [
                { label: "card", value: "card" },
                { label: "flat", value: "flat" },
            ],
        },
        title: {
            type: "text",
            contentEditable: true,
        },
    },
    render: ({ description, icon, mode, title }) => {
        return (
            <div className={getClassName({ [mode]: mode })}>
                <div className={getClassName("inner")}>
                    <div className={getClassName("icon")}>
                        {icon && icons[icon]}
                    </div>

                    <div className={getClassName("title")}>{title}</div>
                    <div className={getClassName("description")}>
                        {description}
                    </div>
                </div>
            </div>
        );
    },
};

export const Card = withLayout(CardInner);
