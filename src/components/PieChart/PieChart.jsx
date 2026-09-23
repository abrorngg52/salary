import React from 'react';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Цвета для секторов диаграммы
const COLORS = [
  '#4f46e5', // primary
  '#10b981', // success
  '#f59e0b', // warning
  '#ef4444', // danger
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
  '#f97316', // orange
  '#14b8a6', // teal
];

function PieChart({ data = [], title }) {
  // Если данных нет — показываем заглушку
  if (!data || data.length === 0) {
    return (
      <div style={{
        backgroundColor: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: '600',
          color: 'var(--color-text)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          {title || 'Круговая диаграмма'}
        </h3>
        <div style={{
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          padding: 'var(--spacing-xl)'
        }}>
          <div>
            <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-md)' }}>🥧</div>
            <p>Добавьте операции, чтобы увидеть распределение по категориям</p>
          </div>
        </div>
      </div>
    );
  }

  // Форматирование значения для тултипа
  const renderTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div style={{
          backgroundColor: 'var(--color-bg-card)',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-border)'
        }}>
          <p style={{ margin: 0, fontWeight: '500', color: 'var(--color-text)' }}>
            {data.name}
          </p>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
            {new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              minimumFractionDigits: 0
            }).format(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      backgroundColor: 'var(--color-bg-card)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-lg)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <h3 style={{
        fontSize: 'var(--font-size-xl)',
        fontWeight: '600',
        color: 'var(--color-text)',
        marginBottom: 'var(--spacing-lg)'
      }}>
        {title || 'Круговая диаграмма'}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={renderTooltip} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => (
              <span style={{ color: 'var(--color-text)', fontSize: 'var(--font-size-sm)' }}>
                {value}
              </span>
            )}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChart;