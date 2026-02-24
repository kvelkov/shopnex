import type { ComponentConfig } from "@puckeditor/core";

import React from "react";

import { Section } from "../../components/Section";
import getClassNameFactory from "../../utils/get-class-name-factory";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Logos", styles);

export type LogosProps = {
    logos: {
        alt: string;
        imageUrl: string;
    }[];
};

export const Logos: ComponentConfig<LogosProps> = {
    defaultProps: {
        logos: [
            {
                alt: "google",
                imageUrl:
                    "https://logolook.net/wp-content/uploads/2021/06/Google-Logo.png",
            },
            {
                alt: "google",
                imageUrl:
                    "https://logolook.net/wp-content/uploads/2021/06/Google-Logo.png",
            },
            {
                alt: "google",
                imageUrl:
                    "https://logolook.net/wp-content/uploads/2021/06/Google-Logo.png",
            },
            {
                alt: "google",
                imageUrl:
                    "https://logolook.net/wp-content/uploads/2021/06/Google-Logo.png",
            },
            {
                alt: "google",
                imageUrl:
                    "https://logolook.net/wp-content/uploads/2021/06/Google-Logo.png",
            },
        ],
    },
    fields: {
        logos: {
            type: "array",
            arrayFields: {
                alt: { type: "text" },
                imageUrl: { type: "text" },
            },
            defaultItemProps: {
                alt: "",
                imageUrl: "",
            },
            getItemSummary: (item, i) => item.alt || `Feature #${i}`,
        },
    },
    render: ({ logos }) => {
        return (
            <Section className={getClassName()}>
                <div className={getClassName("items")}>
                    {logos.map((item, i) => (
                        <div className={getClassName("item")} key={i}>
                            <img
                                alt={item.alt}
                                className={getClassName("image")}
                                height={64}
                                src={item.imageUrl}
                            ></img>
                        </div>
                    ))}
                </div>
            </Section>
        );
    },
};
