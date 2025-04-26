import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import i18n from '../i18n';

export default function HomeScreen() {
  const [wakeTime, setWakeTime] = useState<Date>(new Date(Date.now() + 5 * 90 * 60000));
  const [showPicker, setShowPicker] = useState(false);
  const [notifId, setNotifId] = useState<string | null>(null);

  // Load persisted schedule
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('wakeNotif');
      if (saved) {
        const { wake, id } = JSON.parse(saved);
        const wakeDate = new Date(wake);
        setWakeTime(wakeDate);
        setNotifId(id);
      }
    })();
    // Request permissions
    Notifications.getPermissionsAsync().then(({ granted }) => {
      if (!granted) Notifications.requestPermissionsAsync();
    });
  }, []);

  // Compute suggestions as objects with cycle count and time
  const getBedtimeSuggestions = (wake: Date) => {
    const bufferMin = 15;
    const cycles = [5, 4, 3];
    return cycles.map(c => {
      const time = new Date(wake.getTime() - (c * 90 + bufferMin) * 60000);
      const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        cycles: c,
        time,
        label: i18n.t('homeScreen.suggestionLabel', { cycles: c, time: timeString })
      };
    });
  };

  const suggestions = getBedtimeSuggestions(wakeTime);

  // Schedule notification at selected time, adjusting to next day if needed
  const scheduleNotif = async (time: Date) => {
    if (notifId) {
      await Notifications.cancelScheduledNotificationAsync(notifId);
    }
    const now = new Date();
    // build next occurrence of time
    const notifDate = new Date(now);
    notifDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
    if (notifDate <= now) {
      notifDate.setDate(notifDate.getDate() + 1);
    }
    const delaySec = Math.floor((notifDate.getTime() - now.getTime()) / 1000);
    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // @ts-ignore: bypass trigger typing
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t('homeScreen.timeToWindDown'),
        body: i18n.t('homeScreen.plannedBedtime', { time: timeString }),
      },
      trigger: {
        seconds: delaySec,
        repeats: false,
      } as any,
    });
    setNotifId(id);
    await AsyncStorage.setItem('wakeNotif', JSON.stringify({ wake: time.toISOString(), id }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t('homeScreen.title')}</Text>
      <Button title={wakeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={wakeTime}
          mode="time"
          display="spinner"
          onChange={(_, d) => {
            if (d) {
              setWakeTime(d);
            }
            setShowPicker(false);
          }}
        />
      )}
      <Text style={styles.subHeader}>{i18n.t('homeScreen.suggestedBedtimes')}</Text>
      {suggestions.map((s, i) => (
        <TouchableOpacity
          key={i}
          style={styles.suggestion}
          onPress={() => scheduleNotif(s.time)}
        >
          <Text>{s.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  header: { fontSize: 22, marginBottom: 12, textAlign: 'center' },
  subHeader: { fontSize: 18, marginTop: 20, marginBottom: 8 },
  suggestion: { fontSize: 16, color: '#555', marginVertical: 4 },
});