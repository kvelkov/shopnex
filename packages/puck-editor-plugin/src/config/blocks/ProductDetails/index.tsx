import type { ComponentConfig } from "@puckeditor/core";

import React, { useState } from "react";

import styles from "./styles.module.css";

export type ProductImage = {
    alt: string;
    src: string;
};

export type ProductDetailsProps = {
    addToCartText: string;
    availability: string;
    buyNowText: string;
    compareText: string;
    description: string;
    discount?: number;
    images: ProductImage[];
    manufacturer: string;
    name: string;
    originalPrice?: string;
    price: string;
    priceExcludingTax: string;
    rating: number;
    reviewsCount: number;
    showAvailability: boolean;
    showManufacturer: boolean;
    showRating: boolean;
    showVendor: boolean;
    vendor: string;
    wishlistText: string;
};

export const ProductDetails: ComponentConfig<ProductDetailsProps> = {
    defaultProps: {
        name: "One Shoulder Glitter Midi Dress",
        addToCartText: "Add to cart",
        availability: "In stock",
        buyNowText: "Buy now",
        compareText: "Compare product",
        description:
            "Elegant one shoulder glitter midi dress perfect for special occasions. Made with high-quality materials and attention to detail.",
        discount: 30,
        images: [
            {
                alt: "Product main image",
                src: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            },
            {
                alt: "Product image 2",
                src: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            },
            {
                alt: "Product image 3",
                src: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            },
        ],
        manufacturer: "Mango",
        originalPrice: "$65.00",
        price: "$49.00",
        priceExcludingTax: "$41.00",
        rating: 4,
        reviewsCount: 12,
        showAvailability: true,
        showManufacturer: true,
        showRating: true,
        showVendor: true,
        vendor: "Fashion Store",
        wishlistText: "Add to Wish List",
    },
    fields: {
        name: {
            type: "text",
            contentEditable: true,
            label: "Product Name",
        },
        addToCartText: {
            type: "text",
            label: "Add to Cart Button Text",
        },
        availability: {
            type: "text",
            label: "Availability",
        },
        buyNowText: {
            type: "text",
            label: "Buy Now Button Text",
        },
        compareText: {
            type: "text",
            label: "Compare Button Text",
        },
        description: {
            type: "textarea",
            label: "Product Description",
        },
        discount: {
            type: "number",
            label: "Discount Percentage",
        },
        images: {
            type: "array",
            arrayFields: {
                alt: {
                    type: "text",
                    label: "Alt Text",
                },
                src: {
                    type: "text",
                    label: "Image URL",
                },
            },
            label: "Product Images",
        },
        manufacturer: {
            type: "text",
            label: "Manufacturer",
        },
        originalPrice: {
            type: "text",
            label: "Original Price (for discounts)",
        },
        price: {
            type: "text",
            label: "Price",
        },
        priceExcludingTax: {
            type: "text",
            label: "Price Excluding Tax",
        },
        rating: {
            type: "number",
            label: "Rating (1-5)",
            max: 5,
            min: 1,
        },
        reviewsCount: {
            type: "number",
            label: "Reviews Count",
        },
        showAvailability: {
            type: "radio",
            label: "Show Availability",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        showManufacturer: {
            type: "radio",
            label: "Show Manufacturer",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        showRating: {
            type: "radio",
            label: "Show Rating",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        showVendor: {
            type: "radio",
            label: "Show Vendor",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        vendor: {
            type: "text",
            label: "Vendor",
        },
        wishlistText: {
            type: "text",
            label: "Wishlist Button Text",
        },
    },
    label: "Product Details",
    render: ({
        name,
        addToCartText,
        availability,
        buyNowText,
        compareText,
        description,
        discount,
        images,
        manufacturer,
        originalPrice,
        price,
        priceExcludingTax,
        puck,
        rating,
        reviewsCount,
        showAvailability,
        showManufacturer,
        showRating,
        showVendor,
        vendor,
        wishlistText,
    }) => {
        const [activeImageIndex, setActiveImageIndex] = useState(0);
        const [quantity, setQuantity] = useState(1);

        const renderStars = (rating: number) => {
            return Array.from({ length: 5 }, (_, index) => (
                <span
                    className={`${styles.star} ${index < rating ? styles.starFilled : styles.starEmpty}`}
                    key={index}
                >
                    ★
                </span>
            ));
        };

        return (
            <div className={styles.productDetails}>
                <div className={styles.container}>
                    <div className={styles.row}>
                        {/* Product Images */}
                        <div className={styles.colMd6}>
                            <div className={styles.productGallery}>
                                <div className={styles.mainImage}>
                                    {images && images.length > 0 && (
                                        <img
                                            alt={images[activeImageIndex]?.alt}
                                            className={styles.productImage}
                                            src={images[activeImageIndex]?.src}
                                        />
                                    )}
                                </div>

                                {images && images.length > 1 && (
                                    <div className={styles.thumbnails}>
                                        {images.map((image, index) => (
                                            <button
                                                className={`${styles.thumbnail} ${index === activeImageIndex ? styles.active : ""}`}
                                                disabled={puck?.isEditing}
                                                key={index}
                                                onClick={() =>
                                                    setActiveImageIndex(index)
                                                }
                                            >
                                                <img
                                                    alt={image.alt}
                                                    className={
                                                        styles.thumbnailImage
                                                    }
                                                    src={image.src}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className={styles.colMd6}>
                            <div className={styles.productInfo}>
                                <h1 className={styles.productName}>{name}</h1>

                                {showManufacturer && manufacturer && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>
                                            Manufacturer:
                                        </span>
                                        <span className={styles.value}>
                                            {manufacturer}
                                        </span>
                                    </div>
                                )}

                                {showVendor && vendor && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>
                                            Vendor:
                                        </span>
                                        <span className={styles.value}>
                                            {vendor}
                                        </span>
                                    </div>
                                )}

                                {showAvailability && availability && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>
                                            Availability:
                                        </span>
                                        <span className={styles.value}>
                                            {availability}
                                        </span>
                                    </div>
                                )}

                                {showRating && rating > 0 && (
                                    <div className={styles.ratingRow}>
                                        <div className={styles.stars}>
                                            {renderStars(rating)}
                                        </div>
                                        {reviewsCount > 0 && (
                                            <span
                                                className={styles.reviewsLink}
                                            >
                                                ({reviewsCount} reviews)
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className={styles.priceSection}>
                                    <div className={styles.priceRow}>
                                        <span className={styles.currentPrice}>
                                            {price}
                                        </span>
                                        {originalPrice && discount && (
                                            <>
                                                <span
                                                    className={
                                                        styles.originalPrice
                                                    }
                                                >
                                                    {originalPrice}
                                                </span>
                                                <span
                                                    className={styles.discount}
                                                >
                                                    {discount}% Off
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {priceExcludingTax && (
                                        <div className={styles.priceExcluding}>
                                            Excluding taxes: {priceExcludingTax}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.actionsSection}>
                                    <div className={styles.quantitySection}>
                                        <div
                                            className={styles.quantityControls}
                                        >
                                            <button
                                                className={styles.quantityBtn}
                                                disabled={puck?.isEditing}
                                                onClick={() =>
                                                    setQuantity(
                                                        Math.max(
                                                            1,
                                                            quantity - 1
                                                        )
                                                    )
                                                }
                                            >
                                                -
                                            </button>
                                            <input
                                                className={styles.quantityInput}
                                                disabled={puck?.isEditing}
                                                min="1"
                                                onChange={(e) =>
                                                    setQuantity(
                                                        parseInt(
                                                            e.target.value
                                                        ) || 1
                                                    )
                                                }
                                                type="number"
                                                value={quantity}
                                            />
                                            <button
                                                className={styles.quantityBtn}
                                                disabled={puck?.isEditing}
                                                onClick={() =>
                                                    setQuantity(quantity + 1)
                                                }
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            className={`${styles.btn} ${styles.btnPrimary}`}
                                            disabled={puck?.isEditing}
                                        >
                                            🛒 {addToCartText}
                                        </button>

                                        <button
                                            className={`${styles.btn} ${styles.btnSecondary}`}
                                            disabled={puck?.isEditing}
                                        >
                                            {buyNowText} →
                                        </button>
                                    </div>

                                    <div className={styles.secondaryActions}>
                                        <button
                                            className={styles.actionBtn}
                                            disabled={puck?.isEditing}
                                        >
                                            ♡ {wishlistText}
                                        </button>
                                        <button
                                            className={styles.actionBtn}
                                            disabled={puck?.isEditing}
                                        >
                                            ⚖ {compareText}
                                        </button>
                                    </div>
                                </div>

                                {description && (
                                    <div className={styles.description}>
                                        <h4>Description</h4>
                                        <p>{description}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
};
