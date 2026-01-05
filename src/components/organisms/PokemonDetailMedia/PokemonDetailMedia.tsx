import { Button } from "@/atoms/Button";
import styles from "./PokemonDetailMedia.module.css";
import { ChevronLeftIcon } from "@/atoms/ChevronLeftIcon";
import { ChevronRightIcon } from "@/atoms/ChevronRightIcon";
import { LazyImage } from "@/molecules/LazyImage";
import { getPokemonImageUrls } from "@/utils/pokemon";
import { useNavigate } from "react-router-dom";
import { cx } from "@/utils/cx";
import { useCallback, useEffect, useMemo } from "react";

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
};

export type PokemonDetailMediaProps = {
  id: number;
  name: string;
  order: number;
};

export const PokemonDetailMedia = ({
  id,
  name,
}: Readonly<PokemonDetailMediaProps>) => {
  const navigate = useNavigate();
  const { detail } = getPokemonImageUrls(id);

  const canPrevious = useMemo(() => id > 1, [id]);
  const canNext = useMemo(() => id < 10325, [id]);

  const handlePrevious = useCallback(() => {
    navigate(`/pokemon/${id - 1}`);
  }, [id, navigate]);

  const handleNext = useCallback(() => {
    navigate(`/pokemon/${id + 1}`);
  }, [id, navigate]);

  useEffect(() => {
    if (!id) return;

    const onKeyDown = (e: KeyboardEvent) => {
      // si estás escribiendo, no molestamos
      if (isTypingTarget(e.target)) return;

      // si el usuario está usando modificadores, tampoco (evita líos con shortcuts)
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

      if (e.key === "ArrowLeft") {
        if (!canPrevious) return;
        e.preventDefault();
        handlePrevious();
      }

      if (e.key === "ArrowRight") {
        if (!canNext) return;
        e.preventDefault();
        handleNext();
      }
    };

    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, [id, canPrevious, canNext, handlePrevious, handleNext]);

  return (
    <div className={styles.mediaContainer}>
      <Button
        onClick={handlePrevious}
        disabled={id === 1}
        className={cx({ [styles.hidden]: id === 1 })}
      >
        <ChevronLeftIcon width={24} height={24} fill="currentColor" />
      </Button>
      <LazyImage
        alt={name}
        width={200}
        height={200}
        src={detail}
        className={styles.mediaImage}
      />

      <Button
        onClick={handleNext}
        disabled={id === 10325}
        className={cx({ [styles.hidden]: id === 10325 })}
      >
        <ChevronRightIcon width={24} height={24} fill="currentColor" />
      </Button>
    </div>
  );
};
