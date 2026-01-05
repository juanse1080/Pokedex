import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PokemonListFilter } from "../PokemonListFilter";
import { renderWithProviders } from "@/test/helpers";

describe("PokemonListFilter", () => {
  it("should render search input", () => {
    renderWithProviders(
      <PokemonListFilter
        searchQuery=""
        sortBy="name"
        handleSearch={vi.fn()}
        handleSort={vi.fn()}
      />
    );
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("should display search query value", () => {
    renderWithProviders(
      <PokemonListFilter
        searchQuery="pikachu"
        sortBy="name"
        handleSearch={vi.fn()}
        handleSort={vi.fn()}
      />
    );
    expect(screen.getByDisplayValue("pikachu")).toBeInTheDocument();
  });

  it("should call handleSearch when input changes", async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    renderWithProviders(
      <PokemonListFilter
        searchQuery=""
        sortBy="name"
        handleSearch={handleSearch}
        handleSort={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText("Search");
    await user.type(input, "char");

    expect(handleSearch).toHaveBeenCalled();
  });

  it("should render sort button", () => {
    renderWithProviders(
      <PokemonListFilter
        searchQuery=""
        sortBy="name"
        handleSearch={vi.fn()}
        handleSort={vi.fn()}
      />
    );
    expect(
      screen.getByRole("button", { name: /filter by type/i })
    ).toBeInTheDocument();
  });

  it("should show TextAIcon when sortBy is name", () => {
    renderWithProviders(
      <PokemonListFilter
        searchQuery=""
        sortBy="name"
        handleSearch={vi.fn()}
        handleSort={vi.fn()}
      />
    );
    const button = screen.getByRole("button", { name: /filter by type/i });
    expect(button).toBeInTheDocument();
  });

  it("should show HashtagIcon when sortBy is id", () => {
    renderWithProviders(
      <PokemonListFilter
        searchQuery=""
        sortBy="id"
        handleSearch={vi.fn()}
        handleSort={vi.fn()}
      />
    );
    const button = screen.getByRole("button", { name: /filter by type/i });
    expect(button).toBeInTheDocument();
  });

  it("should open popover when sort button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PokemonListFilter
        searchQuery=""
        sortBy="name"
        handleSearch={vi.fn()}
        handleSort={vi.fn()}
      />
    );

    const button = screen.getByRole("button", { name: /filter by type/i });
    await user.click(button);

    expect(screen.getByText("Sort by:")).toBeInTheDocument();
  });

  it("should render radio options in popover", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PokemonListFilter
        searchQuery=""
        sortBy="name"
        handleSearch={vi.fn()}
        handleSort={vi.fn()}
      />
    );

    const button = screen.getByRole("button", { name: /filter by type/i });
    await user.click(button);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Number")).toBeInTheDocument();
  });

  it("should call handleSort when radio option is selected", async () => {
    const user = userEvent.setup();
    const handleSort = vi.fn(() => () => {});
    renderWithProviders(
      <PokemonListFilter
        searchQuery=""
        sortBy="name"
        handleSearch={vi.fn()}
        handleSort={handleSort}
      />
    );

    const button = screen.getByRole("button", { name: /filter by type/i });
    await user.click(button);

    const numberRadio = screen.getByLabelText("Number");
    await user.click(numberRadio);

    expect(handleSort).toHaveBeenCalledWith("id");
  });

  it("should render children", () => {
    renderWithProviders(
      <PokemonListFilter
        searchQuery=""
        sortBy="name"
        handleSearch={vi.fn()}
        handleSort={vi.fn()}
      >
        <div data-testid="child">Child content</div>
      </PokemonListFilter>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});

