import type { ComponentConfig } from "@puckeditor/core";

import React from "react";

import { Section } from "../../components/Section";
import getClassNameFactory from "../../utils/get-class-name-factory";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Stats", styles);

export type StatsProps = {
    items: {
        description: string;
        title: string;
    }[];
};

export const Stats: ComponentConfig<StatsProps> = {
    defaultProps: {
        items: [
            {
                description: "1,000",
                title: "Stat",
            },
        ],
    },
    fields: {
        items: {
            type: "array",
            arrayFields: {
                description: {
                    type: "text",
                    contentEditable: true,
                },
                title: {
                    type: "text",
                    contentEditable: true,
                },
            },
            defaultItemProps: {
                description: "1,000",
                title: "Stat",
            },
            getItemSummary: (item, i) => item.title || `Feature #${i}`,
        },
    },
    render: ({ items }) => {
        return (
            <Section className={getClassName()} maxWidth={"916px"}>
                <div className={getClassName("items")}>
                    {items.map((item, i) => (
                        <div className={getClassName("item")} key={i}>
                            <div className={getClassName("label")}>
                                {item.title}
                            </div>
                            <div className={getClassName("value")}>
                                {item.description}
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        );
    },
};
