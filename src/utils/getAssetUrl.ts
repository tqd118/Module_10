import { withBasePath } from "@/config/basePath";

export function getAssetUrl(path: string | null | undefined): string {
    if (!path) return "";
    return withBasePath(path);
}
