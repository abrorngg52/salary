import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { DB_PATH } from '../config/index.js';

// Получаем директорию текущего модуля
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Кэш для подключения к базе
let db = null;
let dbPromise = null;

/**
 * Инициализация подключения к базе данных
 * @returns {Promise<sqlite3.Database>} Промис с объектом базы данных
 */
const initDb = () => {
  return new Promise((resolve, reject) => {
    // Создаём подключение к SQLite
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        reject(err);
        return;
      }

      console.log('Подключение к базе данных установлено');

      // Читаем SQL-схему из файла
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf-8');

      // Выполняем схему для создания таблиц
      db.exec(schema, (err) => {
        if (err) {
          console.error('Ошибка выполнения схемы базы данных:', err);
          reject(err);
          return;
        }

        console.log('Схема базы данных инициализирована');
        resolve(db);
      });
    });
  });
};

/**
 * Получение объекта базы данных
 * @returns {Promise<sqlite3.Database>} Промис с объектом базы данных
 */
export const getDb = () => {
  // Если подключение уже создано — возвращаем его
  if (db) {
    return Promise.resolve(db);
  }

  // Если создание подключения уже началось — возвращаем существующий промис
  if (!dbPromise) {
    dbPromise = initDb();
  }

  return dbPromise;
};

/**
 * Закрытие подключения к базе данных
 */
export const closeDb = () => {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Ошибка закрытия базы данных:', err);
      } else {
        console.log('Подключение к базе данных закрыто');
        db = null;
        dbPromise = null;
      }
    });
  }
};