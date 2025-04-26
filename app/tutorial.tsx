import React from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TutorialScreen from '../src/screens/TutorialScreen';

export default function Tutorial() {
  const router = useRouter();
  const handleFinish = async () => {
    await AsyncStorage.setItem('tutorialComplete', 'true');
    router.push('/home');
  };
  return <TutorialScreen onFinish={handleFinish} />;
}
