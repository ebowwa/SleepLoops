import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Pressable, DeviceEventEmitter } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ExpoNotifications from 'expo-notifications';
import i18n from '../i18n';
import { configureNotificationHandler, scheduleNotification, createTimeIntervalTrigger } from '../utils/notifications';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Schedule() {
  const [times, setTimes] = useState<Date[]>(() =>
    WEEKDAYS.map(() => {
      const d = new Date();
      d.setHours(7, 0, 0, 0);
      return d;
    })
  );
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Calculate next date in current week for weekday
  const calculateNextDate = (dayIdx: number, timeDate: Date) => {
    const now = new Date();
    let delta = dayIdx - now.getDay();
    if (delta < 0) delta += 7;
    const next = new Date(now);
    next.setDate(now.getDate() + delta);
    next.setHours(timeDate.getHours(), timeDate.getMinutes(), 0, 0);
    return next;
  };

  // Save to AsyncStorage and schedule notification
  const saveAndSchedule = async (dayIdx: number, timeDate: Date) => {
    // cancel old
    const key = `schedule:${dayIdx}`;
    const saved = await AsyncStorage.getItem(key);
    if (saved) {
      const { notificationId: oldId } = JSON.parse(saved);
      if (oldId) await ExpoNotifications.cancelScheduledNotificationAsync(oldId);
    }
    // schedule new
    const triggerDate = calculateNextDate(dayIdx, timeDate);
    const seconds = Math.max(Math.floor((triggerDate.getTime() - Date.now()) / 1000), 1);
    const trigger = createTimeIntervalTrigger(seconds, false);
    const id = await scheduleNotification(
      { title: i18n.t('scheduleScreen.wakeUpTitle'), body: i18n.t('scheduleScreen.wakeUpBody', { day: i18n.t(`weekdays.${WEEKDAYS[dayIdx]}`) }) },
      trigger
    );
    // save new
    await AsyncStorage.setItem(key, JSON.stringify({ time: timeDate.getTime(), notificationId: id }));
    // notify HistoryScreen to reload upcoming
    DeviceEventEmitter.emit('UpcomingChanged');
  };

  const openPicker = (idx: number) => {
    setSelectedDay(idx);
    setShowPicker(true);
  };

  const onTimeChange = (_: any, date?: Date) => {
    setShowPicker(false);
    if (date !== undefined && selectedDay !== null) {
      setTimes(prev => {
        const updated = prev.map((t, i) => (i === selectedDay ? date : t));
        saveAndSchedule(selectedDay, date);
        return updated;
      });
    }
  };

  // Suggest bedtimes based on 90-min sleep cycles + 15-min buffer
  const getBedtimeSuggestions = (wakeTime: Date) => {
    const bufferMin = 15;
    const cycles = [5, 4, 3]; // 5*90=7.5h, 4*90=6h, 3*90=4.5h
    return cycles.map(c => {
      const offsetMin = c * 90 + bufferMin;
      const d = new Date(wakeTime.getTime() - offsetMin * 60000);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
  };

  // init: configure and load saved times
  useEffect(() => {
    configureNotificationHandler();
    ExpoNotifications.requestPermissionsAsync();
    (async () => {
      const loaded = [...times];
      for (let i = 0; i < WEEKDAYS.length; i++) {
        const key = `schedule:${i}`;
        const item = await AsyncStorage.getItem(key);
        if (item) {
          const { time } = JSON.parse(item);
          loaded[i] = new Date(time);
        }
      }
      setTimes(loaded);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t('scheduleScreen.title')}</Text>
      <FlatList
        data={WEEKDAYS}
        contentContainerStyle={styles.listContent}
        keyExtractor={(_, idx) => idx.toString()}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <View style={styles.dayRow}>
              <Text style={styles.dayLabel}>{i18n.t(`weekdays.${item}`)}</Text>
              <Text style={styles.timeLabel}>
                {times[index].toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Pressable style={styles.setButton} onPress={() => openPicker(index)}>
                <Text style={styles.setButtonText}>{i18n.t('scheduleScreen.set')}</Text>
              </Pressable>
            </View>
            <Text style={styles.suggestion}>{i18n.t('scheduleScreen.suggestedBedtimes', { times: getBedtimeSuggestions(times[index]).join(', ') })}</Text>
          </View>
        )}
      />
      {showPicker && selectedDay !== null && (
        <DateTimePicker
          value={times[selectedDay]}
          mode="time"
          display="spinner"
          onChange={onTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, alignSelf: 'center' },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android shadow
    elevation: 3,
  },
  dayRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4, paddingHorizontal: 10 },
  setButton: {
    backgroundColor: '#647eff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  setButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  dayLabel: { flex: 1, fontWeight: '500' },
  timeLabel: { flex: 1, textAlign: 'center', fontWeight: '500' },
  suggestion: { fontSize: 12, color: '#666', marginLeft: 10, marginTop: 8 },
  listContent: { alignItems: 'center', paddingBottom: 20 },
});
