import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/constants';
import TransactionList from '../../components/TransactionList/TransactionList';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import styles from './History.module.css';

function History() {
  const { 
    incomes, 
    expenses, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    isLoading 
  } = useData();
  
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Все транзакции
  const allTransactions = useMemo(() => {
    return [...(incomes || []), ...(expenses || [])];
  }, [incomes, expenses]);

  // Отфильтрованные транзакции
  const filteredTransactions = useMemo(() => {
    let result = allTransactions;

    if (typeFilter !== 'all') {
      result = result.filter((t) => t.type === typeFilter);
    }

    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.category === categoryFilter);
    }

    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [allTransactions, typeFilter, categoryFilter]);

  // Категории для фильтра: объединяем и гарантированно удаляем дубликаты по id
  const allCategories = useMemo(() => {
    const combined = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
    return combined.filter((cat, index, self) =>
      index === self.findIndex((c) => c.id === cat.id)
    );
  }, []);

  const handleOpenModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(false);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSubmit = async (transactionData) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, {
          ...transactionData,
          type: editingTransaction.type,
        });
      } else {
        await addTransaction(transactionData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert(error.message || 'Не удалось сохранить операцию');
    }
  };

  const handleDelete = async (id) => {
    const transaction = allTransactions.find((t) => t.id === id);
    if (transaction) {
      if (window.confirm('Вы уверены, что хотите удалить эту операцию?')) {
        try {
          await deleteTransaction(id, transaction.type);
        } catch (error) {
          console.error('Ошибка при удалении:', error);
          alert('Не удалось удалить операцию');
        }
      }
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка истории...</div>;
  }

  return (
    <div className={styles.history}>
      <div className={styles.header}>
        <h1 className={styles.title}>История операций</h1>
        <button className={styles.addButton} onClick={handleOpenModal}>
          <span className={styles.addIcon}>+</span>
          Добавить операцию
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Тип операции</label>
          <select
            className={styles.filterSelect}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Категория</label>
          <select
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Все категории</option>
            {allCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.listContainer}>
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? 'Редактировать операцию' : 'Добавить операцию'}
      >
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          editData={editingTransaction}
        />
      </Modal>
    </div>
  );
}

export default History;