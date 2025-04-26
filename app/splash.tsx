import React from 'react';
import { useRouter } from 'expo-router';
import SplashScreen from '../src/screens/SplashScreen';

export default function Splash() {
  const router = useRouter();
  return <SplashScreen onContinue={() => router.push('/tutorial')} />;
}
