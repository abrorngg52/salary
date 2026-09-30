import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function CustomBarChart({ data }) {
  // Если данных нет или массив пуст, показываем заглушку
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#888' }}>
        Нет данных для отображения
      </div>
    );
  }

  // Преобразуем данные: создаем понятную подпись месяца и переименовываем ключи для легенды
  const chartData = data.map((item) => ({
    name: `${item.month}.${item.year}`,
    Доходы: item.income,
    Расходы: item.expense,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `${value.toLocaleString()} ₽`} />
        <Legend />
        <Bar dataKey="Доходы" fill="#00C49F" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Расходы" fill="#FF8042" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CustomBarChart;