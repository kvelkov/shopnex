import type { ComponentConfig } from "@puckeditor/core";

import React from "react";

import type { WithLayout} from "../../components/Layout";
import type { HeadingProps as _HeadingProps } from "./Heading";

import { withLayout } from "../../components/Layout";
import { Section } from "../../components/Section";
import { Heading as _Heading } from "./Heading";

export type HeadingProps = WithLayout<{
    align: "center" | "left" | "right";
    level?: _HeadingProps["rank"];
    size: _HeadingProps["size"];
    text?: string;
}>;

const sizeOptions = [
    { label: "XXXL", value: "xxxl" },
    { label: "XXL", value: "xxl" },
    { label: "XL", value: "xl" },
    { label: "L", value: "l" },
    { label: "M", value: "m" },
    { label: "S", value: "s" },
    { label: "XS", value: "xs" },
];

const levelOptions = [
    { label: "", value: "" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
];

const HeadingInternal: ComponentConfig<HeadingProps> = {
    defaultProps: {
        align: "left",
        layout: {
            padding: "8px",
        },
        size: "m",
        text: "Heading",
    },
    fields: {
        align: {
            type: "radio",
            options: [
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" },
            ],
        },
        level: {
            type: "select",
            options: levelOptions,
        },
        size: {
            type: "select",
            options: sizeOptions,
        },
        text: {
            type: "textarea",
            contentEditable: true,
        },
    },
    render: ({ align, level, size, text }) => {
        return (
            <Section>
                <_Heading rank={level as any} size={size}>
                    <span
                        style={{
                            display: "block",
                            textAlign: align,
                            width: "100%",
                        }}
                    >
                        {text}
                    </span>
                </_Heading>
            </Section>
        );
    },
};

export const Heading = withLayout(HeadingInternal);
