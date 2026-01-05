import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing/react";
import type { MockedResponse } from "@apollo/client/testing";
import { FavoritesProvider } from "@/contexts/FavoritesContexts/FavoritesProvider";

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialEntries?: string[];
  mocks?: MockedResponse[];
  favorites?: Array<{ id: number; name: string }>;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    initialEntries = ["/"],
    mocks = [],
    favorites = [],
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  Object.defineProperty(globalThis, "localStorage", {
    value: localStorageMock,
  });

  if (favorites.length > 0) {
    localStorageMock.setItem("pokedex_favorites", JSON.stringify(favorites));
  }

  function Wrapper({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <MockedProvider mocks={mocks}>
          <FavoritesProvider>{children}</FavoritesProvider>
        </MockedProvider>
      </MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from "@testing-library/react";
export { renderWithProviders as render };
