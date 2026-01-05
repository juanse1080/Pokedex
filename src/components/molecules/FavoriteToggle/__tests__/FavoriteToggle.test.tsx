import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoriteToggle } from "../FavoriteToggle";

describe("FavoriteToggle", () => {
  it("should render button", () => {
    render(<FavoriteToggle isFavorite={false} onToggle={vi.fn()} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should call onToggle when clicked", async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    render(<FavoriteToggle isFavorite={false} onToggle={handleToggle} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it("should show correct aria-label when not favorite", () => {
    render(<FavoriteToggle isFavorite={false} onToggle={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /agregar a favoritos/i })
    ).toBeInTheDocument();
  });

  it("should show correct aria-label when favorite", () => {
    render(<FavoriteToggle isFavorite={true} onToggle={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /quitar de favoritos/i })
    ).toBeInTheDocument();
  });

  it("should call onClick when provided instead of onToggle", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const handleToggle = vi.fn();
    render(
      <FavoriteToggle
        isFavorite={false}
        onToggle={handleToggle}
        onClick={handleClick}
      />
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleToggle).not.toHaveBeenCalled();
  });

  it("should stop propagation on click", async () => {
    const user = userEvent.setup();
    const handleParentClick = vi.fn();
    const handleToggle = vi.fn();

    render(
      <div onClick={handleParentClick} role="presentation">
        <FavoriteToggle isFavorite={false} onToggle={handleToggle} />
      </div>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleToggle).toHaveBeenCalled();
    expect(handleParentClick).not.toHaveBeenCalled();
  });
});
