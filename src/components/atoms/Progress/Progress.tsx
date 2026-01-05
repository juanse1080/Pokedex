import styles from "./Progress.module.css";

export type ProgressProps = {
  value: number;
  color: string;
};

export const Progress = ({ value, color }: Readonly<ProgressProps>) => {
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressBarBackground}
          style={{ backgroundColor: color }}
        />
        <div
          className={styles.progressBarFill}
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};
