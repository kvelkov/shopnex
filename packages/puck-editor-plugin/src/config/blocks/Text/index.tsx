import type { ComponentConfig } from "@puckeditor/core";

import { ALargeSmall, AlignLeft } from "lucide-react";
import React from "react";

import type { WithLayout} from "../../components/Layout";

import { withLayout } from "../../components/Layout";
import { Section } from "../../components/Section";

export type TextProps = WithLayout<{
    align: "center" | "left" | "right";
    color: "default" | "muted";
    maxWidth?: string;
    padding?: string;
    size?: "m" | "s";
    text?: string;
}>;

const TextInner: ComponentConfig<TextProps> = {
    defaultProps: {
        align: "left",
        color: "default",
        size: "m",
        text: "Text",
    },
    fields: {
        align: {
            type: "radio",
            labelIcon: <AlignLeft size={16} />,
            options: [
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" },
            ],
        },
        color: {
            type: "radio",
            options: [
                { label: "Default", value: "default" },
                { label: "Muted", value: "muted" },
            ],
        },
        maxWidth: { type: "text" },
        size: {
            type: "select",
            labelIcon: <ALargeSmall size={16} />,
            options: [
                { label: "S", value: "s" },
                { label: "M", value: "m" },
            ],
        },
        text: {
            type: "textarea",
            contentEditable: true,
        },
    },
    render: ({ align, color, maxWidth, size, text }) => {
        return (
            <Section maxWidth={maxWidth}>
                <span
                    style={{
                        color:
                            color === "default"
                                ? "inherit"
                                : "var(--puck-color-grey-05)",
                        display: "flex",
                        fontSize: size === "m" ? "20px" : "16px",
                        fontWeight: 300,
                        justifyContent:
                            align === "center"
                                ? "center"
                                : align === "right"
                                  ? "flex-end"
                                  : "flex-start",
                        maxWidth,
                        textAlign: align,
                        width: "100%",
                    }}
                >
                    {text}
                </span>
            </Section>
        );
    },
};

export const Text = withLayout(TextInner);
