import type { AuthPluginOutput } from "../types";

interface BaseOptions {
    name: string;
}
export const refresh = async (
    options: BaseOptions
): Promise<AuthPluginOutput> => {
    const base = process.env.NEXT_PUBLIC_SERVER_URL;
    const response = await fetch(`${base}/api/${options.name}/session/refresh`);
    const { data, isError, isSuccess, kind, message } =
        (await response.json()) as AuthPluginOutput;
    return {
        data,
        isError,
        isSuccess,
        kind,
        message,
    };
};
