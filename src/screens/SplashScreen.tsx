import React, { useEffect, useRef } from 'react';
import { Dimensions, Image, Animated, Easing, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from '../i18n';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LOGO_SIZE = SCREEN_WIDTH * (SCREEN_WIDTH < 360 ? 0.32 : 0.4);

type SplashProps = {
  onContinue: () => void;
};

export default function SplashScreen({ onContinue }: SplashProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, delay: 500, duration: 500, easing: Easing.in(Easing.ease), useNativeDriver: true }),
    ]).start();
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1200, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);

  const spinInterpolate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <SafeAreaView style={styles.container} accessibilityLabel={i18n.t('splashScreen.loadingLabel')}>
      <LinearGradient colors={['#0A1F44', '#2D2FE6']} style={StyleSheet.absoluteFill} />
      <Animated.View style={[styles.logoContainer, { opacity, transform: [{ scale }] }]}>        
        <Image source={require('../../assets/transparentIcon.png')} style={{ width: LOGO_SIZE, height: LOGO_SIZE }} />
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spinInterpolate }] }]} />
      </Animated.View>
      <Animated.Text style={[styles.tagline, { transform: [{ translateY }] }]}>{i18n.t('splashScreen.tagline')}</Animated.Text>
      <TouchableOpacity onPress={onContinue} style={styles.skipButton}>
        <Text style={styles.skipText}>{i18n.t('splashScreen.getStarted')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { justifyContent: 'center', alignItems: 'center' },
  spinner: { position: 'absolute', width: LOGO_SIZE + 16, height: LOGO_SIZE + 16, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderRadius: (LOGO_SIZE + 16) / 2 },
  tagline: { marginTop: 16, fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  skipButton: { position: 'absolute', bottom: 40 },
  skipText: { color: '#FFFFFF', fontSize: 16 },
});
