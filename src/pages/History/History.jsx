import React, { useState, useEffect, useCallback } from 'react';
import styles from './History.module.css';
import TransactionList from '../../components/TransactionList/TransactionList';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import { getAllTransactions, getTransactionById } from '../../services/summaryService';
import { addIncome, updateIncome, deleteIncome } from '../../services/incomeService';
import { addExpense, updateExpense, deleteExpense } from '../../services/expenseService';
import { 
  INCOME_CATEGORIES, 
  EXPENSE_CATEGORIES, 
  TRANSACTION_TYPES 
} from '../../utils/constants';

function History() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Состояние модалки
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Загрузка данных
  const loadData = useCallback(() => {
    const transactions = getAllTransactions();
    setAllTransactions(transactions);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Получаем доступные категории для текущего фильтра типа
  const getAvailableCategories = () => {
    if (filterType === 'income') return INCOME_CATEGORIES || [];
    if (filterType === 'expense') return EXPENSE_CATEGORIES || [];
    return [...(INCOME_CATEGORIES || []), ...(EXPENSE_CATEGORIES || [])];
  };

  // Фильтрация операций
  const filteredTransactions = (allTransactions || []).filter(transaction => {
    // Фильтр по типу
    if (filterType !== 'all' && transaction?.type !== filterType) return false;
    
    // Фильтр по категории
    if (filterCategory !== 'all' && transaction?.category !== filterCategory) return false;
    
    // Поиск по комментарию и категории
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const comment = (transaction?.comment || '').toLowerCase();
      const category = (transaction?.category || '').toLowerCase();
      const amount = String(transaction?.amount || '');
      
      if (!comment.includes(query) && !category.includes(query) && !amount.includes(query)) {
        return false;
      }
    }
    
    return true;
  });

  // Сброс фильтра категории при смене типа
  useEffect(() => {
    setFilterCategory('all');
  }, [filterType]);

  // Открытие модалки для добавления
  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  // Открытие модалки для редактирования
  const handleEditTransaction = (id) => {
    const transaction = getTransactionById(id);
    if (transaction) {
      setEditingTransaction(transaction);
      setIsModalOpen(true);
    }
  };

  // Закрытие модалки
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  // Сохранение операции (создание или обновление)
  const handleSubmitTransaction = (formData) => {
    try {
      if (editingTransaction?.id) {
        // Режим редактирования
        if (formData.type === 'income') {
          updateIncome(editingTransaction.id, formData);
        } else {
          updateExpense(editingTransaction.id, formData);
        }
      } else {
        // Режим создания
        if (formData.type === 'income') {
          addIncome(formData);
        } else {
          addExpense(formData);
        }
      }

      loadData();
      handleCloseModal();
    } catch (error) {
      console.error('Ошибка сохранения операции:', error);
    }
  };

  // Удаление операции
  const handleDeleteTransaction = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить эту операцию?');
    if (!confirmed) return;

    try {
      // Определяем тип операции и удаляем из нужного хранилища
      const transaction = getTransactionById(id);
      if (!transaction) return;

      if (transaction.type === 'income') {
        deleteIncome(id);
      } else {
        deleteExpense(id);
      }

      loadData();
    } catch (error) {
      console.error('Ошибка удаления операции:', error);
    }
  };

  const availableCategories = getAvailableCategories();

  return (
    <div className={styles.history}>
      <h1 className={styles.title}>История операций</h1>

      {/* Панель фильтров */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Тип</label>
          <select 
            className={styles.filterSelect}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Все</option>
            {(TRANSACTION_TYPES || []).map(type => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Категория</label>
          <select 
            className={styles.filterSelect}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Все категории</option>
            {(availableCategories || []).map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup} style={{ flex: 1 }}>
          <label className={styles.filterLabel}>Поиск</label>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Поиск по комментарию, категории, сумме..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button 
          className={styles.addButton}
          onClick={handleAddTransaction}
        >
          + Добавить
        </button>
      </div>

      {/* Список операций */}
      <div className={styles.listContainer}>
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </div>

      {/* Модалка с формой */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? 'Редактировать операцию' : 'Добавить операцию'}
      >
        <TransactionForm
          onSubmit={handleSubmitTransaction}
          onCancel={handleCloseModal}
          editData={editingTransaction}
        />
      </Modal>
    </div>
  );
}

export default History;