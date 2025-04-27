import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import SleepStore from '../src/stores/SleepStore';
import i18n from '../src/i18n';

const SettingsScreen = observer(() => {
  const router = useRouter();
  const handleReset = () => {
    Alert.alert(
      i18n.t('settingsScreen.confirmReset'),
      '',
      [
        { text: i18n.t('settingsScreen.cancel'), style: 'cancel' },
        {
          text: i18n.t('settingsScreen.confirm'),
          style: 'destructive',
          onPress: async () => {
            await SleepStore.resetApp();
            router.back();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('settingsScreen.title')}</Text>
      <View style={styles.buttonContainer}>
        <Button title={i18n.t('settingsScreen.reset')} onPress={handleReset} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 24 },
  buttonContainer: { marginVertical: 10, width: '80%' },
});

export default SettingsScreen;
