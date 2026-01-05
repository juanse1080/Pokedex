import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";
import { cx } from "@/utils/cx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button className={cx(styles.button, styles.reset, className)} {...props}>
      {children}
    </button>
  );
};
