import { SuccessKind } from "../../types";

export function sessionResponse(cookies: string[], returnURL?: string) {
    // Ensure the return URL is properly formatted
    const redirectURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/`;

    const responseHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Authentication Complete</title>
      </head>
      <body>
        <script>
          (function() {
            const returnURL = ${JSON.stringify(redirectURL)};
            if (window.opener) {
              window.opener.location = returnURL; 
              window.close();
            } else {
              window.location.href = returnURL;
            }
          })();
        </script>
      </body>
    </html>
  `;

    const res = new Response(responseHTML, {
        headers: {
            "Content-Type": "text/html; charset=utf-8",
        },
        status: 200,
    });

    cookies.forEach((cookie) => {
        res.headers.append("Set-Cookie", cookie);
    });

    return res;
}

export const revokeSession = (cookies: string[]) => {
    const res = new Response(
        JSON.stringify({
            isError: false,
            isSuccess: true,
            kind: SuccessKind.Deleted,
            message: "Session revoked",
        }),
        {
            status: 200,
        }
    );

    cookies.forEach((cookie) => {
        res.headers.append("Set-Cookie", cookie);
    });
    return res;
};
