import { useCallback, useRef } from "react";

import type { SaveOutput } from "../types/email-template.types";

import { SaveEventManager } from "../events/save-events";

export const useTemplateSave = (serverURL: string, identifier: string) => {
    const saveEventManager = useRef(new SaveEventManager());

    const handleSave = useCallback(
        (output: SaveOutput) => {
            try {
                if (!saveEventManager.current.validateSaveData(output)) {
                    return;
                }
            } catch (error) {
                saveEventManager.current.handleSaveError(error as Error);
            }
        },
        [identifier]
    );

    const setSaveSuccessHandler = useCallback(
        (handler: (data: any) => void) => {
            saveEventManager.current.setSaveSuccessHandler(handler);
        },
        []
    );

    const setSaveErrorHandler = useCallback(
        (handler: (error: Error) => void) => {
            saveEventManager.current.setSaveErrorHandler(handler);
        },
        []
    );

    return {
        handleSave,
        setSaveErrorHandler,
        setSaveSuccessHandler,
    };
};
