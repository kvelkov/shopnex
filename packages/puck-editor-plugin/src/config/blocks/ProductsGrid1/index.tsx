import type { ComponentConfig } from "@puckeditor/core";

import React from "react";

import styles from "./styles.module.css";

export type Product = {
    hoverImage: string;
    id: string;
    image: string;
    name: string;
    price: string;
    url: string;
};

export type ProductsGrid1Props = {
    addToCartText: string;
    backgroundColor: string;
    columnsPerRow: number;
    products: Product[];
    showCompare: boolean;
    showFavorite: boolean;
    title: string;
};

export const ProductsGrid1: ComponentConfig<ProductsGrid1Props> = {
    defaultProps: {
        addToCartText: "Add to cart",
        backgroundColor: "#ffffff",
        columnsPerRow: 4,
        products: [
            {
                id: "1",
                name: "Product 1",
                hoverImage:
                    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=999&q=80",
                price: "$100.00",
                url: "/product/1",
            },
            {
                id: "2",
                name: "Product 2",
                hoverImage:
                    "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                price: "$85.00",
                url: "/product/2",
            },
            {
                id: "3",
                name: "Product 3",
                hoverImage:
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                image: "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                price: "$120.00",
                url: "/product/3",
            },
            {
                id: "4",
                name: "Product 4",
                hoverImage:
                    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                price: "$95.00",
                url: "/product/4",
            },
        ],
        showCompare: true,
        showFavorite: true,
        title: "Popular Products",
    },
    fields: {
        addToCartText: {
            type: "text",
            label: "Add to Cart Text",
        },
        backgroundColor: {
            type: "text",
            label: "Background Color",
        },
        columnsPerRow: {
            type: "select",
            label: "Columns per Row",
            options: [
                { label: "2", value: 2 },
                { label: "3", value: 3 },
                { label: "4", value: 4 },
                { label: "6", value: 6 },
            ],
        },
        products: {
            type: "array",
            arrayFields: {
                id: {
                    type: "text",
                    label: "Product ID",
                },
                name: {
                    type: "text",
                    label: "Product Name",
                },
                hoverImage: {
                    type: "text",
                    label: "Hover Image URL",
                },
                image: {
                    type: "text",
                    label: "Product Image URL",
                },
                price: {
                    type: "text",
                    label: "Price",
                },
                url: {
                    type: "text",
                    label: "Product URL",
                },
            },
            label: "Products",
        },
        showCompare: {
            type: "radio",
            label: "Show Compare Button",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        showFavorite: {
            type: "radio",
            label: "Show Favorite Button",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        title: {
            type: "text",
            contentEditable: true,
            label: "Section Title",
        },
    },
    label: "Products Grid 1",
    render: ({
        addToCartText,
        backgroundColor,
        columnsPerRow,
        products,
        puck,
        showCompare,
        showFavorite,
        title,
    }) => {
        const getColumnClass = (columns: number) => {
            const colMap = {
                2: styles.col6,
                3: styles.col4,
                4: styles.col3,
                6: styles.col2,
            };
            return colMap[columns as keyof typeof colMap] || styles.col3;
        };

        return (
            <section
                className={styles.productsGrid}
                style={{ backgroundColor }}
            >
                <div className={styles.container}>
                    <div className={styles.row}>
                        <div className={styles.col12}>
                            <div
                                className={`${styles.sectionHeading} ${styles.textCenter}`}
                            >
                                <h2>{title}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.container}>
                    <div className={styles.row}>
                        {products &&
                            products.length > 0 &&
                            products.map((product, index) => (
                                <div
                                    className={getColumnClass(columnsPerRow)}
                                    key={product.id || index}
                                >
                                    <article
                                        className={styles.singleProductWrapper}
                                    >
                                        {/* Product Image */}
                                        <div className={styles.productImage}>
                                            <a
                                                href={
                                                    puck?.isEditing
                                                        ? "#"
                                                        : product.url
                                                }
                                                tabIndex={
                                                    puck?.isEditing
                                                        ? -1
                                                        : undefined
                                                }
                                            >
                                                <img
                                                    alt={product.name}
                                                    className={styles.mainImage}
                                                    loading="lazy"
                                                    src={product.image}
                                                />
                                                {product.hoverImage && (
                                                    <img
                                                        alt={product.name}
                                                        className={
                                                            styles.hoverImg
                                                        }
                                                        loading="lazy"
                                                        src={product.hoverImage}
                                                    />
                                                )}
                                            </a>

                                            {/* Favorite */}
                                            {showFavorite && (
                                                <div
                                                    className={
                                                        styles.productFavourite
                                                    }
                                                >
                                                    <button
                                                        aria-label="Add to wishlist"
                                                        className={
                                                            styles.iconBtn
                                                        }
                                                    >
                                                        ♡
                                                    </button>
                                                </div>
                                            )}

                                            {/* Compare */}
                                            {showCompare && (
                                                <div
                                                    className={
                                                        styles.productCompare
                                                    }
                                                >
                                                    <button
                                                        aria-label="Add to compare"
                                                        className={
                                                            styles.iconBtn
                                                        }
                                                    >
                                                        ⚖
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Content */}
                                        <div className={styles.productContent}>
                                            <a
                                                href={
                                                    puck?.isEditing
                                                        ? "#"
                                                        : product.url
                                                }
                                                tabIndex={
                                                    puck?.isEditing
                                                        ? -1
                                                        : undefined
                                                }
                                            >
                                                <h6>{product.name}</h6>
                                            </a>

                                            <p className={styles.productPrice}>
                                                {product.price}
                                            </p>

                                            {/* Hover Content */}
                                            <div
                                                className={styles.hoverContent}
                                            >
                                                <div
                                                    className={
                                                        styles.addToCartBtn
                                                    }
                                                >
                                                    <button
                                                        className={`${styles.btn} ${styles.btnPrimary} ${styles.w100}`}
                                                        disabled={
                                                            puck?.isEditing
                                                        }
                                                    >
                                                        {addToCartText}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            ))}
                    </div>
                </div>
            </section>
        );
    },
};
