import type { ComponentConfig } from "@puckeditor/core";

import React from "react";

import styles from "./styles.module.css";

export type FooterLink = {
    href: string;
    text: string;
};

export type FooterProps = {
    backgroundColor: string;
    copyrightText: string;
    copyrightYear: string;
    dividerColor: string;
    leftLinks: FooterLink[];
    linkColor: string;
    poweredByLink: string;
    poweredByText: string;
    textColor: string;
};

export const Footer: ComponentConfig<FooterProps> = {
    defaultProps: {
        backgroundColor: "#f8f9fa",
        copyrightText: "Vvveb",
        copyrightYear: "2023",
        dividerColor: "#dee2e6",
        leftLinks: [
            { href: "/terms", text: "Terms and conditions" },
            { href: "/privacy", text: "Privacy Policy" },
        ],
        linkColor: "#007bff",
        poweredByLink: "https://vvveb.com",
        poweredByText: "Powered by Vvveb",
        textColor: "#6c757d",
    },
    fields: {
        backgroundColor: {
            type: "text",
            label: "Background Color",
        },
        copyrightText: {
            type: "text",
            label: "Copyright Text",
        },
        copyrightYear: {
            type: "text",
            label: "Copyright Year",
        },
        dividerColor: {
            type: "text",
            label: "Divider Color",
        },
        leftLinks: {
            type: "array",
            arrayFields: {
                href: {
                    type: "text",
                    label: "Link URL",
                },
                text: {
                    type: "text",
                    label: "Link Text",
                },
            },
            label: "Left Links",
        },
        linkColor: {
            type: "text",
            label: "Link Color",
        },
        poweredByLink: {
            type: "text",
            label: "Powered By Link",
        },
        poweredByText: {
            type: "text",
            label: "Powered By Text",
        },
        textColor: {
            type: "text",
            label: "Text Color",
        },
    },
    label: "Footer",
    render: ({
        backgroundColor,
        copyrightText,
        copyrightYear,
        dividerColor,
        leftLinks,
        linkColor,
        poweredByLink,
        poweredByText,
        puck,
        textColor,
    }) => {
        return (
            <footer
                className={styles.footer}
                style={{
                    backgroundColor,
                    borderTopColor: dividerColor,
                    color: textColor,
                }}
            >
                <div className={styles.container}>
                    <div className={styles.footerContent}>
                        {/* Left Links */}
                        <div className={styles.leftSection}>
                            {leftLinks && leftLinks.length > 0 && (
                                <div className={styles.links}>
                                    {leftLinks.map((link, index) => (
                                        <React.Fragment key={index}>
                                            <a
                                                className={styles.link}
                                                href={
                                                    puck?.isEditing
                                                        ? "#"
                                                        : link.href
                                                }
                                                style={{ color: linkColor }}
                                                tabIndex={
                                                    puck?.isEditing
                                                        ? -1
                                                        : undefined
                                                }
                                            >
                                                {link.text}
                                            </a>
                                            {index < leftLinks.length - 1 && (
                                                <span
                                                    className={styles.separator}
                                                    style={{ color: textColor }}
                                                >
                                                    |
                                                </span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Section */}
                        <div className={styles.rightSection}>
                            <div className={styles.copyrightAndPowered}>
                                {/* Copyright */}
                                <span className={styles.copyright}>
                                    © {copyrightYear} {copyrightText}.
                                </span>

                                {/* Powered By */}
                                <a
                                    className={styles.poweredBy}
                                    href={puck?.isEditing ? "#" : poweredByLink}
                                    style={{ color: linkColor }}
                                    tabIndex={puck?.isEditing ? -1 : undefined}
                                >
                                    {poweredByText}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    },
};
