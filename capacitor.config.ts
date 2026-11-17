import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.durusi.app',
  appName: 'دروسي',
  webDir: 'www',
  bundledWebRuntime: false,
  backgroundColor: '#081329',
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: true
  },
  android: {
    allowMixedContent: false
  }
};

export default config;
