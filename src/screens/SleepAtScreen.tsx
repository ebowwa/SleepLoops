import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SleepAtScreen() {
  const [sleepTime, setSleepTime] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const getWakeupSuggestions = (sleep: Date) => {
    const bufferMin = 15;
    const cycles = [5, 4, 3];
    return cycles.map(c => {
      const time = new Date(sleep.getTime() + (c * 90 + bufferMin) * 60000);
      const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return { cycles: c, time, label: `${c} cycles later: ${timeString}` };
    });
  };

  const suggestions = getWakeupSuggestions(sleepTime);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>What time do you want to go to sleep?</Text>
      <Button
        title={sleepTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        onPress={() => setShowPicker(true)}
      />
      {showPicker && (
        <DateTimePicker
          value={sleepTime}
          mode="time"
          display="spinner"
          onChange={(_, d) => {
            if (d) setSleepTime(d);
            setShowPicker(false);
          }}
        />
      )}
      <Text style={styles.subHeader}>Suggestions for wake-up:</Text>
      {suggestions.map((s, i) => (
        <TouchableOpacity key={i} style={styles.suggestion}>
          <Text>{s.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  header: { fontSize: 22, marginBottom: 12, textAlign: 'center' },
  subHeader: { fontSize: 18, marginTop: 20, marginBottom: 8, textAlign: 'center' },
  suggestion: { fontSize: 16, color: '#555', marginVertical: 4 },
});
