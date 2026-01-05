# Pokédex React GraphQL

Aplicación web profesional de Pokédex construida con React, Apollo Client y GraphQL. Implementa una arquitectura escalable siguiendo Atomic Design, con manejo robusto de estados, validación de inputs, sistema de favoritos persistente y optimizaciones de performance.

## 🎯 Características

- ✅ Lista de Pokémon con scroll infinito (GraphQL y REST API)
- ✅ Vista de detalle de Pokémon (nombre, tipos, imagen, peso, altura, estadísticas, movimientos)
- ✅ Sistema de favoritos con persistencia en localStorage
- ✅ Filtro por tipo de Pokémon
- ✅ Búsqueda con validación (mínimo 3 caracteres, sin caracteres especiales)
- ✅ Ordenamiento por ID o nombre (alfabético)
- ✅ Navegación entre Pokémon con teclado (ArrowLeft/ArrowRight)
- ✅ Diseño responsive y accesible
- ✅ Estados de carga, error y vacío manejados
- ✅ Tests unitarios con cobertura de funcionalidades clave

## 🚀 Demo / Deploy

La aplicación está desplegada automáticamente en GitHub Pages mediante CI/CD.

**URL del sitio**: `https://juanse1080.github.io/pokedex/`

## 🛠 Stack Tecnológico

- **React 19** - Biblioteca UI
- **TypeScript 5.9** - Tipado estático
- **Vite 7** - Build tool y dev server
- **Apollo Client 4** - Cliente GraphQL
- **React Router v7** - Navegación
- **CSS Modules** - Estilos modulares
- **Vitest** - Framework de testing
- **Testing Library** - Utilidades de testing

## 📋 Requisitos Previos

- **Node.js**: 18.x o superior
- **pnpm**: 8.x o superior (recomendado) o npm 9.x+

## 📦 Instalación

```bash
pnpm install
```

## 🚀 Ejecución

### Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

### Testing

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

### Build

```bash
pnpm build
```

El build de producción se generará en `dist/`

### Preview del build

```bash
pnpm preview
```

## 🗂 Estructura del Proyecto

```
src/
├── apollo/
│   └── client.ts                    # Configuración Apollo Client
├── graphql/
│   ├── queries/
│   │   ├── pokemonList.query.ts     # Query lista de Pokémon
│   │   ├── pokemonDetail.query.ts   # Query detalle de Pokémon
│   │   └── pokemonTypeList.query.ts # Query lista de tipos
│   └── types.ts                     # Tipos TypeScript generados
├── hooks/
│   ├── usePokemonDetail.ts          # Hook detalle de Pokémon
│   ├── usePokemonTypes.ts           # Hook tipos de Pokémon
│   ├── usePokemonListFilters.ts     # Hook gestión de filtros
│   ├── useFilteredPokemon.ts        # Hook filtrado y ordenamiento (cliente)
│   ├── useInfinitePokemonList.ts    # Hook lista infinita GraphQL
│   ├── useInfinitePokemonListRest.ts # Hook lista infinita REST
│   ├── useInfiniteScroll.ts         # Hook scroll infinito (IntersectionObserver)
│   └── useDebouncedValue.ts         # Hook debounce para búsqueda
├── utils/
│   ├── storage.ts                   # Utilidades localStorage (favoritos)
│   ├── pokemon.ts                   # Utilidades Pokémon (URLs de imágenes)
│   ├── fetcher.ts                   # Utilidades fetch (REST API)
│   └── cx.ts                        # Utilidad className condicional
├── contexts/
│   └── FavoritesContexts/           # Contexto de favoritos
│       ├── FavoritesProvider.tsx
│       └── useFavoritesContext.ts
├── const/
│   ├── colors.ts                    # Constantes de colores
│   └── labels.ts                    # Constantes de etiquetas
├── components/
│   ├── atoms/                       # Componentes básicos (Button, Input, Badge, etc.)
│   ├── molecules/                   # Componentes compuestos (PokemonCard, FavoriteToggle, LazyImage)
│   ├── organisms/                   # Componentes complejos (PokemonListContent, PokemonListFilter, etc.)
│   ├── templates/                   # Plantillas de página (PokemonListTemplate, PokemonDetailTemplate)
│   └── pages/                       # Páginas con routing
│       ├── PokemonListPage/         # Lista principal (GraphQL)
│       ├── PokemonListRestPage/     # Lista alternativa (REST)
│       ├── PokemonListFavoritesPage/ # Lista de favoritos
│       └── PokemonDetailPage/       # Detalle de Pokémon
├── styles/
│   ├── globals.css                  # Estilos globales
│   ├── variables.css                # Variables CSS (tokens de diseño)
│   ├── typography.css               # Tipografía
│   └── shadows.css                  # Sombras
└── test/
    ├── factories.ts                 # Factories para crear datos de prueba
    ├── mocks.ts                     # Mocks de GraphQL (MockedProvider)
    ├── helpers.tsx                  # Helpers de testing (renderWithProviders)
    └── setup.ts                     # Configuración de tests
```

## 🏗 Arquitectura

### Flujo de Datos: Data → Hooks → UI

1. **GraphQL/REST API** → Datos desde servidor
2. **Hooks personalizados** → Lógica de negocio y estado
   - `useInfinitePokemonList`: Gestiona paginación, filtros y búsqueda (GraphQL)
   - `useFilteredPokemon`: Filtrado y ordenamiento en cliente (para REST)
   - `usePokemonListFilters`: Estado de filtros (búsqueda, orden, tipo)
   - `useDebouncedValue`: Optimiza búsqueda con debounce (500ms)
3. **Componentes UI** → Presentación y interacción
   - Atomic Design: atoms → molecules → organisms → templates → pages

### Manejo de Estados

- **Loading**: Skeletons y spinners durante carga inicial y paginación
- **Error**: Mensajes descriptivos con posibilidad de reintento
- **Empty**: Mensajes informativos cuando no hay resultados
- **Success**: Renderizado de datos con optimizaciones (lazy loading de imágenes)

### Sistema de Favoritos

- **API del hook**: `useFavoritesContext()` expone:
  - `favorites`: Array de favoritos
  - `toggleFavorite(pokemon)`: Agregar/remover favorito
  - `isFavorite(id)`: Verificar si es favorito
- **Persistencia**: localStorage con clave `pokedex_favorites`
- **Deduplicación**: Automática al agregar (verifica por `id`)
- **Formato**: `Array<{ id: number; name: string }>`

### Validación de Input

**Reglas de búsqueda:**

- Mínimo 3 caracteres para activar búsqueda
- Solo letras, números, espacios y guiones (`/^[a-z0-9\s-]+$/i`)
- Sin caracteres especiales

**Cómo afecta UX:**

- Botón de búsqueda deshabilitado si input inválido
- Búsqueda no se ejecuta hasta cumplir reglas
- Mensajes de error accesibles con `aria-invalid` y `aria-describedby`
- Validación en tiempo real con feedback visual

### Accesibilidad

**Implementado:**

- **Navegación por teclado**: ArrowLeft/ArrowRight para navegar entre Pokémon en detalle
- **Focus states**: `:focus-visible` en todos los elementos interactivos
- **ARIA labels**: `aria-label`, `aria-describedby`, `aria-invalid` en inputs
- **Roles semánticos**: `button`, `textbox`, `dialog` (popover)
- **Inputs ocultos visualmente**: Radio buttons con técnica de screen-reader-only
- **Manejo de teclado**: Enter/Espacio en elementos no-button con `role="button"`

## 🧪 Testing

### Cobertura

Los tests cubren:

- ✅ **Validación de búsqueda**: Mínimo 3 caracteres, sin caracteres especiales
- ✅ **Ordenamiento alfabético**: Por ID y por nombre
- ✅ **Sistema de favoritos**: Toggle, persistencia en localStorage, verificación
- ✅ **Filtrado por tipo**: Funcionalidad de filtros
- ✅ **Componentes UI**: Input, FavoriteToggle, PokemonCard
- ✅ **Hooks**: useFilteredPokemon, useDebouncedValue, usePokemonDetail
- ✅ **Utils**: storage, cx, pokemon

### Estrategia de Mocking

**GraphQL**: Se utiliza `MockedProvider` de Apollo Client (`@apollo/client/testing/react`)

- Mocks centralizados en `src/test/mocks.ts`
- Factories reutilizables en `src/test/factories.ts`
- Helper `renderWithProviders()` que envuelve componentes con:
  - `MockedProvider` (GraphQL)
  - `MemoryRouter` (routing)
  - `FavoritesProvider` (contexto)
  - localStorage mock

**Ejemplo de uso:**

```typescript
import { renderWithProviders } from "@/test/helpers";
import { createPokemonListMock } from "@/test/mocks";

const mocks = [createPokemonListMock(SAMPLE_POKEMON_LIST)];
renderWithProviders(<PokemonListPage />, { mocks });
```

## ⚡ Performance / UX

**Optimizaciones implementadas:**

1. **Scroll infinito**: IntersectionObserver con `rootMargin: 200px` para precarga
2. **Debounce en búsqueda**: 500ms para reducir requests innecesarios
3. **Lazy loading de imágenes**: Componente `LazyImage` con loading nativo
4. **Deduplicación en paginación**: Evita duplicados al hacer `fetchMore`
5. **Memoización**: `useMemo` en filtros y ordenamiento
6. **CSS Modules**: Estilos encapsulados sin runtime overhead
7. **Variables CSS centralizadas**: Tokens de diseño reutilizables

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto con:

```env
VITE_POKEMON_GRAPHQL_URI=https://graphql.pokeapi.co/v1beta2
VITE_POKEMON_REST_URI=https://pokeapi.co/api/v2
VITE_SPRITES_BASE=https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon
VITE_BASE_PATH=/
```

**Nota**: `VITE_BASE_PATH` solo es necesario para desarrollo local. En producción (GitHub Pages) se calcula automáticamente.

### Path Aliases

El proyecto utiliza path aliases configurados en `vite.config.ts`:

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
- `@/test` → `src/test`

## 🛣 Rutas Disponibles

- `/` - Lista principal de Pokémon (GraphQL)
- `/rest` - Lista alternativa de Pokémon (REST API)
- `/favorites` - Lista de Pokémon favoritos
- `/pokemon/:id` - Detalle de un Pokémon específico

## 📦 Despliegue en GitHub Pages

### Configuración Inicial

1. **Habilitar GitHub Pages**:

   - Ve a tu repositorio en GitHub
   - Settings → Pages (menú lateral)
   - En "Source", selecciona: **GitHub Actions**
   - Guarda los cambios

2. **Configurar Secrets (Opcional)**:
   - Si necesitas cambiar las URLs por defecto en producción:
   - Settings → Secrets and variables → Actions
   - New repository secret
   - Agrega: `VITE_POKEMON_GRAPHQL_URI`, `VITE_POKEMON_REST_URI`, `VITE_SPRITES_BASE`
   - Si no defines secrets, se usarán los valores por defecto del workflow

### Despliegue Automático

El despliegue se ejecuta automáticamente al hacer push a la rama `main`:

```bash
git add .
git commit -m "feat: actualización"
git push origin main
```

### Verificar el Deploy

1. **Revisar el workflow**:

   - Ve a la pestaña "Actions" en GitHub
   - Verifica que el workflow "Deploy to GitHub Pages" se ejecute correctamente
   - Espera 2-3 minutos para que complete

2. **Obtener la URL del sitio**:

   - Una vez completado, ve a Settings → Pages
   - Verás: "Your site is live at https://..."
   - O usa el formato: `https://<TU_USERNAME>.github.io/<REPO_NAME>/`

3. **Verificar funcionalidad**:
   - ✅ Assets cargan correctamente (imágenes, CSS, fuentes)
   - ✅ Navegación interna funciona (click en Pokémon, favoritos, etc.)
   - ✅ Refresh en rutas no revienta (ej: `/pokemon/1` → F5)
   - ✅ Datos de GraphQL se cargan

### Estructura del Workflow

El workflow (`.github/workflows/deploy.yml`) realiza:

- Build con base path dinámico según el nombre del repo
- Upload del artifact a GitHub Pages
- Deploy automático

**No requiere configuración manual adicional** una vez habilitado GitHub Pages.

## 📝 Próximos Pasos

1. **Tests de integración**: Flujos completos (búsqueda → filtro → detalle → favorito)
2. **Optimización de imágenes**: Implementar WebP/AVIF con fallbacks
3. **PWA**: Service Worker y offline support
4. **Internacionalización**: Soporte multi-idioma (i18n)
5. **Mejoras de accesibilidad**: Tests con axe-core, mejor contraste en modo oscuro
