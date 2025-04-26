import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  AccessibilityInfo,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SleepStore from '../stores/SleepStore';

interface Props {
  onAddPress: () => void;
  onWeeklyPress: () => void;
}

const ARROW_TIP_TIME = 10000;
const FADE_DURATION = 300;
const BUBBLE_WIDTH = 120;
const ARROW_WIDTH = 16;  // arrow width as per spec (16px)
const ARROW_HEIGHT = 8;

export default function ArrowTutorialOverlay({ onAddPress, onWeeklyPress }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | null>(null);  // use numeric ID for RN setTimeout

  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem('arrowTutorialSeen');
      const keys = await AsyncStorage.getAllKeys();
      const hasWake = keys.includes('wakeNotif');
      const hasSchedule = keys.some(k => k.startsWith('schedule:'));
      const hasUpcoming = hasWake || hasSchedule;
      const hasHistory = SleepStore.sessions.length > 0;
      if (!seen && !hasUpcoming && !hasHistory) {
        setVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }).start();
        timer.current = setTimeout(() => dismiss(), ARROW_TIP_TIME);
        // focus first bubble for accessibility
        AccessibilityInfo.setAccessibilityFocus(null);
      }
    })();
    return () => timer.current && clearTimeout(timer.current);
  }, []);

  const dismiss = async () => {
    if (timer.current !== null) clearTimeout(timer.current);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start(async () => {
      setVisible(false);
      await AsyncStorage.setItem('arrowTutorialSeen', '1');
    });
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} pointerEvents="box-none">
      {/* Add button callout */}
      <TouchableOpacity
        accessibilityLabel="Get started"
        style={[styles.bubble, { top: 40, right: 10 }]} 
        onPress={() => {
          dismiss();
          onAddPress();
        }}
      >
        {/* <Text style={styles.text}>Get started</Text> */}
        {/* <View style={styles.arrow} /> */}
      </TouchableOpacity>

      {/* Weekly calendar callout */}
      <TouchableOpacity
        accessibilityLabel="Plan around the week"
        style={[styles.bubble, { top: 40, right: 50 }]} 
        onPress={() => {
          dismiss();
          onWeeklyPress();
        }}
      >
        {/* <Text style={styles.text}>Plan around the week</Text> */}
        {/* <View style={styles.arrow} /> */}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    position: 'absolute',
    width: BUBBLE_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  arrow: {
    position: 'absolute',
    bottom: -ARROW_HEIGHT,
    left: (BUBBLE_WIDTH / 2) - (ARROW_WIDTH / 2),
    width: 0,
    height: 0,
    borderLeftWidth: ARROW_WIDTH / 2,
    borderRightWidth: ARROW_WIDTH / 2,
    borderBottomWidth: ARROW_HEIGHT,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255,255,255,0.8)', // match bubble bg opacity
  },
});
