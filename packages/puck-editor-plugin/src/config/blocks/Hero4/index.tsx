import type { ComponentConfig } from "@puckeditor/core";

import React from "react";

import styles from "./styles.module.css";

export type Hero4Props = {
    backgroundImage: string;
    primaryButtonHref: string;
    primaryButtonText: string;
    secondaryButtonHref: string;
    secondaryButtonText: string;
    title: string;
};

export const Hero4: ComponentConfig<Hero4Props> = {
    defaultProps: {
        backgroundImage:
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        primaryButtonHref: "https://www.vvveb.com",
        primaryButtonText: "Free Download",
        secondaryButtonHref: "https://www.vvveb.com",
        secondaryButtonText: "Live demo",
        title: "The next generation website builder",
    },
    fields: {
        backgroundImage: {
            type: "text",
            label: "Background Image URL",
        },
        primaryButtonHref: {
            type: "text",
            label: "Primary Button Link",
        },
        primaryButtonText: {
            type: "text",
            label: "Primary Button Text",
        },
        secondaryButtonHref: {
            type: "text",
            label: "Secondary Button Link",
        },
        secondaryButtonText: {
            type: "text",
            label: "Secondary Button Text",
        },
        title: {
            type: "text",
            contentEditable: true,
            label: "Title",
        },
    },
    label: "Hero 4 - Minimal Centered",
    render: ({
        backgroundImage,
        primaryButtonHref,
        primaryButtonText,
        puck,
        secondaryButtonHref,
        secondaryButtonText,
        title,
    }) => {
        return (
            <header className={`${styles.hero4} ${styles.overlay}`}>
                <div
                    className={styles.backgroundContainer}
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />

                <div className={styles.container}>
                    <div
                        className={`${styles.row} ${styles.alignItemsCenter} ${styles.justifyContentCenter} ${styles.textCenter}`}
                    >
                        <div className={styles.colLg8}>
                            <h1
                                className={`${styles.heading} ${styles.textWhite} ${styles.mb3}`}
                            >
                                {title}
                            </h1>
                            <div className={styles.buttons}>
                                <a
                                    className={`${styles.btn} ${styles.btnOutlineLight} ${styles.me4}`}
                                    href={
                                        puck?.isEditing
                                            ? "#"
                                            : primaryButtonHref
                                    }
                                    tabIndex={puck?.isEditing ? -1 : undefined}
                                >
                                    {primaryButtonText}
                                </a>
                                <a
                                    className={`${styles.btn} ${styles.textWhite} ${styles.me4}`}
                                    href={
                                        puck?.isEditing
                                            ? "#"
                                            : secondaryButtonHref
                                    }
                                    tabIndex={puck?.isEditing ? -1 : undefined}
                                >
                                    {secondaryButtonText}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.separatorBottom}>
                    <svg
                        className={styles.separatorSvg}
                        preserveAspectRatio="none"
                        viewBox="0 0 500 41"
                        width="100%"
                    >
                        <path
                            d="M0,185l125-26,33,17,58-12s54,19,55,19,50-11,50-11l56,6,60-8,63,15v15H0Z"
                            fill="white"
                            transform="translate(0 -159)"
                        />
                    </svg>
                </div>
            </header>
        );
    },
};
