import { RadioButtonCheckedIcon } from "@/atoms/RadioButtonCheckedIcon";
import { RadioButtonUncheckedIcon } from "@/atoms/RadioButtonUncheckedIcon";
import styles from "./Radio.module.css";
import { forwardRef, useId } from "react";
import { cx } from "@/utils/cx";
import { Typography } from "../Typography";

type RadioProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "children"
> & {
  label: React.ReactNode;
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      id,
      name,
      value,
      checked,
      defaultChecked,
      disabled,
      onChange,
      label,
      checkedIcon,
      uncheckedIcon,
      className,
      ...rest
    },
    ref
  ) => {
    const reactId = useId();
    const inputId = id ?? `radio-${reactId}`;

    // Si no te pasan íconos, usamos defaults:
    const iconChecked = checkedIcon ?? <RadioButtonCheckedIcon />;
    const iconUnchecked = uncheckedIcon ?? <RadioButtonUncheckedIcon />;

    // Nota: si usas `checked`, esto es controlado; si no, usa `defaultChecked`.
    const isChecked = Boolean(checked);

    return (
      <label
        className={cx([
          styles.root,
          {
            [styles.disabled]: disabled,
          },
          className,
        ])}
        data-checked={isChecked ? "true" : "false"}
        htmlFor={inputId}
      >
        <input
          ref={ref}
          id={inputId}
          className={styles.input}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={onChange}
          {...rest}
        />

        <span className={styles.visual} aria-hidden="true">
          {isChecked ? iconChecked : iconUnchecked}
        </span>

        <Typography variant="body-third" as="span">
          {label}
        </Typography>
      </label>
    );
  }
);

Radio.displayName = "Radio";
