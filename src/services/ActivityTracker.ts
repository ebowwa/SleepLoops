import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable, runInAction } from 'mobx';
import * as Notifications from 'expo-notifications';
import DeviceSignals from './DeviceSignals';

class ActivityTracker {
  lastActiveTime: Date | null = null;
  appState: AppStateStatus = AppState.currentState;
  isTracking = false;
  
  // Configurable thresholds
  SLEEP_THRESHOLD_MINUTES = 30; // No activity for 30min = likely asleep
  NIGHT_HOURS_START = 22; // 10 PM
  MORNING_HOURS_END = 10; // 10 AM
  
  constructor() {
    makeAutoObservable(this);
    this.init();
  }
  
  async init() {
    // Load tracking preference
    const enabled = await AsyncStorage.getItem('activityTrackingEnabled');
    this.isTracking = enabled !== 'false'; // Default to true
    
    // Load last active time
    const saved = await AsyncStorage.getItem('lastActiveTime');
    if (saved) {
      this.lastActiveTime = new Date(saved);
    }
    
    // Load custom threshold if set
    const threshold = await AsyncStorage.getItem('sleepThreshold');
    if (threshold) {
      this.SLEEP_THRESHOLD_MINUTES = parseInt(threshold);
    }
    
    // Start listening to app state changes
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  
  handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (!this.isTracking) return;
    
    const wasInactive = this.appState.match(/inactive|background/);
    const isActive = nextAppState === 'active';
    
    if (wasInactive && isActive) {
      // App became active - check for sleep gap
      this.checkForSleepGap();
    } else if (!wasInactive && !isActive) {
      // App going to background - record time
      this.recordLastActive();
    }
    
    runInAction(() => {
      this.appState = nextAppState;
    });
  };
  
  async recordLastActive() {
    const now = new Date();
    await AsyncStorage.setItem('lastActiveTime', now.toISOString());
    runInAction(() => {
      this.lastActiveTime = now;
    });
  }
  
  async checkForSleepGap() {
    if (!this.lastActiveTime) return;
    
    const now = new Date();
    const gap = now.getTime() - this.lastActiveTime.getTime();
    const gapMinutes = gap / (1000 * 60);
    
    // Check if gap suggests sleep
    if (gapMinutes > this.SLEEP_THRESHOLD_MINUTES) {
      const lastHour = this.lastActiveTime.getHours();
      const currentHour = now.getHours();
      
      // Get device signals for enhanced detection
      const sleepLikelihood = await DeviceSignals.getSleepLikelihood();
      const signals = await DeviceSignals.getSignalsSummary();
      
      console.log('Sleep detection signals:', signals);
      
      // Enhanced heuristic with device signals
      const baseCondition = lastHour >= this.NIGHT_HOURS_START || lastHour < 4 || 
                           currentHour < this.MORNING_HOURS_END;
      
      // Lower threshold if high sleep likelihood
      const adjustedThreshold = this.SLEEP_THRESHOLD_MINUTES * (1 - sleepLikelihood * 0.3);
      
      if (baseCondition && gapMinutes > adjustedThreshold) {
        // Detected probable sleep session with enhanced confidence
        await this.createSleepSession(this.lastActiveTime, now);
      } else if (sleepLikelihood > 0.7 && gapMinutes > adjustedThreshold) {
        // High sleep likelihood even outside normal hours
        await this.createSleepSession(this.lastActiveTime, now);
      }
    }
    
    // Update last active time
    this.recordLastActive();
  }
  
  async createSleepSession(sleepTime: Date, wakeTime: Date) {
    // Import SleepStore to avoid circular dependency
    const SleepStore = require('../stores/SleepStore').default;
    
    // Check if a session already exists for this time period
    const existingSession = SleepStore.sessions.find((session: any) => {
      return Math.abs(session.start - sleepTime.getTime()) < 3600000; // Within 1 hour
    });
    
    if (existingSession) {
      console.log('Sleep session already exists for this time period');
      return;
    }
    
    // Create session with detected times
    await SleepStore.createAutoDetectedSession(
      sleepTime.getTime(),
      wakeTime.getTime()
    );
  }
  
  // Method to disable tracking
  async setTracking(enabled: boolean) {
    this.isTracking = enabled;
    await AsyncStorage.setItem('activityTrackingEnabled', enabled.toString());
  }
  
  // Method to update threshold
  async setThreshold(minutes: number) {
    this.SLEEP_THRESHOLD_MINUTES = minutes;
    await AsyncStorage.setItem('sleepThreshold', minutes.toString());
  }
}

export default new ActivityTracker();