import { Button, RenderTitle } from "@payloadcms/ui";
import React from "react";

interface EmailTemplateHeaderProps {
    onSave: () => void;
    templateName: string;
}

export const EmailTemplateHeader: React.FC<EmailTemplateHeaderProps> = ({
    onSave,
    templateName,
}) => {
    return (
        <div className="header">
            <p className="doc-controls__value">
                {templateName || "Create New"}
            </p>
            <Button onClick={onSave}>Save</Button>
        </div>
    );
};
