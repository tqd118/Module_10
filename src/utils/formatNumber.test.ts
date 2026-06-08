import { describe, it, expect } from "vitest";
import { formatNumber } from "./formatNumber";

describe("formatNumber", () => {
    it("returns number as a string if number is less then 1000", () => {
        expect(formatNumber(800)).toBe("800")
    });

    it("returns number with postfix 'k' if number is greater then 1000", () => {
        expect(formatNumber(1500)).toBe("1.5k")
    });

    it("returns number with postfix 'm' if number is greater then 1000000", () => {
        expect(formatNumber(1234567)).toBe("1.2m")
    });
})