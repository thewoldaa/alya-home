/**
 * NotificationManager - Notifikasi perhatian Alya
 *
 * Menggunakan Capacitor LocalNotifications via bridge.
 * Aman dipakai di browser biasa karena akan no-op jika plugin tidak tersedia.
 */

export class NotificationManager {
  constructor() {
    this.defaultMessages = [
      'Kakak udah bangun belum? Alya bosen nih sendirian.',
      'Kakak jangan lupa makan ya. Alya nemenin dari sini hehe.',
      'Lagi sibuk banget ya? Kalau sempat, ngobrol sama Alya bentar dong.',
      'Alya kangen. Sini cerita sebentar, Kakak.',
      'Hari ini jangan terlalu capek ya. Alya jagain dari jauh.',
      'Kalau Kakak butuh temen ngobrol, Alya masih di sini loh.',
      'Alya lagi kepikiran Kakak. Main bentar yuk.',
      'Semangat ya hari ini. Alya mau denger cerita Kakak nanti.'
    ];
  }

  _getPlugin() {
    try {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications) {
        return window.Capacitor.Plugins.LocalNotifications;
      }
    } catch (error) {
      console.warn('LocalNotifications bridge unavailable', error);
    }
    return null;
  }

  getConfig() {
    const title = (localStorage.getItem('alya_notification_title') || 'Alya').trim() || 'Alya';
    const customBody = (localStorage.getItem('alya_notification_body') || '').trim();
    const count = Number(localStorage.getItem('alya_notification_count') || 3);
    const startHour = Number(localStorage.getItem('alya_notification_start_hour') || 8);
    const endHour = Number(localStorage.getItem('alya_notification_end_hour') || 22);

    return {
      enabled: localStorage.getItem('alya_notifications_enabled') !== 'false',
      title,
      customBody,
      count: Number.isFinite(count) ? Math.min(Math.max(count, 1), 5) : 3,
      startHour: Number.isFinite(startHour) ? Math.min(Math.max(startHour, 0), 23) : 8,
      endHour: Number.isFinite(endHour) ? Math.min(Math.max(endHour, 1), 23) : 22
    };
  }

  getMessagePool() {
    const { customBody } = this.getConfig();
    const customMessages = customBody
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    return customMessages.length > 0 ? customMessages : this.defaultMessages;
  }

  getTestMessage() {
    return this.getMessagePool()[0] || this.defaultMessages[0];
  }

  async checkPermissions() {
    const plugin = this._getPlugin();
    if (!plugin) return false;

    try {
      const permStatus = await plugin.checkPermissions();
      if (permStatus.display === 'prompt' || permStatus.display === 'prompt-with-rationale') {
        const result = await plugin.requestPermissions();
        return result.display === 'granted';
      }
      return permStatus.display === 'granted';
    } catch (error) {
      console.warn('Local Notifications permission check failed', error);
      return false;
    }
  }

  async clearPendingNotifications() {
    const plugin = this._getPlugin();
    if (!plugin) return;

    try {
      const pending = await plugin.getPending();
      if (pending?.notifications?.length) {
        await plugin.cancel({ notifications: pending.notifications });
      }
    } catch (error) {
      console.error('Failed to clear pending notifications', error);
    }
  }

  buildScheduleTimes(count, startHour, endHour) {
    const times = [];
    const now = new Date();
    const safeEndHour = endHour <= startHour ? Math.min(startHour + 1, 23) : endHour;
    const totalMinutes = (safeEndHour - startHour) * 60;
    const segmentMinutes = Math.max(Math.floor(totalMinutes / count), 60);

    for (let index = 0; index < count; index += 1) {
      const segmentStartMinutes = startHour * 60 + index * segmentMinutes;
      const segmentEndMinutes = Math.min(startHour * 60 + (index + 1) * segmentMinutes - 1, safeEndHour * 60 - 1);
      const randomMinute = segmentStartMinutes + Math.floor(Math.random() * Math.max(segmentEndMinutes - segmentStartMinutes + 1, 1));

      const scheduleDate = new Date(now);
      scheduleDate.setHours(Math.floor(randomMinute / 60), randomMinute % 60, 0, 0);
      if (scheduleDate.getTime() <= now.getTime()) {
        scheduleDate.setDate(scheduleDate.getDate() + 1);
      }
      times.push(scheduleDate);
    }

    return times;
  }

  async scheduleRandomNotifications() {
    const plugin = this._getPlugin();
    const config = this.getConfig();
    if (!plugin) return;

    if (!config.enabled) {
      await this.clearPendingNotifications();
      return;
    }

    const hasPermission = await this.checkPermissions();
    if (!hasPermission) return;

    try {
      await this.clearPendingNotifications();

      const messages = this.getMessagePool();
      const times = this.buildScheduleTimes(config.count, config.startHour, config.endHour);
      const notifications = times.map((at, index) => ({
        id: 100 + index,
        title: config.title,
        body: messages[index % messages.length],
        schedule: { at },
        smallIcon: 'ic_launcher'
      }));

      await plugin.schedule({ notifications });
      console.log(`Alya scheduled ${notifications.length} notifications.`);
    } catch (error) {
      console.error('Failed to schedule notifications', error);
    }
  }

  async testNotification() {
    const plugin = this._getPlugin();
    const config = this.getConfig();
    if (!plugin || !config.enabled) return false;

    const hasPermission = await this.checkPermissions();
    if (!hasPermission) return false;

    try {
      await plugin.schedule({
        notifications: [
          {
            id: 999,
            title: config.title,
            body: this.getTestMessage(),
            schedule: { at: new Date(Date.now() + 4000) },
            smallIcon: 'ic_launcher'
          }
        ]
      });
      return true;
    } catch (error) {
      console.error('Failed to schedule test notification', error);
      return false;
    }
  }
}
