import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import i18n from '../i18n';

type TutorialProps = {
  onFinish: () => void;
};

const steps = [
  { title: i18n.t('tutorialScreen.titleWelcome'), description: i18n.t('tutorialScreen.descWelcome'), image: require('../../assets/AppIcon.png') },
  { title: i18n.t('tutorialScreen.titleTrackSleep'), description: i18n.t('tutorialScreen.descTrackSleep'), image: require('../../assets/sleepInfoIcon.png') },
  { title: i18n.t('tutorialScreen.titleViewHistory'), description: i18n.t('tutorialScreen.descViewHistory'), image: require('../../assets/sleepInfoThickIcon.png') },
];

export default function TutorialScreen({ onFinish }: TutorialProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{step.title}</Text>
      <Text style={styles.description}>{step.description}</Text>
      <Image source={step.image} style={styles.image} />
      <View style={styles.buttonRow}>
        {stepIndex > 0 && (
          <Button title={i18n.t('tutorialScreen.back')} onPress={() => setStepIndex(stepIndex - 1)} />
        )}
        {stepIndex < steps.length - 1 ? (
          <Button title={i18n.t('tutorialScreen.next')} onPress={() => setStepIndex(stepIndex + 1)} />
        ) : (
          <Button title={i18n.t('tutorialScreen.finish')} onPress={onFinish} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: { width: 150, height: 150, marginBottom: 16 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
});
