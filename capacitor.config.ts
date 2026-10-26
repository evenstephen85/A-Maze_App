import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mycrew.amaze',
  appName: 'A-Maze',
  webDir: 'dist',
  backgroundColor: '#000000',
  ios: {
    contentInset: 'always',
  },
  android: {
    backgroundColor: '#000000',
  },
};

export default config;
