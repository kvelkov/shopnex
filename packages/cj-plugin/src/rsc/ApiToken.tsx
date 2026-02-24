"use client";

import { PasswordField } from "@payloadcms/ui";
import React from "react";

import "./ApiToken.scss";

interface ApiTokenProps {
    label?: string;
    path: string;
    readOnly?: boolean;
}

export function ApiToken({
    label = "API Token",
    path,
    readOnly,
}: ApiTokenProps) {
    return (
        <PasswordField
            autoComplete="new-password"
            field={{
                name: "password",
                label: "API Token",
            }}
            indexPath=""
            parentPath=""
            parentSchemaPath=""
            path={path}
            schemaPath="password"
        />
    );
}
