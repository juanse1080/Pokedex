import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "../Select";
import type { SelectOption } from "../Select";

const options: SelectOption[] = [
  { value: "all", label: "All types" },
  { value: "fire", label: "Fire" },
  { value: "water", label: "Water" },
  { value: "grass", label: "Grass" },
];

describe("Select", () => {
  it("should render select with options", () => {
    render(<Select value="fire" onChange={vi.fn()} options={options} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Fire")).toBeInTheDocument();
  });

  it("should call onChange when value changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select value="fire" onChange={handleChange} options={options} />);

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "water");

    expect(handleChange).toHaveBeenCalledWith("water");
  });

  it("should display placeholder when provided", () => {
    render(
      <Select
        value=""
        onChange={vi.fn()}
        options={options}
        placeholder="Select a type"
      />
    );
    expect(screen.getByText("Select a type")).toBeInTheDocument();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Select value="fire" onChange={vi.fn()} options={options} disabled />);
    const select = screen.getByRole("combobox");
    expect(select).toBeDisabled();
  });

  it("should show error state", () => {
    render(<Select value="fire" onChange={vi.fn()} options={options} error />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("aria-invalid", "true");
  });

  it("should support aria-label", () => {
    render(
      <Select
        value="fire"
        onChange={vi.fn()}
        options={options}
        aria-label="Select pokemon type"
      />
    );
    expect(screen.getByLabelText("Select pokemon type")).toBeInTheDocument();
  });

  it("should support aria-describedby", () => {
    render(
      <>
        <Select
          value="fire"
          onChange={vi.fn()}
          options={options}
          aria-describedby="error-message"
        />
        <div id="error-message">Error message</div>
      </>
    );
    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("aria-describedby", "error-message");
  });

  it("should render start adornment", () => {
    render(
      <Select
        value="fire"
        onChange={vi.fn()}
        options={options}
        startAdornment={<span>🔍</span>}
      />
    );
    expect(screen.getByText("🔍")).toBeInTheDocument();
  });

  it("should render end adornment", () => {
    render(
      <Select
        value="fire"
        onChange={vi.fn()}
        options={options}
        endAdornment={<span>▼</span>}
      />
    );
    expect(screen.getByText("▼")).toBeInTheDocument();
  });

  it("should disable individual options", () => {
    const optionsWithDisabled: SelectOption[] = [
      ...options,
      { value: "disabled", label: "Disabled", disabled: true },
    ];
    render(
      <Select value="fire" onChange={vi.fn()} options={optionsWithDisabled} />
    );
    const select = screen.getByRole("combobox");
    const disabledOption = Array.from(select.querySelectorAll("option")).find(
      (opt) => opt.value === "disabled"
    );
    expect(disabledOption).toBeDisabled();
  });
});

