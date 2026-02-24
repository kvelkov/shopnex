import * as qs from "qs-esm";

import type { AuthPluginOutput } from "../types";

interface BaseOptions {
    name: string;
}
interface QueryOptions {
    fields?: string[] | undefined;
}
export const getCurrentUser = async (
    options: BaseOptions,
    queryOpts?: QueryOptions  
) => {
    const base = process.env.NEXT_PUBLIC_SERVER_URL;
    let query = "";
    if (queryOpts) {
        query = "?";
        if (queryOpts.fields) {
            query += qs.stringify({ fields: queryOpts.fields });
        }
    }
    const response = await fetch(`${base}/api/${options.name}/session${query}`);
    const { data, kind, message } = (await response.json()) as AuthPluginOutput;
    return {
        data,
        kind,
        message,
    };
};
