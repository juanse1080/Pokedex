# Architecture Decision Records (ADR)

Documentación de decisiones técnicas clave del proyecto Pokédex React GraphQL.

---

## ADR-001: Apollo Client + MockedProvider para Testing

### Contexto

Necesitábamos una estrategia para testear componentes que consumen GraphQL sin depender de un servidor real. Las opciones principales eran:

- MockedProvider (Apollo Client Testing)
- MSW (Mock Service Worker)
- Mock del cliente Apollo directamente

### Decisión

Utilizar **MockedProvider** de `@apollo/client/testing/react` para todos los tests que involucren GraphQL.

### Consecuencias

**Pros:**

- Integración nativa con Apollo Client
- No requiere configuración adicional de servidor mock
- Sincronización automática con queries reales
- Fácil de mantener (mocks en `src/test/mocks.ts`)
- Permite testear estados de loading, error y success de forma determinista

**Contras:**

- Acoplamiento con Apollo Client (si cambiamos de cliente GraphQL, hay que reescribir mocks)
- No simula latencia de red real (aunque se puede agregar con `delay`)

**Alternativas consideradas:**

- MSW: Más flexible pero requiere más configuración y no está tan integrado con Apollo
- Mock directo: Menos mantenible y más propenso a errores

---

## ADR-002: Separación de Hooks, Data y UI (Atomic Design)

### Contexto

El proyecto necesita escalabilidad y mantenibilidad. La estructura debe permitir:

- Reutilización de componentes
- Testeo aislado
- Fácil onboarding de nuevos desarrolladores

### Decisión

Implementar **Atomic Design** con separación clara de responsabilidades:

- **Hooks** (`src/hooks/`): Lógica de negocio y estado
- **GraphQL** (`src/graphql/queries/`): Queries y tipos
- **UI** (`src/components/`): Componentes organizados por nivel (atoms → molecules → organisms → templates → pages)

### Consecuencias

**Pros:**

- Estructura predecible y fácil de navegar
- Componentes reutilizables desde el nivel más bajo
- Separación clara entre lógica y presentación
- Facilita testing (hooks y componentes por separado)
- Escalable: fácil agregar nuevos componentes siguiendo el patrón

**Contras:**

- Puede ser verboso para proyectos pequeños
- Requiere disciplina para mantener la separación
- Algunos componentes pueden no encajar perfectamente en una categoría

**Ejemplo de flujo:**

```
Data (GraphQL) → Hook (useInfinitePokemonList) → Component (PokemonListPage)
```

---

## ADR-003: CSS Modules + Variables CSS Centralizadas

### Contexto

Necesitábamos un sistema de estilos que:

- Evite conflictos de nombres
- Sea type-safe con TypeScript
- Permita reutilización de tokens de diseño
- No tenga overhead de runtime

### Decisión

Utilizar **CSS Modules** para estilos de componentes y **variables CSS** globales para tokens de diseño (colores, espaciado, tipografía, sombras).

### Consecuencias

**Pros:**

- Encapsulación automática (sin colisiones de nombres)
- Sin overhead de runtime (compilación en build time)
- TypeScript puede inferir tipos de clases CSS
- Variables CSS permiten temas consistentes
- Fácil de mantener (tokens centralizados en `src/styles/variables.css`)

**Contras:**

- No permite estilos dinámicos complejos (aunque se puede combinar con inline styles)
- Requiere importar estilos en cada componente

**Alternativas consideradas:**

- Styled Components: Más flexible pero con overhead de runtime
- Tailwind CSS: Más rápido de desarrollar pero menos control sobre estructura
- CSS-in-JS: Similar a Styled Components, mismo tradeoff

---

## ADR-004: Sistema de Favoritos con localStorage + Context API

### Contexto

Necesitábamos persistir favoritos del usuario sin backend. Opciones:

- Solo localStorage (sin estado global)
- Context API + localStorage (estado global + persistencia)
- Zustand/Redux + localStorage (librería de estado externa)

### Decisión

Implementar **Context API** para estado global + **localStorage** para persistencia. Shape de datos: `Array<{ id: number; name: string }>`.

### Consecuencias

**Pros:**

- Sin dependencias externas (Context API nativo de React)
- Persistencia automática en localStorage
- Deduplicación simple (verificar por `id` antes de agregar)
- Fácil de testear (mock de localStorage)
- API simple: `toggleFavorite()`, `isFavorite()`, `favorites`

**Contras:**

- localStorage limitado a ~5-10MB (suficiente para favoritos)
- No sincroniza entre pestañas automáticamente (se puede agregar `storage` event listener)
- No funciona en modo incógnito si está deshabilitado

**Estrategia de deduplicación:**

```typescript
const isAlreadyFavorite = prev.some((fav) => fav.id === pokemon.id);
const newFavorites = isAlreadyFavorite
  ? prev.filter((fav) => fav.id !== pokemon.id) // Remover
  : [...prev, pokemon]; // Agregar
```

---

## ADR-005: Filtrado Híbrido (Cliente + Servidor)

### Contexto

Tenemos dos fuentes de datos:

1. GraphQL: Permite filtrado en servidor
2. REST API: Solo devuelve lista completa

Necesitábamos una estrategia consistente para ambas.

### Decisión

**Filtrado híbrido:**

- **GraphQL**: Filtrado en servidor (búsqueda y tipo via `where` clause)
- **REST**: Filtrado en cliente con `useFilteredPokemon` hook

### Consecuencias

**Pros:**

- GraphQL aprovecha índices del servidor (más eficiente)
- REST funciona sin modificar API externa
- Misma UX en ambas rutas (`/` y `/rest`)
- Filtrado en cliente es instantáneo (sin latencia de red)

**Contras:**

- REST puede ser lento con muchos datos (aunque se usa scroll infinito)
- Lógica de filtrado duplicada (servidor vs cliente)
- REST requiere cargar todos los datos antes de filtrar (mitigado con paginación)

**Implementación:**

- GraphQL: `where: { name: { _ilike: '%query%' }, pokemontypes: { type: { name: { _eq: type } } } }`
- Cliente: `items.filter(p => p.name.includes(queryLower))`

---

## ADR-006: Validación de Input Antes de Disparar Acciones

### Contexto

La búsqueda debe validar antes de ejecutarse para:

- Evitar requests innecesarios
- Mejorar UX con feedback inmediato
- Prevenir errores en el servidor

### Decisión

Validar en el **cliente antes de enviar** al servidor:

- Mínimo 3 caracteres
- Solo letras, números, espacios y guiones
- Botón deshabilitado si input inválido
- Validación en tiempo real

### Consecuencias

**Pros:**

- Reduce requests innecesarios al servidor
- Feedback inmediato al usuario
- Mejor accesibilidad (botón disabled + aria-invalid)
- Validación centralizada en `useFilteredPokemon` hook

**Contras:**

- Validación duplicada si el servidor también valida (pero es defensiva)
- Regex puede ser confusa para usuarios (mitigado con mensajes claros)

**Reglas exactas:**

```typescript
const hasSpecial = /[^a-z0-9\s-]/i.test(value);
const isValid = value.length === 0 || (value.length >= 3 && !hasSpecial);
```

---

## ADR-007: Navegación Next/Prev con Teclado

### Contexto

En la vista de detalle, queríamos permitir navegación rápida entre Pokémon sin usar el mouse.

### Decisión

Implementar **navegación por teclado** con ArrowLeft/ArrowRight:

- ArrowLeft: Pokémon anterior
- ArrowRight: Pokémon siguiente
- Solo activo cuando no se está escribiendo (evita conflictos con inputs)
- Ignora si hay modificadores (Alt, Ctrl, Cmd, Shift)

### Consecuencias

**Pros:**

- Mejor UX para power users
- Accesible (navegación sin mouse)
- No interfiere con shortcuts del navegador
- Lógica centralizada en `PokemonDetailMedia` component

**Contras:**

- Puede confundir a usuarios que no conocen la feature (se puede agregar tooltip)
- Requiere manejo cuidadoso de eventos globales

**Implementación:**

```typescript
const onKeyDown = (e: KeyboardEvent) => {
  if (isTypingTarget(e.target)) return; // No interferir con inputs
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return; // Ignorar shortcuts

  if (e.key === "ArrowLeft" && canPrevious) handlePrevious();
  if (e.key === "ArrowRight" && canNext) handleNext();
};
```

---

## ADR-008: Scroll Infinito con IntersectionObserver

### Contexto

Necesitábamos paginación eficiente sin botones "Cargar más". Opciones:

- Botón "Cargar más"
- Scroll infinito con scroll event listener
- Scroll infinito con IntersectionObserver

### Decisión

Implementar **scroll infinito con IntersectionObserver** y un elemento sentinel (div invisible al final de la lista).

### Consecuencias

**Pros:**

- Mejor performance que scroll event listener (no se ejecuta en cada scroll)
- UX fluida (carga automática)
- Configurable con `rootMargin` para precarga (200px por defecto)
- API nativa del navegador (sin dependencias)

**Contras:**

- Requiere un elemento sentinel en el DOM
- No funciona en navegadores muy antiguos (pero tenemos polyfill si es necesario)

**Configuración:**

```typescript
useInfiniteScroll(hasMore, loadMore, {
  rootMargin: "200px", // Precarga cuando está a 200px del final
});
```

---

## ADR-009: Debounce en Búsqueda (500ms)

### Contexto

La búsqueda se ejecuta en cada cambio de input. Con GraphQL, esto puede generar muchos requests innecesarios.

### Decisión

Implementar **debounce de 500ms** en la búsqueda usando hook `useDebouncedValue`.

### Consecuencias

**Pros:**

- Reduce requests al servidor significativamente
- Mejor performance (menos carga en servidor y cliente)
- UX fluida (no se nota el delay en la mayoría de casos)

**Contras:**

- Delay de 500ms puede sentirse lento en conexiones rápidas (pero aceptable)
- Usuarios que escriben rápido pueden notar el delay

**Alternativas consideradas:**

- 300ms: Más rápido pero más requests
- 1000ms: Menos requests pero UX más lenta
- 500ms: Balance óptimo

---

## ADR-010: Path Aliases con @/

### Contexto

Los imports relativos (`../../../`) son difíciles de mantener y leer. Necesitábamos una solución más limpia.

### Decisión

Configurar **path aliases** en `vite.config.ts` usando el prefijo `@/` para todas las carpetas principales.

### Consecuencias

**Pros:**

- Imports más legibles: `@/hooks/usePokemonDetail` vs `../../../hooks/usePokemonDetail`
- Fácil de refactorizar (no se rompe al mover archivos)
- Consistente en todo el proyecto
- TypeScript lo entiende automáticamente

**Contras:**

- Requiere configuración en `vite.config.ts` y `tsconfig.json`
- Puede confundir a desarrolladores nuevos (pero es estándar en proyectos modernos)

**Ejemplo:**

```typescript
// Antes
import { usePokemonDetail } from "../../../hooks/usePokemonDetail";

// Después
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
```
