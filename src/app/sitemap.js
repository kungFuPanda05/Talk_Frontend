import { SITE_URL } from "@/utils/siteMetadata";

export default function sitemap() {
    return [
        {
            url: `${SITE_URL}/login`,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${SITE_URL}/register`,
            changeFrequency: "monthly",
            priority: 0.7,
        },
    ];
}
