import type { ReactNode } from "react";
import styles from "./Input.module.css";
import { cx } from "@/utils/cx";

interface InputProps {
  value: string;
  className?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  error?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
  endAdornment?: ReactNode;
  startAdornment?: ReactNode;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  error,
  className,
  startAdornment,
  endAdornment,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}) => {
  return (
    <div className={cx(styles.wrapper, className)}>
      {startAdornment && (
        <div className={styles.adornment}>{startAdornment}</div>
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        className={cx(styles.input, "typography-body-first", {
          [styles.inputError]: error,
        })}
        aria-label={ariaLabel}
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy}
        onChange={(e) => onChange(e.target.value)}
      />
      {endAdornment && <div className={styles.adornment}>{endAdornment}</div>}
    </div>
  );
};
