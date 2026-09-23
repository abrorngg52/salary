/**
 * Форматирование суммы в рублях
 * @param {number} amount - Сумма
 * @param {boolean} showSign - Показывать знак +/-
 * @returns {string} Отформатированная строка
 */
export const formatCurrency = (amount, showSign = false) => {
  const value = amount ?? 0;
  const formatted = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));

  if (!showSign) {
    return value < 0 ? `-${formatted}` : formatted;
  }

  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}${formatted}`;
};

/**
 * Форматирование даты в короткий формат (ДД.ММ.ГГГГ)
 * @param {string|Date} date - Дата
 * @returns {string} Отформатированная дата
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Форматирование даты в длинный формат (1 января 2026)
 * @param {string|Date} date - Дата
 * @returns {string} Отформатированная дата
 */
export const formatDateLong = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Форматирование даты в относительном виде ("сегодня", "вчера", "ДД.ММ")
 * @param {string|Date} date - Дата
 * @returns {string} Относительное описание даты
 */
export const formatRelativeDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  
  const diffDays = Math.round((today - target) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Вчера';
  if (diffDays === -1) return 'Завтра';
  
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
  });
};

/**
 * Получение короткого названия месяца
 * @param {number} monthIndex - Индекс месяца (0-11)
 * @returns {string} Короткое название месяца (Янв, Фев, ...)
 */
export const getMonthLabel = (monthIndex) => {
  const months = [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',
  ];
  return months[monthIndex] || '';
};

/**
 * Получение полного названия месяца
 * @param {number} monthIndex - Индекс месяца (0-11)
 * @returns {string} Полное название месяца
 */
export const getMonthLabelFull = (monthIndex) => {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
  ];
  return months[monthIndex] || '';
};

/**
 * Получение ключа месяца из даты (YYYY-MM)
 * @param {string|Date} date - Дата
 * @returns {string} Ключ месяца
 */
export const getMonthKey = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};