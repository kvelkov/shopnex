import type { ComponentConfig } from "@puckeditor/core";

import React from "react";

import styles from "./styles.module.css";

export type MenuItem = {
    hasDropdown?: boolean;
    href: string;
    label: string;
};

export type NavBarProps = {
    backgroundColor: string;
    logo: string;
    logoText: string;
    menuItems: MenuItem[];
    showCart: boolean;
    showSearch: boolean;
    showUserAccount: boolean;
    textColor: string;
};

export const NavBar: ComponentConfig<NavBarProps> = {
    defaultProps: {
        backgroundColor: "#ffffff",
        logo: "",
        logoText: "web",
        menuItems: [
            { hasDropdown: true, href: "#", label: "Mega menu" },
            { hasDropdown: true, href: "#", label: "Blog" },
            { hasDropdown: false, href: "#", label: "Contact" },
            { hasDropdown: false, href: "#", label: "About us" },
        ],
        showCart: true,
        showSearch: true,
        showUserAccount: true,
        textColor: "#333333",
    },
    fields: {
        backgroundColor: {
            type: "text",
            label: "Background Color",
        },
        logo: {
            type: "text",
            label: "Logo URL",
        },
        logoText: {
            type: "text",
            label: "Logo Text",
        },
        menuItems: {
            type: "array",
            arrayFields: {
                hasDropdown: {
                    type: "radio",
                    label: "Has Dropdown",
                    options: [
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                    ],
                },
                href: {
                    type: "text",
                    label: "Link URL",
                },
                label: {
                    type: "text",
                    label: "Menu Label",
                },
            },
            label: "Menu Items",
        },
        showCart: {
            type: "radio",
            label: "Show Cart",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        showSearch: {
            type: "radio",
            label: "Show Search",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        showUserAccount: {
            type: "radio",
            label: "Show User Account",
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
    label: "Navigation Bar",
    render: ({
        backgroundColor,
        logo,
        logoText,
        menuItems,
        puck,
        showCart,
        showSearch,
        showUserAccount,
        textColor,
    }) => {
        return (
            <nav
                className={styles.navbar}
                style={{
                    backgroundColor,
                    color: textColor,
                }}
            >
                <div className={styles.container}>
                    <div className={styles.leftSection}>
                        <div className={styles.logo}>
                            {logo ? (
                                <img
                                    alt={logoText}
                                    className={styles.logoImage}
                                    src={logo}
                                />
                            ) : (
                                <span className={styles.logoText}>
                                    {logoText}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className={styles.centerSection}>
                        <ul className={styles.menuList}>
                            {menuItems.map((item, index) => (
                                <li className={styles.menuItem} key={index}>
                                    <a
                                        className={styles.menuLink}
                                        href={puck?.isEditing ? "#" : item.href}
                                        tabIndex={
                                            puck?.isEditing ? -1 : undefined
                                        }
                                    >
                                        {item.label}
                                        {item.hasDropdown && (
                                            <span
                                                className={styles.dropdownIcon}
                                            >
                                                ▼
                                            </span>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.rightSection}>
                        {showSearch && (
                            <button
                                aria-label="Search"
                                className={styles.iconButton}
                            >
                                🔍
                            </button>
                        )}
                        {showUserAccount && (
                            <button
                                aria-label="User Account"
                                className={styles.iconButton}
                            >
                                👤
                            </button>
                        )}
                        {showCart && (
                            <button
                                aria-label="Shopping Cart"
                                className={styles.iconButton}
                            >
                                🛒
                            </button>
                        )}
                    </div>

                    <button
                        aria-label="Mobile Menu"
                        className={styles.mobileMenuButton}
                    >
                        ☰
                    </button>
                </div>
            </nav>
        );
    },
};
