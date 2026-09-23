import React, { useState, useEffect } from 'react';
import styles from './TransactionForm.module.css';

// Fallback-категории до подключения constants.js в фазе E
const FALLBACK_INCOME_CATEGORIES = [
  { id: 'salary', label: 'Зарплата' },
  { id: 'freelance', label: 'Подработка' },
  { id: 'bonus', label: 'Премия' },
  { id: 'debt_return', label: 'Возврат долга' },
  { id: 'deposit_interest', label: 'Проценты по вкладу' },
  { id: 'gift', label: 'Подарок' },
  { id: 'other', label: 'Прочее' },
];

const FALLBACK_EXPENSE_CATEGORIES = [
  { id: 'groceries', label: 'Продукты' },
  { id: 'utilities', label: 'Коммуналка' },
  { id: 'rent', label: 'Аренда' },
  { id: 'subscriptions', label: 'Подписки' },
  { id: 'transport', label: 'Транспорт' },
  { id: 'health', label: 'Здоровье' },
  { id: 'clothing', label: 'Одежда' },
  { id: 'entertainment', label: 'Развлечения' },
  { id: 'communication', label: 'Связь' },
  { id: 'other', label: 'Прочее' },
];

// Пробуем импортировать реальные константы, иначе используем fallback
let INCOME_CATEGORIES = FALLBACK_INCOME_CATEGORIES;
let EXPENSE_CATEGORIES = FALLBACK_EXPENSE_CATEGORIES;

try {
  // Динамический импорт не нужен — просто используем fallback,
  // а в фазе F заменим на реальный импорт
} catch (e) {
  // Используем fallback
}

function TransactionForm({ onSubmit, onCancel, editData }) {
  const [type, setType] = useState(editData?.type || 'expense');
  const [category, setCategory] = useState(editData?.category || '');
  const [amount, setAmount] = useState(editData?.amount?.toString() || '');
  const [date, setDate] = useState(editData?.date || new Date().toISOString().split('T')[0]);
  const [comment, setComment] = useState(editData?.comment || '');

  // Сбрасываем категорию при смене типа, если текущая категория не принадлежит новому типу
  useEffect(() => {
    const currentCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const categoryExists = (currentCategories || []).some(c => c.id === category);
    if (!categoryExists) {
      setCategory(currentCategories?.[0]?.id || '');
    }
  }, [type]);

  // Получаем список категорий для текущего типа
  const currentCategories = type === 'income' 
    ? (INCOME_CATEGORIES || FALLBACK_INCOME_CATEGORIES) 
    : (EXPENSE_CATEGORIES || FALLBACK_EXPENSE_CATEGORIES);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      type,
      category,
      amount: parseFloat(amount) || 0,
      date,
      comment: comment.trim(),
    };

    // Если редактируем — добавляем id
    if (editData?.id) {
      formData.id = editData.id;
    }

    onSubmit?.(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Переключатель типа операции */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Тип операции</label>
        <div className={styles.typeSwitcher}>
          <button
            type="button"
            className={`${styles.typeButton} ${type === 'income' ? styles.typeButtonActiveIncome : ''}`}
            onClick={() => setType('income')}
          >
            💵 Доход
          </button>
          <button
            type="button"
            className={`${styles.typeButton} ${type === 'expense' ? styles.typeButtonActiveExpense : ''}`}
            onClick={() => setType('expense')}
          >
            💸 Расход
          </button>
        </div>
      </div>

      {/* Категория и сумма */}
      <div className={styles.grid}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Категория<span className={styles.required}>*</span>
          </label>
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {(currentCategories || []).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Сумма (₽)<span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            className={styles.input}
            placeholder="0"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Дата */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Дата<span className={styles.required}>*</span>
        </label>
        <input
          type="date"
          className={styles.input}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {/* Комментарий */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Комментарий</label>
        <textarea
          className={styles.textarea}
          placeholder="Необязательное описание операции..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {/* Кнопки */}
      <div className={styles.footer}>
        {onCancel && (
          <button
            type="button"
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={onCancel}
          >
            Отмена
          </button>
        )}
        <button
          type="submit"
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          {editData?.id ? 'Сохранить изменения' : 'Добавить'}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;