import type { ComponentConfig } from "@puckeditor/core";

import { Button as _Button } from "@puckeditor/core";
import React from "react";

export type ButtonProps = {
    href: string;
    label: string;
    variant: "primary" | "secondary";
};

export const Button: ComponentConfig<ButtonProps> = {
    defaultProps: {
        href: "#",
        label: "Button",
        variant: "primary",
    },
    fields: {
        href: { type: "text" },
        label: {
            type: "text",
            contentEditable: true,
            placeholder: "Lorem ipsum...",
        },

        variant: {
            type: "radio",
            options: [
                { label: "primary", value: "primary" },
                { label: "secondary", value: "secondary" },
            ],
        },
    },
    label: "Button",
    render: ({ href, label, puck, variant }) => {
        return (
            <div>
                <_Button
                    href={puck.isEditing ? "#" : href}
                    size="large"
                    tabIndex={puck.isEditing ? -1 : undefined}
                    variant={variant}
                >
                    {label}
                </_Button>
            </div>
        );
    },
};
