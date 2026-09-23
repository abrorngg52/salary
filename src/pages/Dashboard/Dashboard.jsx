import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import BalanceCard from '../../components/BalanceCard/BalanceCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import TransactionList from '../../components/TransactionList/TransactionList';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import { getBalance, getRecentTransactions } from '../../services/summaryService';
import { addIncome } from '../../services/incomeService';
import { addExpense } from '../../services/expenseService';

function Dashboard() {
  const [balance, setBalance] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Загрузка данных при монтировании
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const balanceData = getBalance();
    setBalance(balanceData);

    const recent = getRecentTransactions(5);
    setRecentTransactions(recent);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitTransaction = (formData) => {
    try {
      if (formData.type === 'income') {
        addIncome(formData);
      } else {
        addExpense(formData);
      }

      // Перезагружаем данные
      loadData();
      handleCloseModal();
    } catch (error) {
      console.error('Ошибка сохранения операции:', error);
    }
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Главная</h1>
      
      {/* Карточки баланса */}
      <div className={styles.balanceGrid}>
        <BalanceCard 
          title="Доходы" 
          amount={balance.totalIncome} 
          type="income"
        />
        <BalanceCard 
          title="Расходы" 
          amount={balance.totalExpense} 
          type="expense"
        />
        <BalanceCard 
          title="Баланс" 
          amount={balance.balance} 
          type="balance"
        />
      </div>

      {/* Последние операции */}
      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Последние операции</h2>
        </div>
        
        <TransactionList
          transactions={recentTransactions}
        />
      </div>

      {/* Плавающая кнопка добавления */}
      <button 
        className={styles.addButton}
        onClick={handleOpenModal}
        title="Добавить операцию"
      >
        +
      </button>

      {/* Модалка с формой добавления */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Добавить операцию"
      >
        <TransactionForm
          onSubmit={handleSubmitTransaction}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;