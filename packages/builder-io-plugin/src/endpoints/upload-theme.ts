import { PayloadHandler } from "payload";
import { uploadTheme } from "../utils/theme-management";

export const uploadThemeHandler: PayloadHandler = async (req) => {
    const { logger } = req.payload;
    const body = (await req.json?.()) as { themeName: string };
    const themeId = req.routeParams?.themeId;
    const isSuperAdmin = req.user?.roles?.includes("super-admin");

    logger.debug(
        {
            themeName: body.themeName,
            themeId,
            isSuperAdmin,
        },
        "Upload theme request received"
    );

    if (!req.user?.shops?.length) {
        logger.warn(
            {
                userId: req.user?.id,
            },
            "Upload theme attempt without associated shops"
        );
        return Response.json({ error: "User not found" }, { status: 400 });
    }

    if (!body.themeName) {
        logger.warn("Upload theme attempt without theme name");
        return Response.json({
            error: "Theme name is required",
            status: 400,
        });
    }

    try {
        logger.debug({ themeId }, "Fetching theme details");
        const theme = await req.payload.find({
            collection: "themes",
            where: {
                id: {
                    equals: themeId,
                },
                ...(!isSuperAdmin && {
                    shop: {
                        equals: (req.user.shops[0]?.shop as any)?.id,
                    },
                }),
            },
        });

        const result = theme.docs[0];
        if (!result) {
            logger.warn({ themeId }, "Theme not found");
            return Response.json({ error: "Theme not found" }, { status: 404 });
        }

        const themeMode = result.editorMode[0];
        logger.info(
            {
                themeName: body.themeName,
                themeId,
            },
            "Starting theme upload process"
        );

        const success = await uploadTheme({
            // @ts-ignore
            privateKey: themeMode.builderIoPrivateKey,
            themeName: body.themeName,
            sourcePublicKey: process.env
                .NEXT_PUBLIC_BUILDER_IO_PUBLIC_KEY as string,
            logger,
        });

        if (success) {
            logger.info(
                {
                    themeName: body.themeName,
                },
                "Theme upload completed successfully"
            );
            return Response.json({ success: true });
        } else {
            logger.error({ themeName: body.themeName }, "Theme upload failed");
            return Response.json(
                { error: "Failed to upload theme" },
                { status: 500 }
            );
        }
    } catch (error) {
        logger.error(
            {
                error,
                themeName: body.themeName,
            },
            "Error in upload theme handler"
        );
        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
};
