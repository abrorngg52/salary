import React from 'react';
import styles from './BalanceCard.module.css';

function BalanceCard({ title, amount, type = 'balance' }) {
  // Fallback для amount
  const displayAmount = amount ?? 0;
  
  // Форматирование числа с разделителями тысяч
  const formattedAmount = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(displayAmount);

  // Определяем CSS-класс на основе типа
  const cardClass = `${styles.card} ${styles[type] || styles.balance}`;

  return (
    <div className={cardClass}>
      <div className={styles.title}>{title || 'Без названия'}</div>
      <div className={styles.amount}>{formattedAmount}</div>
    </div>
  );
}

export default BalanceCard;