import React from 'react';
import EmptyState from '../EmptyState/EmptyState';
import styles from './TransactionList.module.css';

// Временная функция форматирования даты до создания formatters.js в фазе E
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Временная функция форматирования суммы до создания formatters.js в фазе E
const formatAmount = (amount, type) => {
  const value = amount ?? 0;
  const sign = type === 'income' ? '+' : '-';
  return `${sign}${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
};

// Временные метки категорий до создания constants.js в фазе E
const CATEGORY_LABELS = {
  // Доходы
  salary: 'Зарплата',
  freelance: 'Подработка',
  bonus: 'Премия',
  debt_return: 'Возврат долга',
  deposit_interest: 'Проценты по вкладу',
  gift: 'Подарок',
  // Расходы
  groceries: 'Продукты',
  utilities: 'Коммуналка',
  rent: 'Аренда',
  subscriptions: 'Подписки',
  transport: 'Транспорт',
  health: 'Здоровье',
  clothing: 'Одежда',
  entertainment: 'Развлечения',
  communication: 'Связь',
  other: 'Прочее'
};

function TransactionList({ transactions = [], onEdit, onDelete }) {
  // Если список пуст — показываем заглушку
  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="Нет операций"
        description="Добавьте первую операцию, чтобы увидеть её здесь"
      />
    );
  }

  return (
    <div className={styles.list}>
      {(transactions || []).map((transaction) => {
        const isIncome = transaction?.type === 'income';
        const iconClass = isIncome ? styles.iconIncome : styles.iconExpense;
        const amountClass = isIncome ? styles.amountIncome : styles.amountExpense;
        const icon = isIncome ? '💵' : '💸';
        const categoryLabel = CATEGORY_LABELS[transaction?.category] || transaction?.category || 'Без категории';

        return (
          <div key={transaction?.id} className={styles.row}>
            {/* Иконка типа */}
            <div className={`${styles.icon} ${iconClass}`}>
              {icon}
            </div>

            {/* Основная информация */}
            <div className={styles.info}>
              <div className={styles.category}>{categoryLabel}</div>
              {transaction?.comment && (
                <div className={styles.comment}>{transaction.comment}</div>
              )}
            </div>

            {/* Дата */}
            <div className={styles.date}>
              {formatDate(transaction?.date)}
            </div>

            {/* Сумма */}
            <div className={`${styles.amount} ${amountClass}`}>
              {formatAmount(transaction?.amount, transaction?.type)}
            </div>

            {/* Кнопки действий */}
            <div className={styles.actions}>
              {onEdit && (
                <button
                  className={`${styles.actionButton} ${styles.editButton}`}
                  onClick={() => onEdit(transaction?.id)}
                  title="Редактировать"
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => onDelete(transaction?.id)}
                  title="Удалить"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TransactionList;