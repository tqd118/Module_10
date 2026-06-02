export function getAssetUrl(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('blob:http')) return path;
    const clean = path.startsWith('/') ? path.slice(1) : path;
    return `/Module_10/${clean}`;
}