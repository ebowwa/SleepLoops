import { makeAutoObservable, runInAction } from 'mobx';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

type SleepSession = {
  id: number;
  start: number;
  end: number | null;
  autoDetected?: boolean;
};

class SleepStore {
  sessions: SleepSession[] = [];
  // incremented on reset to notify UI
  resetTrigger = 0;
  db: SQLite.SQLiteDatabase;

  constructor() {
    makeAutoObservable(this);
    this.db = SQLite.openDatabaseSync('sleep.db');
    this.init();
  }

  async init() {
    try {
      // Check if table exists and needs migration
      const tableInfo = await this.db.getAllAsync(
        `PRAGMA table_info(sessions);`
      );
      
      if (tableInfo.length > 0) {
        // Table exists, check if we need to add auto_detected column
        const hasAutoDetected = tableInfo.some((col: any) => col.name === 'auto_detected');
        
        if (!hasAutoDetected) {
          // Migrate existing table
          await this.db.execAsync(
            `ALTER TABLE sessions ADD COLUMN auto_detected INTEGER DEFAULT 0;`
          );
        }
      } else {
        // Create table with new schema
        await this.db.execAsync(
          `CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            start INTEGER NOT NULL, 
            end INTEGER,
            auto_detected INTEGER DEFAULT 0
          );`
        );
      }
      
      this.loadSessions();
    } catch (error) {
      // Fallback: create table if any error occurs
      console.error('Database initialization error:', error);
      try {
        await this.db.execAsync(
          `CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            start INTEGER NOT NULL, 
            end INTEGER,
            auto_detected INTEGER DEFAULT 0
          );`
        );
        this.loadSessions();
      } catch (fallbackError) {
        console.error('Database fallback creation error:', fallbackError);
      }
    }
  }

  async loadSessions() {
    try {
      const result = await this.db.getAllAsync(`SELECT * FROM sessions;`);
      runInAction(() => {
        this.sessions = result.map((row: any) => ({
          id: row.id,
          start: row.start,
          end: row.end,
          autoDetected: row.auto_detected === 1
        }));
      });
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  }

  async startSession() {
    const now = Date.now();
    try {
      const result = await this.db.runAsync(
        `INSERT INTO sessions (start, end) VALUES (?, null);`,
        [now]
      );
      runInAction(() => {
        this.sessions.push({
          id: result.lastInsertRowId as number,
          start: now,
          end: null
        });
      });
    } catch (error) {
      console.error('Error starting session:', error);
    }
  }

  async endSession() {
    const activeSession = this.sessions.find(s => s.end === null);
    if (!activeSession) return;
    const now = Date.now();
    try {
      await this.db.runAsync(
        `UPDATE sessions SET end = ? WHERE id = ?;`,
        [now, activeSession.id]
      );
      runInAction(() => {
        activeSession.end = now;
      });
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }

  /**
   * Reset the app: cancel notifications, clear storage, reset database.
   */
  async resetApp() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error cancelling notifications:', error);
    }
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
    try {
      await this.db.execAsync('DROP TABLE IF EXISTS sessions;');
      runInAction(() => { this.sessions = []; });
      await this.init();
      // notify observers that reset occurred
      runInAction(() => { this.resetTrigger++; });
    } catch (error) {
      console.error('Error resetting database:', error);
    }
  }

  // Recommended wake times based on 90-min cycles; accepts custom cycle counts
  getRecommendedWakeTimes(cycleCounts: number[] = [4, 5, 6]): number[] {
    const cycleDuration = 90 * 60 * 1000;
    return cycleCounts.map(n => Date.now() + n * cycleDuration);
  }

  // Delete a sleep session
  async deleteSession(id: number) {
    try {
      await this.db.runAsync(
        `DELETE FROM sessions WHERE id = ?;`,
        [id]
      );
      runInAction(() => {
        this.sessions = this.sessions.filter(s => s.id !== id);
      });
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  }

  // Create auto-detected sleep session
  async createAutoDetectedSession(start: number, end: number) {
    try {
      const result = await this.db.runAsync(
        `INSERT INTO sessions (start, end, auto_detected) VALUES (?, ?, 1);`,
        [start, end]
      );
      runInAction(() => {
        this.sessions.push({
          id: result.lastInsertRowId as number,
          start,
          end,
          autoDetected: true
        });
      });
      
      // Notify user of auto-detected sleep
      await this.notifyAutoDetection(start, end);
    } catch (error) {
      console.error('Error creating auto-detected session:', error);
    }
  }

  async notifyAutoDetection(start: number, end: number) {
    const duration = (end - start) / (1000 * 60 * 60);
    const sleepTime = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const wakeTime = new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hours = Math.floor(duration);
    const minutes = Math.floor((duration % 1) * 60);
    
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Sleep Detected! 😴',
          body: `You slept from ${sleepTime} to ${wakeTime} (${hours}h ${minutes}m)`,
          data: { 
            type: 'sleep_detected',
            sessionStart: start,
            sessionEnd: end 
          },
        },
        trigger: null, // immediate
      });
    } catch (error) {
      console.error('Error sending auto-detection notification:', error);
    }
  }
}

export default new SleepStore();