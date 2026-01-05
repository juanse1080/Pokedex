import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  rootMargin?: string;
  threshold?: number | number[];
}

export function useInfiniteScroll(
  hasMore: boolean,
  loadMore: () => void,
  options?: UseInfiniteScrollOptions
) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore) {
          loadMore();
        }
      },
      {
        rootMargin: options?.rootMargin ?? "200px",
        threshold: options?.threshold,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [loadMore, hasMore, options?.rootMargin, options?.threshold]);

  return sentinelRef;
}

