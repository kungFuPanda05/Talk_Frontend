import {
    SITE_NAME,
    SOCIAL_IMAGE,
} from "@/utils/siteMetadata";

const title = "Random Chat & Meet New People Online";
const description =
    "Join ChitTalk to meet new people through instant one-to-one random chats. Sign in to start real-time conversations and share messages or photos.";

export const metadata = {
    title,
    description,
    alternates: {
        canonical: "/login",
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
        url: "/login",
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

export default function LoginLayout({ children }) {
    return children;
}
