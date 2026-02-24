export function getCallbackURL(
    baseURL: string,
    pluginType: string,
    provider: string
): URL {
    const callback_url = new URL(baseURL);
    callback_url.pathname = `/api/${pluginType}/oauth/callback/${provider}`;
    callback_url.search = "";
    return callback_url;
}
