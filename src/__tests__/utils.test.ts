import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    const result = cn("text-white", "bg-black");
    expect(result).toContain("text-white");
    expect(result).toContain("bg-black");
  });

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", "visible");
    expect(result).toContain("base");
    expect(result).toContain("visible");
    expect(result).not.toContain("hidden");
  });

  it("handles undefined and null values", () => {
    const result = cn("base", undefined, null, "end");
    expect(result).toContain("base");
    expect(result).toContain("end");
  });

  it("merges Tailwind conflicts correctly", () => {
    const result = cn("px-4", "px-6");
    // tailwind-merge should keep only the last conflicting class
    expect(result).toContain("px-6");
    expect(result).not.toContain("px-4");
  });

  it("returns empty string for no arguments", () => {
    const result = cn();
    expect(result).toBe("");
  });
});
