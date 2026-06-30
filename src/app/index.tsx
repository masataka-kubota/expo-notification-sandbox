import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
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

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then((value) => setChannels(value ?? []));
    }
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

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
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken, setStatusMessage);
        }}
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
