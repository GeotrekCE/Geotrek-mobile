import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.starter.geotrek',
  appName: 'Geotrek mobile',
  webDir: 'www',
  plugins: {
    CapacitorHttp: {
      enabled: false
    },
    SplashScreen: {
      launchAutoHide: false
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#FFFFFF',
      sound: 'beep.wav'
    }
  }
};

export default config;
