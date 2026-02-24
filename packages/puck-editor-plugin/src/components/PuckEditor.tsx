"use client";

import { useField, useForm } from "@payloadcms/ui";
import { Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";

import { clientConfig } from "../config/client-config";
import "./PuckEditor.scss";

const initialData = {};

export const PuckEditor = () => {
    const { setValue, value } = useField<any>({ path: "page" });
    const { setValue: setTitle, value: title } = useField<any>({
        path: "title",
    });
    const { setValue: setHandle, value: handle } = useField<any>({
        path: "handle",
    });
    const { submit } = useForm();
    const save = () => {
        void submit();
    };
    const onChange = (data: any) => {
        setValue(data);
        if (data.root?.props?.title !== title) {
            setTitle(data.root?.props?.title);
        }
        if (data.root?.props?.handle !== handle) {
            setHandle(data.root?.props?.handle);
        }
    };
    return (
        <Puck
            config={clientConfig}
            data={value || initialData}
            onChange={onChange}
            onPublish={save}
            overrides={{
                headerActions: ({ children }) => (
                    <>
                        {/* <Button buttonStyle="secondary">View page</Button>
                        <Button onClick={save} buttonStyle="primary">
                            <Globe size={12} />
                            Publish
                        </Button> */}
                    </>
                ),
            }}
        />
    );
};
