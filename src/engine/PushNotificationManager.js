/**
 * PushNotificationManager - Remote notifications via Firebase Cloud Messaging
 */
export class PushNotificationManager {
  _getPlugin() {
    try {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.PushNotifications) {
        return window.Capacitor.Plugins.PushNotifications;
      }
    } catch (error) {
      console.warn('PushNotifications plugin unavailable');
    }
    return null;
  }

  async init() {
    try {
      const plugin = this._getPlugin();
      if (!plugin) return;

      if (window.Capacitor && !window.Capacitor.isNativePlatform()) {
        console.log('Push skipped: Not a native platform');
        return;
      }

      // Request permissions
      let permStatus = await plugin.checkPermissions();
      if (permStatus.receive !== 'granted') {
        permStatus = await plugin.requestPermissions();
      }

      if (permStatus.receive === 'granted') {
        await plugin.register();
      }

      plugin.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
      });

      plugin.addListener('registrationError', (error) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      });

      plugin.addListener('pushNotificationReceived', (notification) => {
        console.log('Push received: ' + JSON.stringify(notification));
      });

      plugin.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
      });
    } catch (e) {
      console.error('Push Init Error:', e);
    }
  }
}
