import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useInfiniteScroll } from "../useInfiniteScroll";

describe("useInfiniteScroll", () => {
  beforeEach(() => {
    globalThis.IntersectionObserver = vi.fn(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    })) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return sentinel ref", () => {
    const { result } = renderHook(() => useInfiniteScroll(true, vi.fn()));

    expect(result.current).toBeDefined();
    expect(result.current.current).toBeNull();
  });

  it("should accept hasMore parameter", () => {
    const { result: result1 } = renderHook(() =>
      useInfiniteScroll(true, vi.fn())
    );
    expect(result1.current).toBeDefined();

    const { result: result2 } = renderHook(() =>
      useInfiniteScroll(false, vi.fn())
    );
    expect(result2.current).toBeDefined();
  });

  it("should accept loadMore function", () => {
    const loadMore = vi.fn();
    const { result } = renderHook(() => useInfiniteScroll(true, loadMore));
    expect(result.current).toBeDefined();
  });

  it("should accept options parameter", () => {
    const { result } = renderHook(() =>
      useInfiniteScroll(true, vi.fn(), { rootMargin: "500px" })
    );
    expect(result.current).toBeDefined();
  });
});
