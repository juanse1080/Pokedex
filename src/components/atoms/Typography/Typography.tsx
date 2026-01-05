import { cx } from "@/utils/cx";
import styles from "./Typography.module.css";
import { useMemo } from "react";

type TypographyVariant =
  | "headline"
  | "subtitle-first"
  | "subtitle-second"
  | "subtitle-third"
  | "body-first"
  | "body-second"
  | "body-third"
  | "caption";

type TypographyColor = "primary" | "secondary" | "muted";

interface TypographyProps {
  variant: TypographyVariant;
  color?: TypographyColor;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  children: React.ReactNode;
  className?: string;
  elipsis?: boolean;
  clamp?: boolean;
  center?: boolean;
  style?: React.CSSProperties;
}

export const Typography: React.FC<TypographyProps> = ({
  variant,
  clamp,
  center,
  style,
  elipsis,
  children,
  className,
  color = "primary",
  as: Component = "p",
}) => {
  const colorClass = useMemo(() => {
    if (!color || color === "primary") return;
    return styles[`color-${color}`];
  }, [color]);

  return (
    <Component
      className={cx(
        `typography-${variant}`,
        colorClass,
        {
          [styles.ellipsis]: elipsis,
          [styles.clamp]: clamp,
          [styles.center]: center,
        },
        className
      )}
      style={style}
    >
      {children}
    </Component>
  );
};

Typography.displayName = "Typography";
