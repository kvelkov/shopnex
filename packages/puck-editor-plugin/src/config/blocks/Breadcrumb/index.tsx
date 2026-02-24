import type { ComponentConfig } from "@puckeditor/core";

import React from "react";

import styles from "./styles.module.css";

export type BreadcrumbItem = {
    isActive?: boolean;
    text: string;
    url?: string;
};

export type BreadcrumbProps = {
    items: BreadcrumbItem[];
    separatorIcon: string;
    showSeparator: boolean;
    textColor: string;
    textSize: "large" | "normal" | "small";
};

export const Breadcrumb: ComponentConfig<BreadcrumbProps> = {
    defaultProps: {
        items: [
            { text: "Home", url: "/" },
            { text: "Library", url: "/library" },
            { isActive: true, text: "Data" },
        ],
        separatorIcon: "/",
        showSeparator: true,
        textColor: "#6c757d",
        textSize: "small",
    },
    fields: {
        items: {
            type: "array",
            arrayFields: {
                isActive: {
                    type: "radio",
                    label: "Is Active Item",
                    options: [
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                    ],
                },
                text: {
                    type: "text",
                    label: "Text",
                },
                url: {
                    type: "text",
                    label: "URL (leave empty for active item)",
                },
            },
            label: "Breadcrumb Items",
        },
        separatorIcon: {
            type: "text",
            label: "Separator Icon",
        },
        showSeparator: {
            type: "radio",
            label: "Show Separator",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        textColor: {
            type: "text",
            label: "Text Color",
        },
        textSize: {
            type: "select",
            label: "Text Size",
            options: [
                { label: "Small", value: "small" },
                { label: "Normal", value: "normal" },
                { label: "Large", value: "large" },
            ],
        },
    },
    label: "Breadcrumb",
    render: ({
        items,
        puck,
        separatorIcon,
        showSeparator,
        textColor,
        textSize,
    }) => {
        const getSizeClass = (size: string) => {
            const sizeMap = {
                large: styles.textLarge,
                normal: styles.textNormal,
                small: styles.textSmall,
            };
            return sizeMap[size as keyof typeof sizeMap] || styles.textSmall;
        };

        return (
            <nav
                aria-label="breadcrumb"
                className={`${styles.breadcrumbNav} ${getSizeClass(textSize)}`}
                style={{ color: textColor }}
            >
                <ol className={styles.breadcrumb}>
                    {items &&
                        items.length > 0 &&
                        items.map((item, index) => {
                            const isLast = index === items.length - 1;
                            const isActive = item.isActive || isLast;

                            return (
                                <li
                                    className={`${styles.breadcrumbItem} ${isActive ? styles.active : ""}`}
                                    key={index}
                                    {...(isActive
                                        ? { "aria-current": "page" }
                                        : {})}
                                >
                                    {item.url && !isActive ? (
                                        <a
                                            className={styles.breadcrumbLink}
                                            href={
                                                puck?.isEditing ? "#" : item.url
                                            }
                                            tabIndex={
                                                puck?.isEditing ? -1 : undefined
                                            }
                                        >
                                            {item.text}
                                        </a>
                                    ) : (
                                        <span className={styles.breadcrumbText}>
                                            {item.text}
                                        </span>
                                    )}

                                    {!isLast && showSeparator && (
                                        <span
                                            aria-hidden="true"
                                            className={styles.separator}
                                        >
                                            {separatorIcon}
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                </ol>
            </nav>
        );
    },
};
