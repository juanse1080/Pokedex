import React, {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import styles from "./Popover.module.css";
import { cx } from "@/utils/cx";

type PopoverProps = {
  title?: string;
  children: ReactNode;
  align?: "left" | "right";
  closeOnSelect?: boolean; // útil si el contenido es menú/acciones
  panelClassName?: string;
  trigger: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>;
};

function getFocusable(container: HTMLElement) {
  const selectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");

  return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter(
    (el) =>
      !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true"
  );
}

function isButtonElement(el: React.ReactElement) {
  return typeof el.type === "string" && el.type.toLowerCase() === "button";
}

export function Popover({
  trigger,
  title,
  children,
  align = "left",
  panelClassName,
  closeOnSelect = false,
}: Readonly<PopoverProps>) {
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerWrapRef = useRef<HTMLSpanElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const reactId = useId();
  const panelId = useMemo(() => `popover-${reactId}`, [reactId]);
  const titleId = useMemo(() => `popover-title-${reactId}`, [reactId]);

  const close = () => setOpen(false);
  const toggle = () => setOpen((v) => !v);

  const focusTrigger = () => {
    const wrap = triggerWrapRef.current;
    if (!wrap) return;
    const focusables = getFocusable(wrap);
    (focusables[0] ?? wrap).focus?.();
  };

  // Guardar foco previo al abrir y mover foco al panel
  useEffect(() => {
    if (!open) {
      // restore focus
      if (lastFocusedRef.current) lastFocusedRef.current.focus?.();
      else focusTrigger();
      return;
    }

    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    if (!panel) return;

    const focusables = getFocusable(panel);
    (focusables[0] ?? panel).focus();
  }, [open]);

  // Escape + click afuera
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const root = rootRef.current;
      const target = e.target as Node;
      if (root && !root.contains(target)) close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [open]);

  // Si quieres cerrar cuando el usuario hace click en algo del contenido (menú/acciones)
  const onPanelClickCapture = (e: React.MouseEvent) => {
    if (!closeOnSelect) return;

    const target = e.target as HTMLElement;
    const clickable = target.closest(
      'a[href],button:not([disabled]),[role="menuitem"],[data-popover-close="true"]'
    );
    if (clickable) close();
  };

  const triggerIsButton = isButtonElement(trigger);

  // Merge de handlers del trigger (sin pisar)
  const userOnClick = trigger.props.onClick as
    | ((e: React.MouseEvent) => void)
    | undefined;

  const userOnKeyDown = trigger.props.onKeyDown as
    | ((e: React.KeyboardEvent) => void)
    | undefined;

  const mergedOnClick = (e: React.MouseEvent) => {
    userOnClick?.(e);
    if (e.defaultPrevented) return;
    toggle();
  };

  const mergedOnKeyDown = (e: React.KeyboardEvent) => {
    userOnKeyDown?.(e);
    if (e.defaultPrevented) return;

    // Si NO es button, soportar Enter/Espacio
    if (!triggerIsButton && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      toggle();
    }
  };

  // Inyección accesible mínima (popover = dialog no-modal)
  const injectedProps: Record<string, unknown> = {
    id: trigger.props.id ?? `${reactId}-trigger`,
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    "aria-controls": panelId,
    onClick: mergedOnClick,
    onKeyDown: mergedOnKeyDown,
    className: cx(trigger.props.className, styles.trigger, {
      [styles.triggerOpen]: open,
    }),
  };

  // Si el trigger NO es button, asegurar focus/teclado (sin romper si ya lo trae)
  if (triggerIsButton) {
    injectedProps.type = trigger.props.type ?? "button";
  } else {
    // Evitar submits accidentales si el trigger es un button dentro de un form
    injectedProps.role = trigger.props.role ?? "button";
    injectedProps.tabIndex = trigger.props.tabIndex ?? 0;
  }

  return (
    <div
      ref={rootRef}
      className={cx(styles.root, {
        [styles.right]: align === "right",
        [styles.open]: open,
      })}
    >
      <span ref={triggerWrapRef} className={styles.triggerWrap}>
        {React.cloneElement(trigger, injectedProps)}
      </span>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          tabIndex={-1}
          aria-modal="false"
          onClickCapture={onPanelClickCapture}
          className={cx(styles.panel, panelClassName)}
          aria-labelledby={title ? titleId : undefined}
        >
          {title ? (
            <div id={titleId} className={styles.title}>
              {title}
            </div>
          ) : null}

          {children}
        </div>
      )}
    </div>
  );
}
