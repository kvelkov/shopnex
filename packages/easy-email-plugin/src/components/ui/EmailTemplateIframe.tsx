import React from "react";

interface EmailTemplateIframeProps {
    iframeOrigin: string;
}

export const EmailTemplateIframe: React.FC<EmailTemplateIframeProps> = ({
    iframeOrigin,
}) => {
    // eslint-disable-next-line @eslint-react/dom/no-missing-iframe-sandbox
    return <iframe className="email-template-iframe" src={iframeOrigin} title="Email Template Editor" />;
};
