import type { ComponentConfig } from "@puckeditor/core";

import React from "react";

import { spacingOptions } from "../../options";
import getClassNameFactory from "../../utils/get-class-name-factory";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Space", styles);

export type SpaceProps = {
    direction?: "" | "horizontal" | "vertical";
    size: string;
};

export const Space: ComponentConfig<SpaceProps> = {
    defaultProps: {
        direction: "",
        size: "24px",
    },
    fields: {
        direction: {
            type: "radio",
            options: [
                { label: "Vertical", value: "vertical" },
                { label: "Horizontal", value: "horizontal" },
                { label: "Both", value: "" },
            ],
        },
        size: {
            type: "select",
            options: spacingOptions,
        },
    },
    inline: true,
    label: "Space",
    render: ({ direction, puck, size }) => {
        return (
            <div
                className={getClassName(
                    direction ? { [direction]: direction } : {}
                )}
                ref={puck.dragRef}
                style={{ "--size": size } as any}
            />
        );
    },
};
