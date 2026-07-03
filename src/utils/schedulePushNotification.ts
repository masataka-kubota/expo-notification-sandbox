import * as Notifications from 'expo-notifications';

/**
 * Schedules a local push notification to be delivered after a 2-second delay.
 *
 * This is a convenience wrapper around
 * [`Notifications.scheduleNotificationAsync`](https://docs.expo.dev/versions/latest/sdk/notifications/#notificationschedulesnotificationasync)
 * that demonstrates a simple time-interval trigger.
 *
 * The notification payload is hardcoded for demonstration purposes.
 *
 * @returns A promise that resolves when the notification has been scheduled.
 *
 * @example
 * ```ts
 * // A notification will appear on the device in ~2 seconds.
 * await schedulePushNotification();
 * ```
 *
 * @see https://docs.expo.dev/push-notifications/sending-custom-notifications/
 */
export const schedulePushNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here', test: { test1: 'more data' } },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
};
