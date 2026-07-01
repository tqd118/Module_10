export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/Module_10";
export const REPO_NAME = BASE_PATH.replace(/^\/+/, "");

export function withBasePath(path: string): string {
    if (!path) return path;
    if (
        /^(?:[a-z]+:)?\/\//i.test(path) ||
        path.startsWith("blob:") ||
        path.startsWith("data:")
    ) {
        return path;
    }

    const normalizedBase = BASE_PATH === "/" ? "" : BASE_PATH.replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    if (!normalizedBase) return normalizedPath;
    if (normalizedPath === normalizedBase || normalizedPath.startsWith(`${normalizedBase}/`)) {
        return normalizedPath;
    }

    return `${normalizedBase}${normalizedPath}`;
}