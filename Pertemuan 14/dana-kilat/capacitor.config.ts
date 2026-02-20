import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.danakilat',
  appName: 'DanaKilat',
  webDir: 'www',
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#2c7be5',
      overlaysWebView: false,
    },
  },
  android: {
    backgroundColor: '#f0f0f0',
    allowMixedContent: true,
  },
};

export default config;