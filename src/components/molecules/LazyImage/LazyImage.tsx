import { useState } from "react";
import styles from "./LazyImage.module.css";
import { cx } from "@/utils/cx";

type LazyImageProps = {
  src: string;
  alt: string;
  /**
   * Reserva espacio para evitar CLS.
   * Ej: 1/1, 4/3, 16/9
   */
  width?: number;
  height?: number;
  className?: string;
  imgClassName?: string;
};

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  imgClassName,
}: Readonly<LazyImageProps>) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cx(
        styles.root,
        {
          [styles.isLoaded]: loaded,
          [styles.isFailed]: failed,
        },
        className
      )}
      style={{
        width,
        height,
      }}
    >
      <div className={styles.skeleton} aria-hidden="true" />

      {failed ? (
        <div className={styles.fallback} aria-label={alt}>
          No image
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          width={width}
          height={height}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cx(styles.img, imgClassName)}
        />
      )}
    </div>
  );
}
