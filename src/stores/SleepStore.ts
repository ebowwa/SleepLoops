import { makeAutoObservable, runInAction } from 'mobx';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

type SleepSession = {
  id: number;
  start: number;
  end: number | null;
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
      await this.db.execAsync(
        `CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, start INTEGER, end INTEGER);`
      );
      this.loadSessions();
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }

  async loadSessions() {
    try {
      const result = await this.db.getAllAsync<SleepSession>(`SELECT * FROM sessions;`);
      runInAction(() => {
        this.sessions = result;
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
}

export default new SleepStore();