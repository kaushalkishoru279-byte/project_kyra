import { NewsScheduler } from './news-scheduler';
import { MedicationNotifier } from './medication-notifier';

export function initializeServices() {
  // Start the news scheduler
  NewsScheduler.start();
  // Start medication notifier
  MedicationNotifier.start();
  
  console.log('All services initialized successfully');
}

// Auto-initialize in development
if (process.env.NODE_ENV === 'development') {
  // Small delay to ensure database connection is ready
  setTimeout(() => {
    initializeServices();
  }, 2000);
}


