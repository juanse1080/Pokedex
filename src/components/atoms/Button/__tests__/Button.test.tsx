import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";

describe("Button", () => {
  it("should render button with children", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should support custom className", () => {
    const { container } = render(
      <Button className="custom-class">Click me</Button>
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("custom-class");
  });

  it("should support aria-label", () => {
    render(<Button aria-label="Close dialog">×</Button>);
    expect(
      screen.getByRole("button", { name: "Close dialog" })
    ).toBeInTheDocument();
  });

  it("should support type attribute", () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("should support all button HTML attributes", () => {
    render(
      <Button data-testid="test-button" title="Tooltip">
        Click me
      </Button>
    );
    const button = screen.getByTestId("test-button");
    expect(button).toHaveAttribute("title", "Tooltip");
  });
});
