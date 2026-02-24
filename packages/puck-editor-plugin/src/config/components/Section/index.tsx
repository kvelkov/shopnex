import type { CSSProperties, ReactNode } from "react";

import { forwardRef } from "react";

import getClassNameFactory from "../../utils/get-class-name-factory";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Section", styles);

export type SectionProps = {
    children: ReactNode;
    className?: string;
    maxWidth?: string;
    style?: CSSProperties;
};

export const Section = ({ children, className, maxWidth = "1280px", ref, style = {} }: { ref?: React.RefObject<HTMLDivElement | null> } & SectionProps) => {
        return (
            <div
                className={`${getClassName()}${className ? ` ${className}` : ""}`}
                ref={ref}
                style={{
                    ...style,
                }}
            >
                <div className={getClassName("inner")} style={{ maxWidth }}>
                    {children}
                </div>
            </div>
        );
    };
