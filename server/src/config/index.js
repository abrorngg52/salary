import path from 'path';
import { fileURLToPath } from 'url';

// Получаем директорию текущего модуля (аналог __dirname в CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Порт, на котором будет работать сервер
export const PORT = process.env.PORT || 3001;

// Путь к файлу базы данных SQLite (будет создан в корне папки server)
export const DB_PATH = path.join(__dirname, '../../database.sqlite');

// Настройки CORS для разрешения запросов с фронтенда (Vite по умолчанию на 5173)
export const CORS_OPTIONS = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};