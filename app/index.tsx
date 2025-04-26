import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { configureNotificationHandler } from '../src/utils/notifications';

export default function Index() {
  // Set notification handler once at app start
  useEffect(() => {
    (async () => {
      // Request permissions and configure handler for foreground notifications
      const { granted } = await Notifications.requestPermissionsAsync();
      if (!granted) {
        console.warn('Notifications permission not granted');
      }
      configureNotificationHandler();
    })();
  }, []);

  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const completed = await AsyncStorage.getItem('tutorialComplete');
      setInitialRoute(completed ? '/home' : '/splash');
    })();
  }, []);

  if (!initialRoute) return null;
  return <Redirect href={initialRoute} />;
}