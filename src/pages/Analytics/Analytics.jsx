import React, { useState, useEffect } from 'react';
import styles from './Analytics.module.css';
import PieChart from '../../components/PieChart/PieChart';
import BarChart from '../../components/BarChart/BarChart';
import { getByCategory, getMonthlySummary } from '../../services/summaryService';

function Analytics() {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  // Загрузка данных при монтировании
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Данные для круговой диаграммы (распределение расходов по категориям)
    const categoryDataFromService = getByCategory();
    setCategoryData(categoryDataFromService || []);

    // Данные для столбчатого графика (доходы и расходы по месяцам)
    const monthlyDataFromService = getMonthlySummary(6);
    setMonthlyData(monthlyDataFromService || []);
  };

  return (
    <div className={styles.analytics}>
      <h1 className={styles.title}>Аналитика</h1>

      <div className={styles.chartsGrid}>
        {/* Круговая диаграмма распределения по категориям */}
        <PieChart
          data={categoryData}
          title="Расходы по категориям"
        />

        {/* Столбчатый график по месяцам */}
        <BarChart
          data={monthlyData}
          title="Доходы и расходы по месяцам"
        />
      </div>
    </div>
  );
}

export default Analytics;