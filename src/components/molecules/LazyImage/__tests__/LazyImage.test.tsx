import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { LazyImage } from "../LazyImage";

describe("LazyImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render image with src and alt", () => {
    render(<LazyImage src="https://example.com/image.png" alt="Test image" />);
    const img = screen.getByAltText("Test image");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/image.png");
  });

  it("should have lazy loading attribute", () => {
    render(<LazyImage src="https://example.com/image.png" alt="Test image" />);
    const img = screen.getByAltText("Test image");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("should have async decoding attribute", () => {
    render(<LazyImage src="https://example.com/image.png" alt="Test image" />);
    const img = screen.getByAltText("Test image");
    expect(img).toHaveAttribute("decoding", "async");
  });

  it("should support width and height", () => {
    render(
      <LazyImage
        src="https://example.com/image.png"
        alt="Test image"
        width={100}
        height={100}
      />
    );
    const img = screen.getByAltText("Test image");
    expect(img).toHaveAttribute("width", "100");
    expect(img).toHaveAttribute("height", "100");
  });

  it("should show skeleton initially", () => {
    render(
      <LazyImage src="https://example.com/image.png" alt="Test image" />
    );
    const skeleton = document.querySelector('[aria-hidden="true"]');
    expect(skeleton).toBeInTheDocument();
  });

  it("should show fallback when image fails to load", async () => {
    render(
      <LazyImage
        src="https://invalid-url-that-fails.com/image.png"
        alt="Test image"
      />
    );

    const img = screen.getByAltText("Test image");
    Object.defineProperty(img, "complete", { value: false });
    Object.defineProperty(img, "naturalWidth", { value: 0 });

    img.dispatchEvent(new Event("error"));

    await waitFor(() => {
      expect(screen.getByLabelText("Test image")).toHaveTextContent("No image");
    });
  });

  it("should support custom className", () => {
    const { container } = render(
      <LazyImage
        src="https://example.com/image.png"
        alt="Test image"
        className="custom-class"
      />
    );
    const root = container.firstChild;
    expect(root).toHaveClass("custom-class");
  });

  it("should support custom imgClassName", () => {
    render(
      <LazyImage
        src="https://example.com/image.png"
        alt="Test image"
        imgClassName="custom-img-class"
      />
    );
    const img = screen.getByAltText("Test image");
    expect(img).toHaveClass("custom-img-class");
  });

  it("should apply loaded state when image loads", async () => {
    const { container } = render(
      <LazyImage src="https://example.com/image.png" alt="Test image" />
    );

    const img = screen.getByAltText("Test image");
    Object.defineProperty(img, "complete", { value: true });
    Object.defineProperty(img, "naturalWidth", { value: 100 });

    img.dispatchEvent(new Event("load"));

    await waitFor(() => {
      const root = container.firstChild as HTMLElement;
      expect(root.className).toContain("isLoaded");
    });
  });
});
