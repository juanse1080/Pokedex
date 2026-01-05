const SPRITES_BASE = import.meta.env.VITE_SPRITES_BASE;

export function getPokemonImageUrls(id: number | string) {
  // Small (for list): lightweight and fast
  const list = `${SPRITES_BASE}/${id}.png`;

  // Large (for detail): more professional
  const detail = `${SPRITES_BASE}/other/official-artwork/${id}.png`;

  // Large alternative
  const home = `${SPRITES_BASE}/other/home/${id}.png`;

  // SVG (sometimes missing for some pokemon, use as optional fallback)
  const dreamWorld = `${SPRITES_BASE}/other/dream-world/${id}.svg`;

  return { list, detail, home, dreamWorld };
}
