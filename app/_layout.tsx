import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { Stack, useSegments } from 'expo-router';
import SurveyAlert from '../src/components/SurveyAlert';
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext';
import { getTheme } from '../src/styles/theme';
import ActivityTracker from '../src/services/ActivityTracker';

function AppLayout() {
  const segments = useSegments();
  const route = segments[segments.length - 1] ?? '';
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  
  // Show SurveyAlert only on routes other than 'splash' or 'tutorial'
  const showSurvey = !['splash', 'tutorial'].includes(route);
  
  // Update status bar based on theme
  React.useEffect(() => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(theme.colors.headerBackground);
    }
  }, [isDark, theme]);
  
  // Initialize activity tracking after tutorial
  React.useEffect(() => {
    if (showSurvey) {
      // Force initialization by accessing the singleton
      ActivityTracker.isTracking;
    }
  }, [showSurvey]);
  
  return (
    <>
      {showSurvey && <SurveyAlert />}
      <Stack 
        initialRouteName="splash" 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background }
        }} 
      />
    </>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}