import { jest } from "@jest/globals";
import fs from "fs";
import fse from "fs-extra";
import globby from "globby";
import * as os from "node:os";
import path from "path";

import type {
    CliArgs,
    DbType,
    ProjectTemplate,
} from "../types.js";

import {
    createProject,
    updatePackageJSONDependencies,
} from "./create-project.js";
import { dbReplacements } from "./replacements.js";
import { getValidTemplates } from "./templates.js";

describe("createProject", () => {
    let projectDir: string;

    beforeAll(() => {
        // eslint-disable-next-line no-console
        console.log = jest.fn();
    });

    beforeEach(() => {
        const tempDirectory = fs.realpathSync(os.tmpdir());
        projectDir = `${tempDirectory}/${Math.random().toString(36).substring(7)}`;
    });

    afterEach(() => {
        if (fse.existsSync(projectDir)) {
            fse.rmSync(projectDir, { recursive: true });
        }
    });

    describe("#createProject", () => {
        const args = {
            _: ["project-name"],
            "--db": "mongodb",
            "--local-template": "simple-shop",
            "--no-deps": true,
        } as CliArgs;
        const packageManager = "yarn";

        it("creates simple-shop template", async () => {
            const projectName = "simple-shop";
            const template: ProjectTemplate = {
                name: "simple-shop",
                type: "starter",
                description: "Simple Shop Template",
                url: "https://github.com/shopnex-ai/shopnex/templates/simple-shop",
            };

            await createProject({
                cliArgs: { ...args, "--local-template": "simple-shop" } as CliArgs,
                packageManager,
                projectDir,
                projectName,
                template,
            });

            const packageJsonPath = path.resolve(projectDir, "package.json");
            const packageJson = fse.readJsonSync(packageJsonPath);

            // Check package name and description
            expect(packageJson.name).toStrictEqual(projectName);
        });

        it("creates project with correct structure", async () => {
            const projectName = "test-shop";
            const template: ProjectTemplate = {
                name: "simple-shop",
                type: "starter",
                description: "Simple Shop Template",
                url: "https://github.com/shopnex-ai/shopnex/templates/simple-shop",
            };

            await createProject({
                cliArgs: { ...args, "--local-template": "simple-shop" } as CliArgs,
                packageManager,
                projectDir,
                projectName,
                template,
            });

            // Check essential files exist
            expect(fse.existsSync(path.resolve(projectDir, "package.json"))).toBe(true);
            expect(fse.existsSync(path.resolve(projectDir, "src/payload.config.ts"))).toBe(true);
            expect(fse.existsSync(path.resolve(projectDir, ".env"))).toBe(true);
        });

        // Skip example test since we don't have examples directory
        it.todo("creates example");

        describe("creates project from template", () => {
            const templates = getValidTemplates();

            it.each([
                ["simple-shop", "mongodb"],
                ["simple-shop", "sqlite"],
            ])("update config and deps: %s, %s", async (templateName, db) => {
                const projectName = "starter-project";

                const template = templates.find((t) => t.name === templateName);

                const cliArgs = {
                    ...args,
                    "--db": db,
                    "--local-template": templateName,
                } as CliArgs;

                await createProject({
                    cliArgs,
                    dbDetails: {
                        type: db as DbType,
                        dbUri: `${db}://localhost:27017/create-project-test`,
                    },
                    packageManager,
                    projectDir,
                    projectName,
                    template: template as ProjectTemplate,
                });

                const dbReplacement = dbReplacements[db as DbType];

                const packageJsonPath = path.resolve(
                    projectDir,
                    "package.json"
                );
                const packageJson = fse.readJsonSync(packageJsonPath);

                // Verify git was initialized
                expect(fse.existsSync(path.resolve(projectDir, ".git"))).toBe(
                    true
                );

                // Should only have one db adapter
                expect(
                    Object.keys(packageJson.dependencies).filter((n) =>
                        n.startsWith("@payloadcms/db-")
                    )
                ).toHaveLength(1);

                const payloadConfigPath = (
                    await globby("**/payload.config.ts", {
                        absolute: true,
                        cwd: projectDir,
                    })
                )?.[0];

                const content = fse.readFileSync(payloadConfigPath, "utf-8");

                // Check payload.config.ts
                expect(content).not.toContain("// database-adapter-import");
                expect(content).toContain(dbReplacement.importReplacement);

                expect(content).not.toContain(
                    "// database-adapter-config-start"
                );
                expect(content).not.toContain("// database-adapter-config-end");
                expect(content).toContain(
                    dbReplacement.configReplacement().join("\n")
                );
            });
        });

        describe("updates package.json", () => {
            it("updates package name and bumps workspace versions", async () => {
                const latestVersion = "3.0.0";
                const initialJSON = {
                    name: "test-project",
                    dependencies: {
                        "@payloadcms/db-mongodb": "workspace:*",
                        "@payloadcms/ui": "workspace:*",
                        payload: "workspace:*",
                    },
                    version: "1.0.0",
                };

                const correctlyModifiedJSON = {
                    name: "test-project",
                    dependencies: {
                        "@payloadcms/db-mongodb": `${latestVersion}`,
                        "@payloadcms/ui": `${latestVersion}`,
                        payload: `${latestVersion}`,
                    },
                    version: "1.0.0",
                };

                await updatePackageJSONDependencies({
                    latestVersion,
                    packageJson: initialJSON,
                });

                expect(initialJSON).toStrictEqual(correctlyModifiedJSON);
            });
        });
    });
});
