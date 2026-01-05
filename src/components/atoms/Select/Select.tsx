import type { ReactNode } from "react";
import styles from "./Select.module.css";
import { cx } from "@/utils/cx";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  value: string;
  className?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  options: SelectOption[];
  "aria-label"?: string;
  "aria-describedby"?: string;
  endAdornment?: ReactNode;
  startAdornment?: ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  className,
  options,
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
      <select
        value={value}
        disabled={disabled}
        className={cx(styles.select, "typography-body-first", {
          [styles.selectError]: error,
        })}
        aria-label={ariaLabel}
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {endAdornment && <div className={styles.adornment}>{endAdornment}</div>}
    </div>
  );
};
