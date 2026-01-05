import { Button } from "@/atoms/Button";
import { cx } from "@/utils/cx";
import { StarIcon } from "@/atoms/StarIcon";
import styles from "./FavoriteToggle.module.css";

interface FavoriteToggleProps {
  className?: string;
  isFavorite: boolean;
  onToggle: () => void;
  onClick?: (e: React.MouseEvent) => void;
}

export const FavoriteToggle: React.FC<FavoriteToggleProps> = ({
  onToggle,
  onClick,
  className,
  isFavorite,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    } else {
      onToggle();
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={cx({ [styles.isActive]: isFavorite }, className)}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <StarIcon
        width={24}
        height={24}
        fill={isFavorite ? "currentColor" : "none"}
      />
    </Button>
  );
};
