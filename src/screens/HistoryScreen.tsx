import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, Button, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { observer } from 'mobx-react-lite';
import * as Notifications from 'expo-notifications';
import SleepStore from '../stores/SleepStore';
import i18n from '../i18n';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { getTheme } from '../styles/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

const HistoryScreen = observer(() => {
  const [upcoming, setUpcoming] = useState<{id:string; title:string; time:Date; storageKey:string}[]>([]);
  // observe reset trigger to reload
  const resetCount = SleepStore.resetTrigger;

  // load upcoming notifications
  const loadUpcoming = useCallback(async () => {
    const items: {id:string; title:string; time:Date; storageKey:string}[] = [];
    // single alarm
    const wakeData = await AsyncStorage.getItem('wakeNotif');
    if (wakeData) {
      const { wake, id } = JSON.parse(wakeData);
      items.push({ id, title: i18n.t('historyScreen.rest'), time: new Date(wake), storageKey: 'wakeNotif' });
    }
    // weekly schedule
    const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const key = `schedule:${i}`;
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const { time, notificationId } = JSON.parse(data);
        let delta = i - now.getDay();
        if (delta < 0) delta += 7;
        const next = new Date(now);
        next.setDate(now.getDate() + delta);
        const dt = new Date(time);
        next.setHours(dt.getHours(), dt.getMinutes(), 0, 0);
        items.push({
          id: notificationId,
          title: i18n.t('historyScreen.wakeOnDay', { day: i18n.t(`weekdays.${WEEKDAYS[i]}`) }),
          time: next,
          storageKey: key
        });
      }
    }
    items.sort((a,b) => a.time.getTime() - b.time.getTime());
    setUpcoming(items);
  }, []);

  // initial load
  useEffect(() => {
    loadUpcoming();
  }, [loadUpcoming]);

  // subscribe to changes when notifications are scheduled/cancelled
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('UpcomingChanged', loadUpcoming);
    return () => sub.remove();
  }, [loadUpcoming]);

  // reload after settings reset
  useEffect(() => {
    loadUpcoming();
  }, [resetCount, loadUpcoming]);

  // reload when screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadUpcoming();
    }, [loadUpcoming])
  );

  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const cancelUpcoming = async ({ id, storageKey }: {id:string;storageKey:string}) => {
    await Notifications.cancelScheduledNotificationAsync(id);
    await AsyncStorage.removeItem(storageKey);
    setUpcoming(prev => prev.filter(item => item.id !== id));
  };

  const renderUpcomingItem = ({ item }: {item:{id:string;title:string;time:Date; storageKey:string}}) => (
    <View style={[styles.item, { borderColor: theme.colors.border }]}>   
      <Text style={[styles.upcomingText, { color: theme.colors.text }]}>{item.title} @ {item.time.toLocaleString()}</Text>
      <Button title={i18n.t('historyScreen.cancel')} onPress={() => cancelUpcoming(item)} color={theme.colors.primary} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>   
      <Text style={[styles.header, { color: theme.colors.headerText }]}>{i18n.t('historyScreen.upcomingNotifications')}</Text>
      {upcoming.length === 0 ? (
        <View style={[styles.placeholderCard, { backgroundColor: theme.colors.card }]}>      
          <View style={[styles.placeholderLine, { backgroundColor: theme.colors.border }]} />
          <View style={[styles.placeholderLine, { width: '60%', backgroundColor: theme.colors.border }]} />
        </View>
      ) : (
        <FlatList
          data={upcoming}
          keyExtractor={item => item.id}
          renderItem={renderUpcomingItem}
          showsVerticalScrollIndicator={true}
          scrollEnabled={true}
          style={styles.upcomingList}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Text style={[styles.header, { marginTop: 20, color: theme.colors.headerText }]}>{i18n.t('historyScreen.history')}</Text>
      {SleepStore.sessions.length === 0 ? (
        <>
          <View style={[styles.placeholderCard, { backgroundColor: theme.colors.card }]}>       
            <View style={[styles.placeholderLine, { backgroundColor: theme.colors.border }]} />
            <View style={[styles.placeholderLine, { width: '60%', backgroundColor: theme.colors.border }]} />
          </View>
          <View style={[styles.placeholderCard, { backgroundColor: theme.colors.card }]}>       
            <View style={[styles.placeholderLine, { backgroundColor: theme.colors.border }]} />
            <View style={[styles.placeholderLine, { width: '60%', backgroundColor: theme.colors.border }]} />
          </View>
        </>
      ) : (
        <FlatList
          data={SleepStore.sessions.slice().reverse()}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={true}
          scrollEnabled={true}
          style={styles.historyList}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const duration = item.end ? item.end - item.start : 0;
            const hours = (duration / (1000 * 60 * 60)).toFixed(2);
            return (
              <View style={[styles.item, { borderColor: theme.colors.border }]}>  
                <Text style={{ color: theme.colors.text }}>{`${i18n.t('historyScreen.start')}: ${new Date(item.start).toLocaleString()}`}</Text>
                <Text style={{ color: theme.colors.text }}>{`${i18n.t('historyScreen.end')}: ${item.end ? new Date(item.end).toLocaleString() : i18n.t('historyScreen.ongoing')}`}</Text>
                {item.end && <Text style={{ color: theme.colors.text }}>{i18n.t('historyScreen.durationHours', { hours })}</Text>}
              </View>
            );
          }}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 100 }, 
  header: { fontSize: 24, marginBottom: 10 },
  item: { padding: 10, borderBottomWidth: 1, width: '100%' },
  upcomingText: { fontSize: 16 },
  noneText: { fontSize: 16, color: '#ccc' },
  upcomingList: { maxHeight: 150, width: '100%' },
  historyList: { flex: 1, width: '100%' },
  listContent: { paddingBottom: 20 },
  placeholderCard: {
    width: CARD_WIDTH,
    height: 80,
    borderRadius: 12,
    marginBottom: 16,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Android shadow
    elevation: 4,
    padding: 12,
    justifyContent: 'center',
  },
  placeholderLine: {
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
    width: '80%',
  },
});

export default HistoryScreen;