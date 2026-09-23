import React from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

function BarChart({ data = [], title }) {
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
          {title || 'Столбчатый график'}
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
            <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-md)' }}>📊</div>
            <p>Добавьте операции, чтобы увидеть динамику доходов и расходов по месяцам</p>
          </div>
        </div>
      </div>
    );
  }

  // Форматирование значения для оси Y
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value;
  };

  // Форматирование значения для тултипа
  const renderTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'var(--color-bg-card)',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-border)'
        }}>
          <p style={{ 
            margin: '0 0 var(--spacing-xs) 0', 
            fontWeight: '600', 
            color: 'var(--color-text)' 
          }}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ 
              margin: 'var(--spacing-xs) 0', 
              color: entry.color,
              fontSize: 'var(--font-size-sm)'
            }}>
              {entry.name}: {new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                minimumFractionDigits: 0
              }).format(entry.value)}
            </p>
          ))}
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
        {title || 'Столбчатый график'}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={data}>
          <XAxis 
            dataKey="month" 
            stroke="var(--color-text-secondary)"
            fontSize={12}
          />
          <YAxis 
            stroke="var(--color-text-secondary)"
            fontSize={12}
            tickFormatter={formatYAxis}
          />
          <Tooltip content={renderTooltip} />
          <Legend 
            verticalAlign="top" 
            height={36}
            formatter={(value) => (
              <span style={{ color: 'var(--color-text)', fontSize: 'var(--font-size-sm)' }}>
                {value}
              </span>
            )}
          />
          <Bar 
            dataKey="income" 
            name="Доходы" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="expense" 
            name="Расходы" 
            fill="#ef4444" 
            radius={[4, 4, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChart;