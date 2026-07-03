import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Platform, Button } from 'react-native';

import { registerForPushNotificationsAsync } from '@/utils/registerForPushNotificationsAsync';
import { schedulePushNotification } from '@/utils/schedulePushNotification';
import { sendPushNotification } from '@/utils/sendPushNotification';

export default function Index() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined,
  );

  // NOTE: In a production app, push notification registration and listeners should be
  // placed in `_layout.tsx` (root layout) so they persist across all routes.
  // This useEffect is kept here only for debugging — the `setNotification` call
  // displays received notification data in the UI for development purposes.
  useEffect(() => {
    // Step 1: Register for push notifications (permissions, channel, token)
    registerForPushNotificationsAsync()
      .then((token) => {
        setExpoPushToken(token ?? '');
        setStatusMessage(token ? 'Push token obtained.' : 'Push token is empty.');
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : `${error}`;
        setExpoPushToken('');
        setStatusMessage(message);
      });

    // Step 2: (Android only) Fetch existing notification channels for debugging
    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then((value) => setChannels(value ?? []));
    }

    // Step 3: Listen for notifications received while the app is in the foreground
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log(
        '📩 Notification received:',
        notification.request.content.title,
        notification.request.content.body,
      );
      setNotification(notification);
    });

    // Cleanup: remove both listeners when the component unmounts
    return () => {
      notificationListener.remove();
    };
  }, []);

  /**
   * Schedules a local push notification to be delivered after a 2-second delay.
   */
  const handleScheduleNotification = useCallback(async () => {
    await schedulePushNotification();
  }, []);

  /**
   * Sends a remote push notification to this device via the Expo Push API.
   */
  const handleSendNotification = useCallback(async () => {
    await sendPushNotification(expoPushToken, setStatusMessage);
  }, [expoPushToken, setStatusMessage]);

  /**
   * Sends a remote push notification with a deep link redirect to /redirect-success.
   * Tapping the notification will navigate to that page.
   */
  const handleSendRedirectNotification = useCallback(async () => {
    await sendPushNotification(expoPushToken, setStatusMessage, {
      title: 'Redirect Notification',
      body: 'Tap to navigate to the success page!',
      redirectUrl: '/redirect-success',
    });
  }, [expoPushToken, setStatusMessage]);

  return (
    <View style={styles.container}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <Text>Status: {statusMessage}</Text>
      <Text>{`Channels: ${JSON.stringify(
        channels.map((c) => c.id),
        null,
        2,
      )}`}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button title="Press to schedule a notification" onPress={handleScheduleNotification} />
      <Button title="Press to Send Notification" onPress={handleSendNotification} />
      <Button
        title="Press to Send Redirect Notification"
        onPress={handleSendRedirectNotification}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
