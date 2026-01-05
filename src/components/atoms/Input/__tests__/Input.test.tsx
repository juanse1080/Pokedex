import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../Input";

describe("Input", () => {
  it("should render input with value", () => {
    render(<Input value="test" onChange={vi.fn()} />);
    const input = screen.getByDisplayValue("test");
    expect(input).toBeInTheDocument();
  });

  it("should call onChange when value changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input value="" onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "p");

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenLastCalledWith("p");
  });

  it("should display placeholder", () => {
    render(<Input value="" onChange={vi.fn()} placeholder="Search..." />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Input value="test" onChange={vi.fn()} disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("should show error state", () => {
    render(<Input value="test" onChange={vi.fn()} error />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("should support aria-label", () => {
    render(
      <Input value="test" onChange={vi.fn()} aria-label="Search pokemon" />
    );
    expect(screen.getByLabelText("Search pokemon")).toBeInTheDocument();
  });

  it("should support aria-describedby", () => {
    render(
      <>
        <Input
          value="test"
          onChange={vi.fn()}
          aria-describedby="error-message"
        />
        <div id="error-message">Error message</div>
      </>
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-describedby", "error-message");
  });

  it("should render start adornment", () => {
    render(
      <Input value="test" onChange={vi.fn()} startAdornment={<span>🔍</span>} />
    );
    expect(screen.getByText("🔍")).toBeInTheDocument();
  });

  it("should render end adornment", () => {
    render(
      <Input value="test" onChange={vi.fn()} endAdornment={<span>✕</span>} />
    );
    expect(screen.getByText("✕")).toBeInTheDocument();
  });

  it("should support custom type", () => {
    render(<Input value="test" onChange={vi.fn()} type="password" />);
    const input = document.querySelector('input[type="password"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");
  });
});
