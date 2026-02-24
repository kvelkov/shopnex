import type { ComponentConfig } from "@puckeditor/core";

import React from "react";

import styles from "./styles.module.css";

export type TopHeaderProps = {
    backgroundColor: string;
    email: string;
    phone: string;
    showCurrencySelector: boolean;
    showLanguageSelector: boolean;
    textColor: string;
};

export const TopHeader: ComponentConfig<TopHeaderProps> = {
    defaultProps: {
        backgroundColor: "#f8f9fa",
        email: "contact@mysite.com",
        phone: "+55 (111) 123 777",
        showCurrencySelector: true,
        showLanguageSelector: true,
        textColor: "#333333",
    },
    fields: {
        backgroundColor: {
            type: "text",
            label: "Background Color",
        },
        email: {
            type: "text",
            label: "Email Address",
        },
        phone: {
            type: "text",
            label: "Phone Number",
        },
        showCurrencySelector: {
            type: "radio",
            label: "Show Currency Selector",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        showLanguageSelector: {
            type: "radio",
            label: "Show Language Selector",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        textColor: {
            type: "text",
            label: "Text Color",
        },
    },
    label: "Top Header",
    render: ({
        backgroundColor,
        email,
        phone,
        showCurrencySelector,
        showLanguageSelector,
        textColor,
    }) => {
        return (
            <div
                className={styles.topHeader}
                style={{
                    backgroundColor,
                    color: textColor,
                }}
            >
                <div className={styles.container}>
                    <div className={styles.leftSection}>
                        {phone && (
                            <div className={styles.contactItem}>
                                <span className={styles.icon}>📞</span>
                                <span>{phone}</span>
                            </div>
                        )}
                        {email && (
                            <div className={styles.contactItem}>
                                <span className={styles.icon}>✉️</span>
                                <span>{email}</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.rightSection}>
                        {showCurrencySelector && (
                            <div className={styles.selector}>
                                <span>USD</span>
                                <span className={styles.chevron}>▼</span>
                            </div>
                        )}
                        {showLanguageSelector && (
                            <div className={styles.selector}>
                                <span>English</span>
                                <span className={styles.chevron}>▼</span>
                            </div>
                        )}
                        <div className={styles.settings}>
                            <span className={styles.icon}>⚙️</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
};
