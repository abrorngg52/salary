import { STORAGE_KEYS } from '../utils/constants';

/**
 * Генерация уникального идентификатора
 * @returns {string} UUID
 */
export const generateId = () => {
  // Используем crypto.randomUUID() если доступен, иначе fallback
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback для старых браузеров
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Получение данных из localStorage
 * @param {string} key - Ключ
 * @param {*} defaultValue - Значение по умолчанию
 * @returns {*} Данные
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Ошибка чтения из localStorage (ключ: ${key}):`, error);
    return defaultValue;
  }
};

/**
 * Сохранение данных в localStorage
 * @param {string} key - Ключ
 * @param {*} value - Значение
 */
export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Ошибка записи в localStorage (ключ: ${key}):`, error);
  }
};

/**
 * Удаление данных из localStorage
 * @param {string} key - Ключ
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Ошибка удаления из localStorage (ключ: ${key}):`, error);
  }
};

/**
 * Получение всех доходов
 * @returns {Array} Массив доходов
 */
export const getIncomes = () => {
  return getFromStorage(STORAGE_KEYS.INCOMES, []);
};

/**
 * Сохранение всех доходов
 * @param {Array} incomes - Массив доходов
 */
export const setIncomes = (incomes) => {
  setToStorage(STORAGE_KEYS.INCOMES, incomes || []);
};

/**
 * Получение всех расходов
 * @returns {Array} Массив расходов
 */
export const getExpenses = () => {
  return getFromStorage(STORAGE_KEYS.EXPENSES, []);
};

/**
 * Сохранение всех расходов
 * @param {Array} expenses - Массив расходов
 */
export const setExpenses = (expenses) => {
  setToStorage(STORAGE_KEYS.EXPENSES, expenses || []);
};