import { SyntheticEvent } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: (event: SyntheticEvent<HTMLButtonElement>) => void;
  type?: string;
}

function Button({ children, onClick, type = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`${styles.btn} ${styles[type]}`}>
      {children}
    </button>
  );
}

export default Button;
