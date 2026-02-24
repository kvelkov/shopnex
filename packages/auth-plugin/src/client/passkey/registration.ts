import { startRegistration } from "@simplewebauthn/browser";
export const registration = async (email: string) => {
    try {
        const resp = await fetch(
            "/api/admin/passkey/generate-registration-options",
            {
                body: JSON.stringify({ data: { email } }),
                method: "POST",
            }
        );
        const optionsJSON = await resp.json();

        const registrationResp = await startRegistration({
            optionsJSON: optionsJSON.options,
        });
        const response = await fetch("/api/admin/passkey/verify-registration", {
            body: JSON.stringify({
                data: { email, registration: registrationResp },
            }),
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        });
        if (response.redirected) {
            window.location.href = response.url;
        }
    } catch (error) {
        console.log(error);
    }
};
