export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

let notificationTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleLocalNotification(timeHHMM: string): void {
  if (notificationTimer) clearTimeout(notificationTimer);
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const [hours, minutes] = timeHHMM.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);

  const delay = target.getTime() - now.getTime();

  notificationTimer = setTimeout(async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      reg.showNotification('Habit Reminder', {
        body: "Don't forget to check in your habits today!",
        icon: '/icons/icon-192.png',
        tag: 'daily-reminder',
      });
    } catch {
      new Notification('Habit Reminder', {
        body: "Don't forget to check in your habits today!",
      });
    }
    // Re-schedule for tomorrow
    scheduleLocalNotification(timeHHMM);
  }, delay);
}

export function cancelScheduledNotification(): void {
  if (notificationTimer) {
    clearTimeout(notificationTimer);
    notificationTimer = null;
  }
}
