export function getAssetUrl(path: string | null | undefined): string {
    if (!path) return '';
    const clean = path.startsWith('/') ? path.slice(1) : path;
    return `${import.meta.env.BASE_URL}${clean}`;
}