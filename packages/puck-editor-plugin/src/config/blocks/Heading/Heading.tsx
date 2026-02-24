import type { ReactNode } from "react";

import getClassNameFactory from "../../utils/get-class-name-factory";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Heading", styles);

export type HeadingProps = {
    children: ReactNode;
    rank?: "1" | "2" | "3" | "4" | "5" | "6";
    size?: "l" | "m" | "s" | "xl" | "xs" | "xxl" | "xxxl" | "xxxxl";
};

export const Heading = ({ children, rank, size = "m" }: HeadingProps) => {
    const Tag: any = rank ? `h${rank}` : "span";

    return (
        <Tag
            className={getClassName({
                [size]: true,
            })}
        >
            {children}
        </Tag>
    );
};
