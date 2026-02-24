import type { RootConfig } from "@puckeditor/core";

import { DefaultRootProps } from "@puckeditor/core";

export type RootProps = {
    description: string;
    handle: string;
    title: string;
};

export const Root: RootConfig<{
    fields: {
        description: { label: string; type: "text" };
        handle: { label: string; type: "text" };
        title: { label: string; type: "text" };
        userField: { option: boolean; type: "userField" };
    };
    props: RootProps;
}> = {
    defaultProps: {
        description: "Meta description",
        handle: "hello-world",
        title: "Meta title",
    },
    fields: {
        description: { type: "textarea" },
        handle: { type: "text" },
        title: { type: "text" },
    },
    render: ({ children }) => {
        return <div>{children}</div>;
    },
};

export default Root;
