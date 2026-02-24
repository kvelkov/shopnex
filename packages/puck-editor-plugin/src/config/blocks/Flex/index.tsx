import type { ComponentConfig, Slot } from "@puckeditor/core";

import React from "react";

import type { WithLayout} from "../../components/Layout";

import { withLayout } from "../../components/Layout";
import { Section } from "../../components/Section";
import getClassNameFactory from "../../utils/get-class-name-factory";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Flex", styles);

export type FlexProps = WithLayout<{
    direction: "column" | "row";
    gap: number;
    items: Slot;
    justifyContent: "center" | "end" | "start";
    wrap: "nowrap" | "wrap";
}>;

const FlexInternal: ComponentConfig<FlexProps> = {
    defaultProps: {
        direction: "row",
        gap: 24,
        items: [],
        justifyContent: "start",
        layout: {
            grow: true,
        },
        wrap: "wrap",
    },
    fields: {
        direction: {
            type: "radio",
            label: "Direction",
            options: [
                { label: "Row", value: "row" },
                { label: "Column", value: "column" },
            ],
        },
        gap: {
            type: "number",
            label: "Gap",
            min: 0,
        },
        items: {
            type: "slot",
        },
        justifyContent: {
            type: "radio",
            label: "Justify Content",
            options: [
                { label: "Start", value: "start" },
                { label: "Center", value: "center" },
                { label: "End", value: "end" },
            ],
        },
        wrap: {
            type: "radio",
            label: "Wrap",
            options: [
                { label: "true", value: "wrap" },
                { label: "false", value: "nowrap" },
            ],
        },
    },
    render: ({ direction, gap, items: Items, justifyContent, wrap }) => {
        return (
            <Section style={{ height: "100%" }}>
                <Items
                    className={getClassName()}
                    disallow={["Hero", "Stats"]}
                    style={{
                        flexDirection: direction,
                        flexWrap: wrap,
                        gap,
                        justifyContent,
                    }}
                />
            </Section>
        );
    },
};

export const Flex = withLayout(FlexInternal);
