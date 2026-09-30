import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Цвета для сегментов диаграммы
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

function CustomPieChart({ data }) {
  // Если данных нет или массив пуст, показываем заглушку
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#888' }}>
        Нет данных для отображения
      </div>
    );
  }

  // Преобразуем данные в формат, который понимает Recharts (name и value)
  const chartData = data.map((item) => ({
    name: item.categoryLabel,
    value: item.total,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value.toLocaleString()} ₽`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default CustomPieChart;