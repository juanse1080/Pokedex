import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PokemonCard } from "../PokemonCard";
import { renderWithProviders } from "@/test/helpers";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("PokemonCard", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("should render pokemon name", () => {
    renderWithProviders(<PokemonCard id={1} name="bulbasaur" />);
    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
  });

  it("should render pokemon number with padding", () => {
    renderWithProviders(<PokemonCard id={1} name="bulbasaur" />);
    expect(screen.getByText("#00001")).toBeInTheDocument();
  });

  it("should render pokemon number with correct padding for larger ids", () => {
    renderWithProviders(<PokemonCard id={25} name="pikachu" />);
    expect(screen.getByText("#00025")).toBeInTheDocument();
  });

  it("should have accessible label", () => {
    renderWithProviders(<PokemonCard id={1} name="bulbasaur" />);
    const button = screen.getByRole("button", {
      name: /ver detalles de bulbasaur/i,
    });
    expect(button).toBeInTheDocument();
  });

  it("should navigate to detail page on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PokemonCard id={1} name="bulbasaur" />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/pokemon/1");
  });

  it("should have title attribute", () => {
    renderWithProviders(<PokemonCard id={1} name="bulbasaur" />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("title", "bulbasaur");
  });
});

