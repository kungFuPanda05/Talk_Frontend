const LOCAL_API_URL = "http://localhost:4000";
const LOCAL_APP_URL = "http://localhost:3000";

const normalizePublicUrl = (value, fallback) => {
    const candidate = typeof value === "string" && value.trim() ? value.trim() : fallback;

    try {
        const url = new URL(candidate);

        if (url.protocol !== "http:" && url.protocol !== "https:") {
            return fallback;
        }

        return url.toString().replace(/\/+$/, "");
    } catch {
        return fallback;
    }
};

export const API_BASE_URL = normalizePublicUrl(
    process.env.NEXT_PUBLIC_API_URL,
    LOCAL_API_URL,
);

export const APP_BASE_URL = normalizePublicUrl(
    process.env.NEXT_PUBLIC_APP_URL,
    LOCAL_APP_URL,
);

export const apiAssetUrl = (path) => {
    if (!path) return "";

    const value = String(path);
    if (/^(?:https?:|data:|blob:)/i.test(value)) return value;

    return `${API_BASE_URL}/${value.replace(/^\/+/, "")}`;
};
