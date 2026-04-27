import { store } from './Store.js';

const NOTIFICATION_PERMISSION = {
    GRANTED: 'granted',
    DENIED: 'denied',
};

let reminderInterval = null;

export const requestNotificationPermission = () => {
    if (!('Notification' in window)) {
        console.warn('This browser does not support desktop notification');
        return;
    }

    if (Notification.permission !== NOTIFICATION_PERMISSION.DENIED) {
        Notification.requestPermission().then(permission => {
            if (permission === NOTIFICATION_PERMISSION.GRANTED) {
                console.log('Notification permission granted.');
                startReminderCheck();
            }
        });
    }
};

export const startReminderCheck = () => {
    if (Notification.permission !== NOTIFICATION_PERMISSION.GRANTED) {
        return; // Do not start if permission is not granted
    }

    // Clear any existing interval to prevent duplicates
    if (reminderInterval) {
        clearInterval(reminderInterval);
    }

    // Check for reminders every minute
    reminderInterval = setInterval(() => {
        const tasks = store.tasks || [];
        const now = new Date();

        tasks.forEach(task => {
            if (task.status === 'pending' && task.reminder && task.dueDate) {
                const dueDate = new Date(task.dueDate + 'T00:00:00');
                let reminderTime = null;

                switch (task.reminder) {
                    case 'on_due_date':
                        reminderTime = new Date(dueDate.getTime());
                        reminderTime.setHours(9, 0, 0, 0); // 9:00 AM on the due date
                        break;
                    case '1_hour_before':
                        reminderTime = new Date(dueDate.getTime() - 60 * 60 * 1000);
                        break;
                    case '1_day_before':
                        reminderTime = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000);
                        break;
                    default:
                        break;
                }

                if (reminderTime && 
                    now.getFullYear() === reminderTime.getFullYear() &&
                    now.getMonth() === reminderTime.getMonth() &&
                    now.getDate() === reminderTime.getDate() &&
                    now.getHours() === reminderTime.getHours() &&
                    now.getMinutes() === reminderTime.getMinutes()) {
                    
                    showNotification(task);
                }
            }
        });
    }, 60000); // Every 60 seconds
};

const showNotification = (task) => {
    const title = `Reminder: ${task.title}`;
    const options = {
        body: `Your mission "${task.title}" is due soon.`,
        icon: './assets/icons/sirius-logo.png' // Optional: Add an icon
    };

    new Notification(title, options);
};
