import * as Battery from 'expo-battery';
import * as Brightness from 'expo-brightness';

export class DeviceSignals {
  async getChargingState(): Promise<boolean> {
    try {
      const batteryState = await Battery.getBatteryStateAsync();
      return batteryState === Battery.BatteryState.CHARGING || 
             batteryState === Battery.BatteryState.FULL;
    } catch (error) {
      console.log('Battery state unavailable:', error);
      return false;
    }
  }
  
  async getScreenBrightness(): Promise<number> {
    try {
      return await Brightness.getBrightnessAsync();
    } catch (error) {
      console.log('Brightness unavailable:', error);
      return 1.0; // Default to full brightness if unavailable
    }
  }
  
  async getBatteryLevel(): Promise<number> {
    try {
      return await Battery.getBatteryLevelAsync();
    } catch (error) {
      console.log('Battery level unavailable:', error);
      return 1.0;
    }
  }
  
  // Combine signals for better sleep detection
  async getSleepLikelihood(): Promise<number> {
    let score = 0;
    
    // Check if charging (likely bedside)
    const isCharging = await this.getChargingState();
    if (isCharging) score += 0.3;
    
    // Check brightness (low = preparing for sleep)
    const brightness = await this.getScreenBrightness();
    if (brightness < 0.3) score += 0.2;
    else if (brightness < 0.5) score += 0.1;
    
    // Check battery level (low battery might affect usage patterns)
    const batteryLevel = await this.getBatteryLevel();
    if (batteryLevel > 0.2) score += 0.1; // Normal battery, normal usage
    
    // Time-based scoring
    const hour = new Date().getHours();
    if (hour >= 23 || hour < 5) {
      score += 0.4; // Late night hours
    } else if (hour >= 21 || hour < 7) {
      score += 0.2; // Evening/early morning
    }
    
    return Math.min(score, 1.0);
  }
  
  // Get a summary of all signals for logging
  async getSignalsSummary(): Promise<{
    isCharging: boolean;
    brightness: number;
    batteryLevel: number;
    hour: number;
    sleepLikelihood: number;
  }> {
    const [isCharging, brightness, batteryLevel, sleepLikelihood] = await Promise.all([
      this.getChargingState(),
      this.getScreenBrightness(),
      this.getBatteryLevel(),
      this.getSleepLikelihood()
    ]);
    
    return {
      isCharging,
      brightness,
      batteryLevel,
      hour: new Date().getHours(),
      sleepLikelihood
    };
  }
}

export default new DeviceSignals();