import type { LucideProps } from "lucide-react";
import type { ExoticComponent } from "react";

import * as LucideIcons from "lucide-react";

export const getNavIcon = (
    slug: string,
    groupsConfig?: Record<string, { icon: string; name: string }>
): ExoticComponent<LucideProps> | undefined => {
    if (groupsConfig && groupsConfig[slug]) {
        const iconName = groupsConfig[slug].icon;
        console.log(`getNavIcon: found icon name "${iconName}" for slug="${slug}" in groups config`);

        // Dynamically get icon from Lucide
        const IconComponent = (LucideIcons as any)[iconName];
        return IconComponent;
    }

    console.log(`getNavIcon: no icon found for slug="${slug}"`);
    return undefined;
};
