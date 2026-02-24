import type { ComponentConfig, Slot } from "@puckeditor/core";

import React from "react";

import { withLayout } from "../../components/Layout";
import { Section } from "../../components/Section";
import getClassNameFactory from "../../utils/get-class-name-factory";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Grid", styles);

export type GridProps = {
    gap: number;
    items: Slot;
    numColumns: number;
};

export const GridInternal: ComponentConfig<GridProps> = {
    defaultProps: {
        gap: 24,
        items: [],
        numColumns: 4,
    },
    fields: {
        gap: {
            type: "number",
            label: "Gap",
            min: 0,
        },
        items: {
            type: "slot",
        },
        numColumns: {
            type: "number",
            label: "Number of columns",
            max: 12,
            min: 1,
        },
    },
    render: ({ gap, items: Items, numColumns }) => {
        return (
            <Section>
                <Items
                    className={getClassName()}
                    disallow={["Hero", "Stats"]}
                    style={{
                        gap,
                        gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
                    }}
                />
            </Section>
        );
    },
};

export const Grid = withLayout(GridInternal);
