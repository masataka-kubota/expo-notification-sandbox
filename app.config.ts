import type { ConfigContext, ExpoConfig } from 'expo/config';

type AppVariant = 'development' | 'preview' | 'production';

interface VariantConfig {
  appName: string;
  bundleIdentifier: string;
}

const VARIANT_CONFIGS: Record<AppVariant, VariantConfig> = {
  development: {
    appName: 'ExpoNotificationsSandbox (Dev)',
    bundleIdentifier: 'com.expo.notification.sandbox.dev',
  },
  preview: {
    appName: 'ExpoNotificationsSandbox (Preview)',
    bundleIdentifier: 'com.expo.notification.sandbox.preview',
  },
  production: {
    appName: 'ExpoNotificationsSandbox',
    bundleIdentifier: 'com.expo.notification.sandbox',
  },
};

const getVariantConfig = (): VariantConfig => {
  const variant = process.env.APP_VARIANT as AppVariant | undefined;
  return VARIANT_CONFIGS[variant ?? 'production'];
};

const variantConfig = getVariantConfig();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: variantConfig.appName,
  slug: 'expo-notification-sandbox',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'exponotificationsandbox',
  userInterfaceStyle: 'automatic',
  ios: {
    icon: './assets/expo.icon',
    bundleIdentifier: variantConfig.bundleIdentifier,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    package: variantConfig.bundleIdentifier,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-notifications',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#208AEF',
        android: {
          image: './assets/images/splash-icon.png',
          imageWidth: 76,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    ...config.extra,
    router: {},
    eas: {
      projectId: 'a87e19b2-b67f-4950-bb78-950de030f659',
    },
  },
  owner: 'packerman1212',
});
