import * as Notifications from 'expo-notifications';
import type { Href } from 'expo-router';
import { router, Stack, usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Handle deep links when the app is launched from a notification
 * (background or killed state).
 */
export default function RootLayout() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  // Sync pathname into a ref so the notification listener can read the latest value
  // without being re-registered on every page change (which would cause duplicate listeners).
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    // Step 4: Listen for notification responses when the app is running (foreground or background)
    // (e.g. app was in foreground or background and user tapped the notification)
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(
        '👆 Notification tapped:',
        response.notification.request.content.title,
        'Action:',
        response.actionIdentifier,
      );

      const redirectUrl = response.notification.request.content.data?.url as string | undefined;
      if (redirectUrl && pathnameRef.current !== redirectUrl) {
        console.log('🔗 Notification tapped, redirecting to:', redirectUrl);
        router.push(redirectUrl as Href);
      }
    });

    // Step 5: Check if the app was launched from a notification (killed state)
    // (e.g. user tapped the notification when the app was not running)
    const lastResponse = (() => {
      try {
        return Notifications.getLastNotificationResponse();
      } catch {
        return null;
      }
    })();
    if (lastResponse) {
      const redirectUrl = lastResponse.notification.request.content.data?.url as string | undefined;
      if (redirectUrl && pathnameRef.current !== redirectUrl) {
        console.log('🔗 Launched from notification, redirecting to:', redirectUrl);
        router.push(redirectUrl as Href);
      }
    }
    return () => {
      responseListener.remove();
    };
  }, []);

  return <Stack />;
}
