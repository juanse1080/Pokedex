import { describe, it, expect, beforeEach, vi } from "vitest";

describe("getPokemonImageUrls", () => {
  let getPokemonImageUrls: (id: number | string) => {
    list: string;
    detail: string;
    home: string;
    dreamWorld: string;
  };

  beforeEach(async () => {
    vi.stubEnv("VITE_SPRITES_BASE", "https://example.com/sprites");
    const module = await import("../pokemon");
    getPokemonImageUrls = module.getPokemonImageUrls;
  });

  it("should generate image URLs for pokemon id", () => {
    const urls = getPokemonImageUrls(1);
    expect(urls.list).toBe("https://example.com/sprites/1.png");
    expect(urls.detail).toBe(
      "https://example.com/sprites/other/official-artwork/1.png"
    );
    expect(urls.home).toBe(
      "https://example.com/sprites/other/home/1.png"
    );
    expect(urls.dreamWorld).toBe(
      "https://example.com/sprites/other/dream-world/1.svg"
    );
  });

  it("should handle string id", () => {
    const urls = getPokemonImageUrls("25");
    expect(urls.list).toBe("https://example.com/sprites/25.png");
    expect(urls.detail).toBe(
      "https://example.com/sprites/other/official-artwork/25.png"
    );
  });

  it("should generate different URLs for different ids", () => {
    const urls1 = getPokemonImageUrls(1);
    const urls2 = getPokemonImageUrls(2);
    expect(urls1.list).not.toBe(urls2.list);
    expect(urls1.detail).not.toBe(urls2.detail);
  });
});

