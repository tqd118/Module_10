import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import formatTime from "@/utils/formatTime";

describe("formatTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-04T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns minutes if input date less than 60 minutes ago", () => {
    const date = "2026-06-04T11:45:00Z";
    expect(formatTime(date)).toBe("15 min");
  });

  it("returns hours if input date less than 24 hours ago", () => {
    const date = "2026-06-04T09:00:00Z";
    expect(formatTime(date)).toBe("3 hours");
  });

  it("returns days if input date is mode then 24 hours ago", () => {
    const date = "2026-06-02T12:00:00Z";
    expect(formatTime(date)).toBe("2 day");
  });
});
