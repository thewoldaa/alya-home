import { PushNotifications } from '@capacitor/push-notifications';

export class PushNotificationManager {
  constructor() {
    this.isNative = window.Capacitor?.isNativePlatform();
  }

  async init() {
    if (!this.isNative) {
      console.log('Push notifications: skipped (not native)');
      return;
    }

    try {
      // Check if plugin is available
      if (!PushNotifications) {
        console.warn('PushNotifications plugin not found');
        return;
      }

      // Add listeners
      await this.addListeners();

      // Check permissions
      let permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn('Push notification permission not granted');
        return;
      }

      // Register with Apple / Google
      await PushNotifications.register();
      
      console.log('Push notifications: registered');
    } catch (error) {
      console.error('Push notification initialization failed:', error);
      // We don't throw here to prevent app crash
    }
  }

  async addListeners() {
    try {
      await PushNotifications.addListener('registration', token => {
        console.log('Push registration success, token: ' + token.value);
        // Automatically subscribe to 'all' topic for broadcast
        // Note: Capacitor doesn't have a built-in 'subscribeToTopic' in the core plugin,
        // but we can handle it via server-side or a community plugin.
        // For now, we just log the token.
      });

      await PushNotifications.addListener('registrationError', err => {
        console.error('Push registration error: ', err.error);
      });

      await PushNotifications.addListener('pushNotificationReceived', notification => {
        console.log('Push received: ', notification);
      });

      await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
        console.log('Push action performed: ', notification);
      });
    } catch (e) {
      console.error('Failed to add push listeners:', e);
    }
  }
}
