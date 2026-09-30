// Базовый URL из .env или дефолтный
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

/**
 * Универсальная функция для HTTP-запросов
 * @param {string} path - Путь эндпоинта (например, '/incomes')
 * @param {Object} options - Настройки запроса (method, body, params)
 * @returns {Promise} Промис с данными ответа
 */
const request = async (path, options = {}) => {
  const { method = 'GET', body = null, params = {} } = options;

  // Формируем URL с query-параметрами
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });

  // Настройки запроса
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Добавляем тело запроса для POST и PUT
  if (body && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url.toString(), config);

    // Парсим JSON ответ
    const data = await response.json();

    // Если ответ успешный (2xx)
    if (response.ok) {
      // Если есть поле data — возвращаем его
      if (data.data !== undefined) {
        // Если есть pagination — возвращаем вместе с ним
        if (data.pagination) {
          return { data: data.data, pagination: data.pagination };
        }
        return data.data;
      }
      // Иначе возвращаем весь ответ
      return data;
    }

    // Если есть ошибка от бэкенда
    if (data.error) {
      const error = new Error(data.error.message);
      error.code = data.error.code;
      error.status = response.status;
      throw error;
    }

    // Неизвестная ошибка
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  } catch (error) {
    // Ошибки сети (нет соединения, CORS и т.д.)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Не удалось подключиться к серверу. Проверьте, запущен ли бэкенд.');
    }
    throw error;
  }
};

/**
 * GET-запрос
 * @param {string} path - Путь эндпоинта
 * @param {Object} params - Query-параметры
 */
export const get = (path, params = {}) => {
  return request(path, { method: 'GET', params });
};

/**
 * POST-запрос
 * @param {string} path - Путь эндпоинта
 * @param {Object} body - Тело запроса
 */
export const post = (path, body) => {
  return request(path, { method: 'POST', body });
};

/**
 * PUT-запрос
 * @param {string} path - Путь эндпоинта
 * @param {Object} body - Тело запроса
 */
export const put = (path, body) => {
  return request(path, { method: 'PUT', body });
};

/**
 * DELETE-запрос
 * @param {string} path - Путь эндпоинта
 */
export const del = (path) => {
  return request(path, { method: 'DELETE' });
};