export interface EmailTemplateData {
    html: string;
    json: any;
    name: string;
}

export interface EmailTemplateProps {
    html: string;
    identifier: string;
    iframeOrigin: string;
    json: any;
    serverURL: string;
    templateName: string;
    token: string;
}

export interface SaveOutput {
    html: string;
    json: any;
    name: string;
}

export interface IframeMessageEvent {
    data: {
        payload?: any;
        type: string;
    };
    origin: string;
}

export type MessageType =
    | "CURRENT_EMAIL_TEMPLATE"
    | "EDITOR_READY"
    | "EMAIL_TEMPLATE_SAVE"
    | "NEW_EMAIL_TEMPLATE"
    | "TRIGGER_SAVE";

export interface MessagePayload {
    payload?: any;
    type: MessageType;
}
