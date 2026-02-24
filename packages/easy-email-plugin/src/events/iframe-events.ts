import type { MessagePayload } from "../types/email-template.types";

import { MESSAGE_TYPES } from "../utils/constants";

export class IframeEventManager {
    private iframeOrigin: string;
    private iframeRef: React.RefObject<HTMLIFrameElement | null>;

    constructor(
        iframeRef: React.RefObject<HTMLIFrameElement | null>,
        iframeOrigin: string
    ) {
        this.iframeRef = iframeRef;
        this.iframeOrigin = iframeOrigin;
    }

    isValidOrigin(origin: string): boolean {
        return origin === this.iframeOrigin;
    }

    sendCurrentTemplate(templateData: any): void {
        this.sendMessage({
            type: MESSAGE_TYPES.CURRENT_EMAIL_TEMPLATE,
            payload: templateData,
        });
    }

    sendMessage(payload: MessagePayload): void {
        const iframeWindow = this.iframeRef.current?.contentWindow;
        if (iframeWindow) {
            console.log(`Sending ${payload.type} message:`, payload.payload);
            iframeWindow.postMessage(payload, this.iframeOrigin);
        }
    }

    sendNewTemplate(templateData: any): void {
        this.sendMessage({
            type: MESSAGE_TYPES.NEW_EMAIL_TEMPLATE,
            payload: templateData,
        });
    }

    triggerSave(): void {
        this.sendMessage({
            type: MESSAGE_TYPES.TRIGGER_SAVE,
        });
    }
}
