"use client";

import { SetStepNav, useTheme } from "@payloadcms/ui";

import "./EmailTemplate.scss";

import React from "react";

import type { EmailTemplateProps } from "../types/email-template.types";

import { createNavigationItems, isCreateMode } from "../utils/message-handlers";
import { EmailTemplateIframe } from "./ui/EmailTemplateIframe";

export const EmailTemplate = ({
    identifier,
    iframeOrigin,
    templateName,
    token,
}: EmailTemplateProps) => {
    const { theme } = useTheme();
    const navItems = createNavigationItems(templateName, identifier);

    return (
        <div className="email-template">
            <SetStepNav nav={navItems} />
            <EmailTemplateIframe
                iframeOrigin={`${iframeOrigin}?id=${identifier}&templateName=${templateName}&token=${token}&theme=${theme}`}
            />
        </div>
    );
};
