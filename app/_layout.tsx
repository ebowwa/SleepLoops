import React from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import SurveyAlert from '../src/components/SurveyAlert';

export default function Layout() {
  return (
    <>
      <SurveyAlert />
      <Stack initialRouteName="splash" screenOptions={{ headerShown: false }} />
    </>
  );
}