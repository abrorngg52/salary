import React from 'react';
import styles from './EmptyState.module.css';

function EmptyState({ 
  icon = '📊',
  title = 'Нет данных', 
  description, 
  actionLabel, 
  onAction 
}) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      {description && (
        <p className={styles.description}>{description}</p>
      )}
      {actionLabel && onAction && (
        <button 
          className={styles.actionButton}
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;