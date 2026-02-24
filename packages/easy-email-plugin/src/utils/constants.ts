export const COLLECTION_SLUG = "email-templates";
export const API_BASE_PATH = "/api";

export const MESSAGE_TYPES = {
    CURRENT_EMAIL_TEMPLATE: "CURRENT_EMAIL_TEMPLATE",
    EDITOR_READY: "EDITOR_READY",
    EMAIL_TEMPLATE_SAVE: "EMAIL_TEMPLATE_SAVE",
    NEW_EMAIL_TEMPLATE: "NEW_EMAIL_TEMPLATE",
    TRIGGER_SAVE: "TRIGGER_SAVE",
} as const;

export const NAVIGATION_PATHS = {
    EMAIL_TEMPLATE_EDIT: (id: string) =>
        `/admin/collections/email-templates/${id}`,
    EMAIL_TEMPLATES: "/admin/collections/email-templates",
} as const;
