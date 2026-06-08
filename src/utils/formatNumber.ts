export function formatNumber(n: number): string {
    if (n < 1000) return String(n);

    const units = [
        { value: 1000000, suffix: "m" },
        { value: 1000, suffix: "k" },
    ];

    for (const u of units) {
        if (n >= u.value) {
            const num = n / u.value;
            return num.toFixed(1) + u.suffix;
        }
    }

    return String(n);
}
