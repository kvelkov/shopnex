import type { ComponentConfig } from "@puckeditor/core";

import React from "react";

import styles from "./styles.module.css";

export type Hero1Props = {
    backgroundColor: string;
    disclaimerText: string;
    mainTitle: string;
    primaryButtonHref: string;
    primaryButtonText: string;
    secondaryButtonHref: string;
    secondaryButtonText: string;
    subtitle: string;
};

export const Hero1: ComponentConfig<Hero1Props> = {
    defaultProps: {
        backgroundColor: "#f8f9fa",
        disclaimerText: "* Note: Early Alpha Preview",
        mainTitle: "Open Source CMS\nReinvented",
        primaryButtonHref: "/download.php",
        primaryButtonText: "⚡ Free download ›",
        secondaryButtonHref: "//demo.vvveb.com",
        secondaryButtonText: "Live demo →",
        subtitle:
            "Powerful and easy to use drag and drop builder for blogs, websites or ecommerce stores.",
    },
    fields: {
        backgroundColor: {
            type: "text",
            label: "Background Color",
        },
        disclaimerText: {
            type: "text",
            label: "Disclaimer Text",
        },
        mainTitle: {
            type: "textarea",
            contentEditable: true,
            label: "Main Title",
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
    },
    label: "Hero 1 - Simple CTA",
    render: ({
        backgroundColor,
        disclaimerText,
        mainTitle,
        primaryButtonHref,
        primaryButtonText,
        puck,
        secondaryButtonHref,
        secondaryButtonText,
        subtitle,
    }) => {
        return (
            <header className={styles.hero1} style={{ backgroundColor }}>
                <div className={styles.heading}>
                    <h1>{mainTitle}</h1>

                    <h2>{subtitle}</h2>

                    <div className={styles.btns}>
                        <a
                            className={`${styles.btn} ${styles.btnLg} ${styles.btnPrimary}`}
                            href={puck?.isEditing ? "#" : primaryButtonHref}
                            role="button"
                            tabIndex={puck?.isEditing ? -1 : undefined}
                        >
                            {primaryButtonText}
                        </a>

                        <div className={styles.navItemDropdown}>
                            <a
                                className={`${styles.btn} ${styles.btnLg} ${styles.btnOutlinePrimary} ${styles.navLink}`}
                                href={
                                    puck?.isEditing ? "#" : secondaryButtonHref
                                }
                                role="button"
                                tabIndex={puck?.isEditing ? -1 : undefined}
                            >
                                {secondaryButtonText}
                            </a>
                        </div>
                    </div>

                    {disclaimerText && (
                        <i className={styles.textMuted}>
                            <small>{disclaimerText}</small>
                        </i>
                    )}
                </div>
            </header>
        );
    },
};
