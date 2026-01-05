import { describe, it, expect } from "vitest";
import { cx } from "../cx";

describe("cx", () => {
  it("should combine string classes", () => {
    expect(cx("foo", "bar")).toBe("foo bar");
  });

  it("should filter out falsy values", () => {
    expect(cx("foo", null, undefined, false, "bar")).toBe("foo bar");
  });

  it("should handle empty strings", () => {
    expect(cx("foo", "", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes with objects", () => {
    expect(cx("foo", { bar: true, baz: false })).toBe("foo bar");
  });

  it("should handle arrays", () => {
    expect(cx(["foo", "bar"], "baz")).toBe("foo bar baz");
  });

  it("should handle nested arrays", () => {
    expect(cx(["foo", ["bar", "baz"]], "qux")).toBe("foo bar baz qux");
  });

  it("should handle numbers", () => {
    expect(cx("foo", 42, "bar")).toBe("foo 42 bar");
  });

  it("should handle mixed inputs", () => {
    expect(
      cx("foo", { bar: true, baz: false }, ["qux", "quux"], null, "corge")
    ).toBe("foo bar qux quux corge");
  });

  it("should return empty string for no inputs", () => {
    expect(cx()).toBe("");
  });

  it("should deduplicate classes", () => {
    expect(cx("foo", "bar", "foo")).toBe("foo bar");
  });

  it("should handle complex nested structures", () => {
    expect(
      cx(
        "base",
        { active: true, disabled: false },
        ["nested", { inner: true }],
        null,
        undefined
      )
    ).toBe("base active nested inner");
  });
});
