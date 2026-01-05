import styles from './Spinner.module.css';

export const Spinner: React.FC = () => {
  return (
    <div className={styles.container} role="status" aria-label="Cargando">
      <div className={styles.circle} />
    </div>
  );
};

