import { it, expect, describe } from 'vitest'
import { getAssetUrl } from './getAssetUrl'

describe("getAssetUrl", () => {
    it("returns empty string for null input", () => {
        expect(getAssetUrl(null)).toBe("");
        expect(getAssetUrl("")).toBe("");
    });

    it("returns path itself for blob paths", () => {
        expect(getAssetUrl("blob:http://localhost:5173/9ec69751-331e-4212-8360-f4c5fea258c8"))
            .toBe("blob:http://localhost:5173/9ec69751-331e-4212-8360-f4c5fea258c8");
    });

    it("returns path that starts with '/Module_10/' prefix", () => {
        expect(getAssetUrl("/assets/post-image-1.png"))
            .toBe("/Module_10/assets/post-image-1.png");
    });
})