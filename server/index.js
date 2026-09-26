import app from './src/app.js';
import { PORT } from './src/config/index.js';
import { closeDb } from './src/db/connection.js';

/**
 * Запуск сервера
 */
const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log('===========================================');
    console.log(`🚀 Salary Tracker API запущен`);
    console.log(`📍 Порт: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api/v1`);
    console.log('===========================================');
  });

  // Корректное завершение работы при получении сигнала
  const gracefulShutdown = (signal) => {
    console.log(`\n📴 Получен сигнал ${signal}. Завершаем работу...`);
    
    server.close(() => {
      console.log('HTTP-сервер закрыт');
      
      closeDb().then(() => {
        console.log('✅ Подключение к базе данных закрыто. До свидания!');
        process.exit(0);
      }).catch((err) => {
        console.error('Ошибка при закрытии базы данных:', err);
        process.exit(1);
      });
    });

    // Принудительное завершение, если graceful shutdown занимает слишком много времени
    setTimeout(() => {
      console.error('⚠️ Принудительное завершение работы');
      process.exit(1);
    }, 5000);
  };

  // Обработка сигналов завершения
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Обработка необработанных ошибок
  process.on('uncaughtException', (err) => {
    console.error('❌ Необработанная ошибка:', err);
    gracefulShutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason) => {
    console.error('❌ Необработанный промис:', reason);
    gracefulShutdown('unhandledRejection');
  });
};

// Запускаем сервер
startServer();