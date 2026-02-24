import type {
    ComponentConfig,
    DefaultComponentProps,
    ObjectField,
} from "@puckeditor/core";
import type { CSSProperties, ReactNode } from "react";

import { forwardRef } from "react";

import { spacingOptions } from "../../options";
import getClassNameFactory from "../../utils/get-class-name-factory";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Layout", styles);

type LayoutFieldProps = {
    grow?: boolean;
    padding?: string;
    spanCol?: number;
    spanRow?: number;
};

export type WithLayout<Props extends DefaultComponentProps> = {
    layout?: LayoutFieldProps;
} & Props;

type LayoutProps = WithLayout<{
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}>;

export const layoutField: ObjectField<LayoutFieldProps> = {
    type: "object",
    objectFields: {
        grow: {
            type: "radio",
            label: "Flex Grow",
            options: [
                { label: "true", value: true },
                { label: "false", value: false },
            ],
        },
        padding: {
            type: "select",
            label: "Vertical Padding",
            options: [{ label: "0px", value: "0px" }, ...spacingOptions],
        },
        spanCol: {
            type: "number",
            label: "Grid Columns",
            max: 12,
            min: 1,
        },
        spanRow: {
            type: "number",
            label: "Grid Rows",
            max: 12,
            min: 1,
        },
    },
};

const Layout = ({ children, className, layout, ref, style }: { ref?: React.RefObject<HTMLDivElement | null> } & LayoutProps) => {
        return (
            <div
                className={className}
                ref={ref}
                style={{
                    flex: layout?.grow ? "1 1 0" : undefined,
                    gridColumn: layout?.spanCol
                        ? `span ${Math.max(Math.min(layout.spanCol, 12), 1)}`
                        : undefined,
                    gridRow: layout?.spanRow
                        ? `span ${Math.max(Math.min(layout.spanRow, 12), 1)}`
                        : undefined,
                    paddingBottom: layout?.padding,
                    paddingTop: layout?.padding,
                    ...style,
                }}
            >
                {children}
            </div>
        );
    };

Layout.displayName = "Layout";

export { Layout };

export function withLayout<
    ThisComponentConfig extends ComponentConfig<any> = ComponentConfig,
>(componentConfig: ThisComponentConfig): ThisComponentConfig {
    return {
        ...componentConfig,
        defaultProps: {
            ...componentConfig.defaultProps,
            layout: {
                grow: false,
                padding: "0px",
                spanCol: 1,
                spanRow: 1,
                ...componentConfig.defaultProps?.layout,
            },
        },
        fields: {
            ...componentConfig.fields,
            layout: layoutField,
        },
        inline: true,
        render: (props) => (
            <Layout
                className={getClassName()}
                layout={props.layout as LayoutFieldProps}
                ref={props.puck.dragRef}
            >
                {componentConfig.render(props)}
            </Layout>
        ),
        resolveFields: (_, params) => {
            if (params.parent?.type === "Grid") {
                return {
                    ...componentConfig.fields,
                    layout: {
                        ...layoutField,
                        objectFields: {
                            padding: layoutField.objectFields.padding,
                            spanCol: layoutField.objectFields.spanCol,
                            spanRow: layoutField.objectFields.spanRow,
                        },
                    },
                };
            }
            if (params.parent?.type === "Flex") {
                return {
                    ...componentConfig.fields,
                    layout: {
                        ...layoutField,
                        objectFields: {
                            grow: layoutField.objectFields.grow,
                            padding: layoutField.objectFields.padding,
                        },
                    },
                };
            }

            return {
                ...componentConfig.fields,
                layout: {
                    ...layoutField,
                    objectFields: {
                        padding: layoutField.objectFields.padding,
                    },
                },
            };
        },
    };
}
