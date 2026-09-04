interface NumberResult {
    count: number;
    unit: "" | "k" | "m"
}

export function formatNumber(n: number): NumberResult {
    if (n < 1000) {
        return {
            count: n,
            unit: ""
        }
    }

    const units: {value: number, suffix: "k" | "m"}[] = [
        { value: 1000000, suffix: "m" },
        { value: 1000, suffix: "k" },
    ];

    for (const u of units) {
        if (n >= u.value) {
            const num = n / u.value;
            return {
                count: Math.floor(num),
                unit: u.suffix
            }
        }
    }

    return {
        count: n,
        unit: ""
    }
}
