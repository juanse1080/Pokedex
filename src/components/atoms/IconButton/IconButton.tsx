import type { ButtonHTMLAttributes } from "react";
import styles from "./IconButton.module.css";
import { cx } from "@/utils/cx";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export const IconButton = ({
  className,
  children,
  ...props
}: Readonly<IconButtonProps>) => {
  return (
    <button className={cx(styles.reset, styles.button, className)} {...props}>
      {children}
    </button>
  );
};

IconButton.displayName = "IconButton";
