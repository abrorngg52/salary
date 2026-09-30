import React, { useState, useEffect, useMemo } from 'react';
// Исправлены пути: добавлено ../../ вместо ../
import { getBalance, getByCategory, getMonthlySummary } from '../../services/summaryService';
import { formatAmount } from '../../utils/formatters';
import PieChart from '../../components/PieChart/PieChart';
import BarChart from '../../components/BarChart/BarChart';
import styles from './Analytics.module.css';

function Analytics() {
  const [period, setPeriod] = useState('month');
  const [summaryData, setSummaryData] = useState({
    balance: { totalIncome: 0, totalExpense: 0, balance: 0 },
    categoryData: [],
    monthlyData: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const periods = [
    { id: 'week', label: 'Неделя' },
    { id: 'month', label: 'Месяц' },
    { id: 'quarter', label: 'Квартал' },
    { id: 'year', label: 'Год' },
  ];

  const monthsCount = useMemo(() => {
    switch (period) {
      case 'week': return 1;
      case 'month': return 1;
      case 'quarter': return 3;
      case 'year': return 12;
      default: return 6;
    }
  }, [period]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [balanceRes, categoryRes, monthlyRes] = await Promise.all([
          getBalance(),
          getByCategory('expense'),
          getMonthlySummary(monthsCount)
        ]);

        // Безопасное извлечение данных из ответа API
        const safeCategoryData = Array.isArray(categoryRes) 
          ? categoryRes 
          : (categoryRes?.data || []);

        const safeMonthlyData = Array.isArray(monthlyRes)
          ? monthlyRes
          : (monthlyRes?.data || []);
          
        const safeBalance = balanceRes?.data || balanceRes || { totalIncome: 0, totalExpense: 0, balance: 0 };

        setSummaryData({
          balance: safeBalance,
          categoryData: safeCategoryData,
          monthlyData: safeMonthlyData
        });
      } catch (error) {
        console.error('Ошибка при загрузке аналитики:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [monthsCount]);

  if (isLoading) {
    return <div className={styles.loading}>Загрузка аналитики...</div>;
  }

  return (
    <div className={styles.analytics}>
      <div className={styles.header}>
        <h1 className={styles.title}>Аналитика</h1>
      </div>

      <div className={styles.periodSelector}>
        {periods.map((p) => (
          <button
            key={p.id}
            className={`${styles.periodButton} ${period === p.id ? styles.periodButtonActive : ''}`}
            onClick={() => setPeriod(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Расходы по категориям</h2>
          <div className={styles.chartContainer}>
            <PieChart data={summaryData.categoryData} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Доходы и расходы по месяцам</h2>
          <div className={styles.chartContainer}>
            <BarChart data={summaryData.monthlyData} />
          </div>
        </div>
      </div>

      <div className={styles.summarySection}>
        <h2 className={styles.summaryTitle}>Сводка за период</h2>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Общие доходы</span>
            <span className={`${styles.summaryValue} ${styles.summaryValueIncome}`}>
              {formatAmount(summaryData.balance.totalIncome)}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Общие расходы</span>
            <span className={`${styles.summaryValue} ${styles.summaryValueExpense}`}>
              {formatAmount(summaryData.balance.totalExpense)}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Баланс</span>
            <span className={`${styles.summaryValue} ${styles.summaryValueBalance}`}>
              {formatAmount(summaryData.balance.balance)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;