import client from "@/apollo/client";
import { PokemonDetailPage } from "@/pages/PokemonDetailPage";
import { PokemonListPage } from "@/pages/PokemonListPage";
import { PokemonListRestPage } from "@/pages/PokemonListRestPage";
import { PokemonListFavoritesPage } from "@/pages/PokemonListFavoritesPage";
import { ApolloProvider } from "@apollo/client/react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContexts";

function App() {
  return (
    <ApolloProvider client={client}>
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PokemonListPage />} />
            <Route path="/rest" element={<PokemonListRestPage />} />
            <Route path="/favorites" element={<PokemonListFavoritesPage />} />
            <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </ApolloProvider>
  );
}

export default App;
