import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Radio } from "../Radio";

describe("Radio", () => {
  it("should render radio with label", () => {
    render(<Radio name="test" value="option1" label="Option 1" />);
    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
  });

  it("should be checked when checked prop is true", () => {
    render(
      <Radio name="test" value="option1" label="Option 1" checked={true} />
    );
    const radio = screen.getByLabelText("Option 1");
    expect(radio).toBeChecked();
  });

  it("should not be checked when checked prop is false", () => {
    render(
      <Radio name="test" value="option1" label="Option 1" checked={false} />
    );
    const radio = screen.getByLabelText("Option 1");
    expect(radio).not.toBeChecked();
  });

  it("should call onChange when clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Radio
        name="test"
        value="option1"
        label="Option 1"
        onChange={handleChange}
      />
    );

    const radio = screen.getByLabelText("Option 1");
    await user.click(radio);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(
      <Radio name="test" value="option1" label="Option 1" disabled />
    );
    const radio = screen.getByLabelText("Option 1");
    expect(radio).toBeDisabled();
  });

  it("should support custom id", () => {
    render(
      <Radio name="test" value="option1" label="Option 1" id="custom-id" />
    );
    const radio = screen.getByLabelText("Option 1");
    expect(radio).toHaveAttribute("id", "custom-id");
  });

  it("should generate id when not provided", () => {
    render(<Radio name="test" value="option1" label="Option 1" />);
    const radio = screen.getByLabelText("Option 1");
    expect(radio).toHaveAttribute("id");
    expect(radio.getAttribute("id")).toContain("radio-");
  });

  it("should support defaultChecked", () => {
    render(
      <Radio name="test" value="option1" label="Option 1" defaultChecked />
    );
    const radio = screen.getByLabelText("Option 1");
    expect(radio).toBeChecked();
  });

  it("should render custom checked icon", () => {
    const customIcon = <span data-testid="custom-checked">✓</span>;
    render(
      <Radio
        name="test"
        value="option1"
        label="Option 1"
        checked={true}
        checkedIcon={customIcon}
      />
    );
    expect(screen.getByTestId("custom-checked")).toBeInTheDocument();
  });

  it("should render custom unchecked icon", () => {
    const customIcon = <span data-testid="custom-unchecked">○</span>;
    render(
      <Radio
        name="test"
        value="option1"
        label="Option 1"
        checked={false}
        uncheckedIcon={customIcon}
      />
    );
    expect(screen.getByTestId("custom-unchecked")).toBeInTheDocument();
  });
});

