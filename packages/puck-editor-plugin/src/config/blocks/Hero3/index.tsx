import type { ComponentConfig } from "@puckeditor/core";

import React from "react";

import styles from "./styles.module.css";

export type Hero3Props = {
    backgroundImage: string;
    overlayOpacity: number;
    primaryButtonHref: string;
    primaryButtonText: string;
    secondaryButtonHref: string;
    secondaryButtonText: string;
    subtitle: string;
    title: string;
};

export const Hero3: ComponentConfig<Hero3Props> = {
    defaultProps: {
        backgroundImage:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
        overlayOpacity: 0.7,
        primaryButtonHref: "https://www.vvveb.com",
        primaryButtonText: "Free Download",
        secondaryButtonHref: "https://www.vvveb.com",
        secondaryButtonText: "Live Demo",
        subtitle:
            "Powerful and easy to use drag and drop website builder for blogs,\npresentation or ecommerce stores.",
        title: "The next generation website builder",
    },
    fields: {
        backgroundImage: {
            type: "text",
            label: "Background Image URL",
        },
        overlayOpacity: {
            type: "number",
            label: "Overlay Opacity (0-1)",
            max: 1,
            min: 0,
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
        subtitle: {
            type: "textarea",
            contentEditable: true,
            label: "Subtitle",
        },
        title: {
            type: "text",
            contentEditable: true,
            label: "Title",
        },
    },
    label: "Hero 3 - Centered with Background",
    render: ({
        backgroundImage,
        overlayOpacity,
        primaryButtonHref,
        primaryButtonText,
        puck,
        secondaryButtonHref,
        secondaryButtonText,
        subtitle,
        title,
    }) => {
        return (
            <header className={styles.hero3}>
                <div
                    className={styles.backgroundContainer}
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
                <div
                    className={styles.overlay}
                    style={{ opacity: overlayOpacity }}
                />

                <div className={styles.container}>
                    <div
                        className={`${styles.row} ${styles.alignItemsCenter} ${styles.justifyContentCenter} ${styles.textCenter}`}
                    >
                        <div className={styles.colLg12}>
                            <h1
                                className={`${styles.heading} ${styles.textWhite} ${styles.mb3}`}
                            >
                                {title}
                            </h1>
                            <h3 className={styles.textWhite}>
                                {typeof subtitle === "string"
                                    ? subtitle
                                          .split("\n")
                                          .map((line, index) => (
                                              <React.Fragment key={index}>
                                                  {line}
                                                  {index <
                                                      subtitle.split("\n")
                                                          .length -
                                                          1 && <br />}
                                              </React.Fragment>
                                          ))
                                    : null}
                            </h3>

                            <div className={styles.buttons}>
                                <a
                                    className={`${styles.btn} ${styles.btnPrimary} ${styles.textWhite} ${styles.me4}`}
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
                                    className={`${styles.btn} ${styles.btnWhite} ${styles.textWhite}`}
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
                        fill="white"
                        height="250"
                        preserveAspectRatio="none"
                        viewBox="0 0 500 41"
                        width="100%"
                    >
                        <path
                            d="M0,185l125-26,33,17,58-12s54,19,55,19,50-11,50-11l56,6,60-8,63,15v15H0Z"
                            transform="translate(0 -159)"
                        />
                    </svg>
                </div>
            </header>
        );
    },
};
