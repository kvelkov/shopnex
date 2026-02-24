import type { ComponentConfig } from "@puckeditor/core";

import React from "react";

import styles from "./styles.module.css";

export type Hero2Props = {
    backgroundImage: string;
    description: string;
    primaryButtonHref: string;
    primaryButtonText: string;
    secondaryButtonHref: string;
    secondaryButtonText: string;
    title: string;
    videoThumbnail: string;
    videoUrl: string;
};

export const Hero2: ComponentConfig<Hero2Props> = {
    defaultProps: {
        backgroundImage:
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
        description:
            "Powerful and easy to use drag and drop website builder for blogs, presentation or ecommerce stores.",
        primaryButtonHref: "https://www.vvveb.com",
        primaryButtonText: "Free Download",
        secondaryButtonHref: "https://www.vvveb.com",
        secondaryButtonText: "Live Demo",
        title: "The next generation website builder",
        videoThumbnail: "img/demo/video-1.jpg",
        videoUrl: "https://www.youtube.com/watch?v=3xsP3u-CVO4",
    },
    fields: {
        backgroundImage: {
            type: "text",
            label: "Background Image URL",
        },
        description: {
            type: "textarea",
            contentEditable: true,
            label: "Description",
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
        videoThumbnail: {
            type: "text",
            label: "Video Thumbnail URL",
        },
        videoUrl: {
            type: "text",
            label: "Video URL",
        },
    },
    label: "Hero 2 - Split with Video",
    render: ({
        backgroundImage,
        description,
        primaryButtonHref,
        primaryButtonText,
        puck,
        secondaryButtonHref,
        secondaryButtonText,
        title,
        videoThumbnail,
        videoUrl,
    }) => {
        return (
            <header
                className={`${styles.hero2} ${styles.overlay}`}
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            >
                <div className={styles.container}>
                    <div
                        className={`${styles.row} ${styles.alignItemsCenter} ${styles.justifyContentBetween}`}
                    >
                        <div
                            className={`${styles.colLg6} ${styles.mb5} ${styles.ms5}`}
                        >
                            <h1
                                className={`${styles.heading} ${styles.textWhite}`}
                            >
                                {title}
                            </h1>
                            <p
                                className={`${styles.textWhite50} ${styles.mb5}`}
                            >
                                {description}
                            </p>
                            <div className={styles.buttonGroup}>
                                <a
                                    className={`${styles.btn} ${styles.btnWhite}`}
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
                                    className={`${styles.btn} ${styles.textWhite}`}
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
                        <div className={styles.colLg5}>
                            <a
                                className={styles.videoWrap}
                                href={puck?.isEditing ? "#" : videoUrl}
                                tabIndex={puck?.isEditing ? -1 : undefined}
                            >
                                <span className={styles.playButton}>
                                    <i className={styles.playIcon}>▶</i>
                                </span>
                                <img
                                    alt="Video thumbnail"
                                    className={styles.imgFluid}
                                    loading="lazy"
                                    src={videoThumbnail}
                                />
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.separatorBottom}>
                    <svg
                        className={styles.separatorSvg}
                        height="100px"
                        preserveAspectRatio="none"
                        viewBox="0 0 300 100"
                    >
                        <path
                            className={styles.decoLayer1}
                            d="M30.913,43.944c0,0,42.911-34.464,87.51-14.191c77.31,35.14,113.304-1.952,146.638-4.729c48.654-4.056,69.94,16.218,69.94,16.218v54.396H30.913V43.944z"
                            fill="#FFFFFF"
                            opacity="0.6"
                        />
                        <path
                            className={styles.decoLayer2}
                            d="M-35.667,44.628c0,0,42.91-34.463,87.51-14.191c77.31,35.141,113.304-1.952,146.639-4.729c48.653-4.055,69.939,16.218,69.939,16.218v54.396H-35.667V44.628z"
                            fill="#FFFFFF"
                            opacity="0.6"
                        />
                        <path
                            className={styles.decoLayer3}
                            d="M43.415,98.342c0,0,48.283-68.927,109.133-68.927c65.886,0,97.983,67.914,97.983,67.914v3.716H42.401L43.415,98.342z"
                            fill="#FFFFFF"
                            opacity="0.7"
                        />
                        <path
                            className={styles.decoLayer4}
                            d="M-34.667,62.998c0,0,56-45.667,120.316-27.839C167.484,57.842,197,41.332,232.286,30.428c53.07-16.399,104.047,36.903,104.047,36.903l1.333,36.667l-372-2.954L-34.667,62.998z"
                            fill="#FFFFFF"
                        />
                    </svg>
                </div>
            </header>
        );
    },
};
