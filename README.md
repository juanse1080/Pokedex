# Pokédex React GraphQL

Pokédex profesional construida con React, Apollo Client y GraphQL, siguiendo principios de Atomic Design y mejores prácticas de desarrollo frontend.

## 🎯 Características

- ✅ Lista de Pokémon con scroll infinito
- ✅ Lista de Pokémon REST API alternativa
- ✅ Página de favoritos con persistencia en localStorage
- ✅ Vista de detalle de Pokémon (nombre, tipos, imagen, peso, altura, estadísticas, movimientos)
- ✅ Sistema de favoritos con contexto React
- ✅ Filtro por tipo de Pokémon
- ✅ Búsqueda con validación (mínimo 3 caracteres, sin caracteres especiales)
- ✅ Ordenamiento por ID o nombre
- ✅ Diseño responsive y accesible
- ✅ Estados de carga y error manejados
- ✅ Tests unitarios incluidos

## 📋 Checklist de Requisitos

### Funcionalidades

- [x] Lista de Pokémon paginada/lazy-load
- [x] Orden alfabético por nombre
- [x] Estados: loading, error, empty
- [x] Búsqueda por nombre con validación
- [x] Vista de detalle de Pokémon
- [x] Sistema de favoritos con localStorage
- [x] Filtro por tipo
- [x] Validación de input (min 3 chars, sin especiales)

### Arquitectura

- [x] Atomic Design implementado
- [x] Hooks personalizados
- [x] Queries GraphQL separadas
- [x] Utilidades modulares
- [x] Componentes reutilizables

### Testing

- [x] Tests de validación
- [x] Tests de favoritos
- [x] Tests de ordenamiento
- [x] Tests de storage

## 🛠 Stack Tecnológico

- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Apollo Client** - Cliente GraphQL
- **React Router v7** - Navegación
- **CSS Modules** - Estilos modulares
- **Vitest** - Framework de testing
- **Testing Library** - Utilidades de testing
- **Vite** - Build tool

## 📦 Instalación

```bash
pnpm install
```

## 🚀 Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

### Rutas Disponibles

- `/` - Lista principal de Pokémon (GraphQL)
- `/rest` - Lista alternativa de Pokémon (REST API)
- `/favorites` - Lista de Pokémon favoritos
- `/pokemon/:id` - Detalle de un Pokémon específico

## 🧪 Testing

```bash
pnpm test
```

Para ejecutar tests en modo watch:

```bash
pnpm test --watch
```

Para abrir la UI de tests:

```bash
pnpm test:ui
```

## 🏗 Build

```bash
pnpm build
```

## 📁 Estructura del Proyecto

```
src/
  apollo/
    client.ts                    # Configuración Apollo Client
  graphql/
    queries/
      pokemonList.query.ts       # Query lista de Pokémon
      pokemonDetail.query.ts     # Query detalle de Pokémon
      pokemonTypeList.query.ts   # Query lista de tipos
    types.ts                     # Tipos TypeScript
  hooks/
    usePokemonDetail.ts          # Hook detalle de Pokémon
    usePokemonTypes.ts           # Hook tipos de Pokémon
    usePokemonListFilters.ts     # Hook filtros de lista
    useFilteredPokemon.ts        # Hook filtrado y ordenamiento
    useInfinitePokemonList.ts    # Hook lista infinita GraphQL
    useInfinitePokemonListRest.ts # Hook lista infinita REST
    useInfiniteScroll.ts         # Hook scroll infinito
    useDebouncedValue.ts         # Hook debounce
  utils/
    storage.ts                   # Utilidades localStorage
    pokemon.ts                   # Utilidades Pokémon
    fetcher.ts                   # Utilidades fetch
    cx.ts                        # Utilidad className
  contexts/
    FavoritesContexts/           # Contexto de favoritos
      FavoritesProvider.tsx
      useFavoritesContext.ts
  const/
    colors.ts                    # Constantes de colores
    labels.ts                    # Constantes de etiquetas
  components/
    atoms/                       # Componentes básicos
      Button/
      Input/
      Badge/
      IconButton/
      Spinner/
      Typography/
      Select/
      Radio/
      Progress/
      Popover/
      [más componentes...]
    molecules/                   # Componentes compuestos
      PokemonCard/
      FavoriteToggle/
      LazyImage/
    organisms/                   # Componentes complejos
      PokemonListContent/
      PokemonListFilter/
      PokemonListHeader/
      PokemonDetailHeader/
      PokemonDetailInfo/
      PokemonDetailMedia/
    templates/                   # Plantillas de página
      PokemonListTemplate/
      PokemonDetailTemplate/
    pages/                       # Páginas
      PokemonListPage/
      PokemonListRestPage/
      PokemonListFavoritesPage/
      PokemonDetailPage/
  styles/
    globals.css                  # Estilos globales
    variables.css                # Variables CSS
    typography.css               # Tipografía
    shadows.css                  # Sombras
```

## 🎨 Decisiones Técnicas

### Atomic Design

Se implementó Atomic Design para mantener una estructura clara y escalable:

- **Atoms**: Componentes básicos reutilizables (Button, Input, Badge)
- **Molecules**: Combinaciones de atoms (SearchBar, PokemonCard)
- **Organisms**: Componentes complejos (PokemonGrid, PokemonDetailPanel)
- **Templates**: Estructuras de página
- **Pages**: Páginas finales con routing

### Hooks Personalizados

- `useInfinitePokemonList`: Maneja la lista infinita con filtros y búsqueda (GraphQL)
- `useInfinitePokemonListRest`: Maneja la lista infinita usando REST API
- `usePokemonDetail`: Obtiene detalles de un Pokémon
- `usePokemonTypes`: Obtiene la lista de tipos de Pokémon
- `usePokemonListFilters`: Gestiona el estado de los filtros
- `useFilteredPokemon`: Filtra y ordena Pokémon en el cliente
- `useInfiniteScroll`: Detecta cuando el usuario llega al final de la página
- `useDebouncedValue`: Optimiza búsquedas con debounce
- `useFavoritesContext`: Hook para acceder al contexto de favoritos

### Apollo Client

- Cache configurado con `InMemoryCache`
- Endpoint configurado mediante variable de entorno `VITE_POKEMON_GRAPHQL_URI`
- Queries optimizadas para obtener solo datos necesarios
- Scroll infinito implementado con paginación

### Validación de Input

- Mínimo 3 caracteres
- Solo letras, números y guiones
- Validación en tiempo real
- Botón deshabilitado si input inválido
- Mensajes de error accesibles

### Sistema de Favoritos

- Implementado con React Context API
- Persistencia en localStorage
- Acceso mediante `useFavoritesContext` hook
- Página dedicada para ver favoritos (`/favorites`)

### CSS Modules

Se eligió CSS Modules para:

- Estilos encapsulados y modulares
- Mejor rendimiento (sin runtime)
- Compatibilidad nativa con TypeScript
- Variables CSS globales para temas consistentes
- Path aliases configurados con `@/` para imports limpios

## 🔍 GraphQL

El proyecto consume una API GraphQL configurada mediante variable de entorno:

- Variable: `VITE_POKEMON_GRAPHQL_URI`
- Configuración en `.env` o `.env.local`

### Queries Principales

**Lista de Pokémon:**

```graphql
query PokemonListWithCount(
  $limit: Int!
  $offset: Int!
  $orderBy: [pokemon_order_by!]
  $where: pokemon_bool_exp = {}
) {
  pokemon(limit: $limit, offset: $offset, order_by: $orderBy, where: $where) {
    id
    name
    order
  }
  pokemon_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}
```

**Detalle de Pokémon:**

```graphql
query GetPokemonDetail($id: Int!) {
  pokemon(where: { id: { _eq: $id } }, limit: 1) {
    id
    name
    height
    weight
    pokemontypes {
      type {
        name
      }
    }
    pokemonmoves(order_by: { move: { id: desc } }, limit: 2) {
      move {
        name
      }
    }
    pokemonstats {
      base_stat
      stat {
        name
      }
    }
    pokemonspecy {
      pokemonspeciesflavortexts(
        where: { language: { name: { _eq: "en" } } }
        limit: 2
      ) {
        flavor_text
      }
    }
  }
}
```

**Lista de Tipos:**

```graphql
query Types {
  type {
    id
    name
  }
}
```

## 🧪 Tests

Los tests cubren:

- Validación de búsqueda (min 3 chars, sin especiales)
- Persistencia de favoritos en localStorage
- Ordenamiento alfabético
- Funcionalidad de favoritos (toggle, isFavorite)

Ejecutar tests:

```bash
pnpm test
```

## 🚢 Deploy

[Agregar link del deploy cuando esté disponible]

## 📝 Notas Adicionales

### Configuración

- Crear archivo `.env.local` con la variable `VITE_POKEMON_GRAPHQL_URI` apuntando al endpoint GraphQL
- El proyecto incluye una página alternativa (`/rest`) que usa REST API en lugar de GraphQL

### Path Aliases

El proyecto utiliza path aliases configurados con `@/`:

- `@/pages` → `src/components/pages`
- `@/atoms` → `src/components/atoms`
- `@/molecules` → `src/components/molecules`
- `@/organisms` → `src/components/organisms`
- `@/templates` → `src/components/templates`
- `@/hooks` → `src/hooks`
- `@/graphql` → `src/graphql`
- `@/apollo` → `src/apollo`
- `@/styles` → `src/styles`
- `@/utils` → `src/utils`
- `@/const` → `src/const`
- `@/contexts` → `src/contexts`

### Funcionalidades

- La búsqueda y filtros se aplican en el cliente después de obtener los datos
- El ordenamiento se puede realizar por ID o nombre usando `localeCompare`
- Scroll infinito implementado para mejor rendimiento con grandes listas
- Sistema de favoritos persistente con React Context y localStorage

## 👤 Autor

Desarrollado siguiendo mejores prácticas de desarrollo frontend profesional.
