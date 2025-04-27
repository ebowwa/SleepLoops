import React from 'react';
import { Platform } from 'react-native';
import { Stack, useSegments } from 'expo-router';
import SurveyAlert from '../src/components/SurveyAlert';

export default function Layout() {
  const segments = useSegments();
  const route = segments[segments.length - 1] ?? '';
  // Show SurveyAlert only on routes other than 'splash' or 'tutorial'
  const showSurvey = !['splash', 'tutorial'].includes(route);
  return (
    <>
      {showSurvey && <SurveyAlert />}
      <Stack initialRouteName="splash" screenOptions={{ headerShown: false }} />
    </>
  );
}