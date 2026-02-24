import payloadEsLintConfig from "@payloadcms/eslint-config";

export const defaultESLintIgnores = [
    "**/.temp",
    "**/.*", // ignore all dotfiles
    "**/.git",
    "**/.hg",
    "**/.pnp.*",
    "**/.svn",
    "**/playwright.config.ts",
    "**/jest.config.js",
    "**/tsconfig.tsbuildinfo",
    "**/README.md",
    "**/eslint.config.js",
    "**/payload-types.ts",
    "**/dist/",
    "**/.yarn/",
    "**/build/",
    "**/node_modules/",
    "**/temp/",
    "plugins/*",
    "src/app/(frontend)/_components/checkout/*",
    "src/app/(frontend)/(checkout)/checkout/*",
    "src/app/(frontend)/_templates/checkout-form.tsx",
    "src/app/(frontend)/*",
];

export const rootParserOptions = {
    sourceType: "module",
    ecmaVersion: "latest",
    projectService: {
        maximumDefaultProjectFileMatchCount_THIS_WILL_SLOW_DOWN_LINTING: 40,
        allowDefaultProject: [
            "scripts/*.ts",
            "*.js",
            "*.mjs",
            "*.spec.ts",
            "*.d.ts",
        ],
    },
};

export const rootEslintConfig = [
    ...payloadEsLintConfig,
    {
        ignores: defaultESLintIgnores,
    },
    {
        rules: {
            "no-restricted-exports": "off",
        },
    },
    {
        files: ["packages/puck-editor-plugin/src/**"],
        rules: {
            // @next/next plugin is not installed in this package
            "@next/next/no-img-element": "off",
            // Emojis are intentional in UI blocks
            "jsx-a11y/accessible-emoji": "off",
            // Puck uses render() callbacks that are valid React components
            "react-hooks/rules-of-hooks": "off",
        },
    },
    {
        // Nextra _meta.ts files define navigation order — sorting would break it
        files: ["apps/shopnex-docs/**"],
        rules: {
            "perfectionist/sort-objects": "off",
        },
    },
    {
        files: ["apps/shop/src/**"],
        rules: {
            "no-empty-pattern": "off",
            "no-duplicate-case": "off",
            "@typescript-eslint/no-floating-promises": "off",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/await-thenable": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
            "jsx-a11y/img-redundant-alt": "off",
        },
    },
    {
        files: ["packages/auth-plugin/src/**"],
        rules: {
            // Auth plugin throws Response subclasses (not Error) by design
            "@typescript-eslint/only-throw-error": "off",
            // Config is guaranteed non-null at call sites
            "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
        },
    },
];

export default [
    ...rootEslintConfig,
    {
        languageOptions: {
            parserOptions: {
                ...rootParserOptions,
                // projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
];
