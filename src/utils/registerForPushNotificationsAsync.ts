import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { handleRegistrationError } from '@/utils/handleRegistrationError';

/**
 * Registers the device for push notifications and returns the Expo push token.
 *
 * This function performs the following steps:
 * 1. On Android, creates a default notification channel with maximum importance.
 * 2. Requests push notification permissions from the user (if not already granted).
 * 3. Retrieves the EAS project ID from `app.config.ts` (or `app.json`).
 * 4. Requests an Expo push token from the EAS Push service.
 *
 * On any failure (permission denied, missing project ID, network error, etc.)
 * an alert is shown and an `Error` is thrown.
 *
 * @returns The Expo push token string, or `undefined` if registration failed
 *   (the function will have already thrown in that case).
 *
 * @example
 * ```ts
 * const token = await registerForPushNotificationsAsync();
 * // token is a string like "ExponentPushToken[...]"
 * ```
 *
 * @see https://docs.expo.dev/push-notifications/quickstart/
 */
export const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    handleRegistrationError('Permission not granted to get push token for push notification!');
  }

  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  if (!projectId) {
    handleRegistrationError(
      'Project ID not found. Configure extra.eas.projectId in app.json or create an EAS project.',
    );
  }
  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    if (__DEV__) {
      console.log(pushTokenString);
    }
    return pushTokenString;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    handleRegistrationError(message);
  }
};
