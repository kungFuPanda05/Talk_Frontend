import {
    SITE_NAME,
    SOCIAL_IMAGE,
} from "@/utils/siteMetadata";

const title = "Create an Account";
const description =
    "Create your free ChitTalk account and start meeting new people through instant one-to-one conversations.";

export const metadata = {
    title,
    description,
    alternates: {
        canonical: "/register",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        title: `${title} | ${SITE_NAME}`,
        description,
        url: "/register",
        siteName: SITE_NAME,
        images: [SOCIAL_IMAGE],
        locale: "en_IN",
        type: "website",
    },
    twitter: {
        card: "summary",
        title: `${title} | ${SITE_NAME}`,
        description,
        images: ["/apple-touch-icon.png"],
    },
};

export default function RegisterLayout({ children }) {
    return children;
}

