import Image from "next/image";

import "./ThemeList.scss";

import React from "react";

import { ThemeActions } from "./ThemeActions";

const themes = [
    {
        id: 1,
        name: "furniro",
        availableUpdate: true,
        dateAdded: "Added by Shopnex",
        preview: "/furniro-theme-preview.png",
        version: "15.3.0",
    },
    {
        id: 2,
        name: "freebie",
        availableUpdate: false,
        dateAdded: "Added by Shopnex",
        preview: "/freebie-theme-preview.png",
        version: "15.3.0",
    },
];

export const ThemeList = ({ data }: any) => {
    const isKeysDefined = data?.editorMode?.some(
        (type: any) => type.builderIoPublicKey && type.builderIoPrivateKey
    );

    return isKeysDefined ? (
        <div className="builder-theme-list">
            {themes.map((theme) => (
                <div className="theme-card" key={theme.id}>
                    <Image
                        alt={theme.name}
                        className="theme-preview"
                        height={500}
                        src={theme.preview}
                        width={500}
                    />
                    <div className="theme-info">
                        <h2>{theme.name}</h2>
                        <p className="date">{theme.dateAdded}</p>
                    </div>
                    <ThemeActions theme={theme} themeId={data.id} />
                </div>
            ))}
        </div>
    ) : null;
};
