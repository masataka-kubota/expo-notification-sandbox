interface SendPushNotificationOptions {
  /**
   * The title of the push notification. Overrides the default "Original Title".
   */
  title?: string;
  /**
   * The body of the push notification. Overrides the default "And here is the body!".
   */
  body?: string;
  /**
   * An expo-router path to navigate to when the user taps the notification.
   * This is stored in `notification.request.content.data.url` and consumed
   * by `addNotificationResponseReceivedListener`.
   */
  redirectUrl?: string;
}

/**
 * Sends a push notification to a specific device using the Expo Push API.
 *
 * This function makes a `POST` request to
 * `https://exp.host/--/api/v2/push/send` with the given Expo push token
 * and a hardcoded message payload.
 *
 * The result (success or failure) is communicated through the
 * `onStatusUpdate` callback rather than a return value, so the UI can
 * display real-time feedback to the user.
 *
 * @param expoPushToken - The recipient's Expo push token (e.g. `"ExponentPushToken[...]"`).
 * @param onStatusUpdate - A callback invoked with status messages such as
 *   `"Sending notification..."`, `"Send succeeded: {...}"`, or
 *   `"Send failed: ..."`.
 * @param options - Optional configuration for the notification.
 * @param options.redirectUrl - An expo-router path (e.g. `"/redirect-success"`)
 *   that the app will navigate to when the user taps the notification.
 *
 * @example
 * ```ts
 * // Basic usage
 * sendPushNotification(expoPushToken, (msg) => {
 *   setStatusMessage(msg);
 * });
 *
 * // With deep link redirect
 * sendPushNotification(expoPushToken, setStatusMessage, {
 *   redirectUrl: '/redirect-success',
 * });
 * ```
 *
 * @see https://docs.expo.dev/push-notifications/sending-notifications/
 */
export const sendPushNotification = async (
  expoPushToken: string,
  onStatusUpdate: (message: string) => void,
  options: SendPushNotificationOptions = {},
) => {
  if (!expoPushToken) {
    onStatusUpdate('Push token is not ready yet. Wait for registration to complete.');
    return;
  }

  onStatusUpdate('Sending notification...');

  const message = {
    to: expoPushToken,
    sound: 'default',
    title: options.title ?? 'Original Title',
    body: options.body ?? 'And here is the body!',
    data: {
      someData: 'goes here',
      ...(options.redirectUrl ? { url: options.redirectUrl } : {}),
    },
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const responseBody = await response.text();

    if (!response.ok) {
      onStatusUpdate(`Send failed (${response.status}): ${responseBody}`);
      return;
    }

    onStatusUpdate(`Send succeeded: ${responseBody}`);
  } catch (error: unknown) {
    onStatusUpdate(`Send failed: ${error}`);
  }
};
