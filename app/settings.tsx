import React from 'react';
import { View, Text, Alert, StyleSheet, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { Ionicons } from '@expo/vector-icons';
import SleepStore from '../src/stores/SleepStore';
import i18n from '../src/i18n';
import Header from '../src/components/Header';
import { useTheme } from '../src/contexts/ThemeContext';
import { getTheme } from '../src/styles/theme';

const SettingsScreen = observer(() => {
  const router = useRouter();
  const { isDark, mode, setMode } = useTheme();
  const theme = getTheme(isDark);
  
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
  
  const toggleDarkMode = (value: boolean) => {
    setMode(value ? 'dark' : 'light');
  };
  
  const toggleSystemTheme = (value: boolean) => {
    if (value) {
      setMode('system');
    } else {
      setMode(isDark ? 'dark' : 'light');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <Header title={i18n.t('settingsScreen.title')} />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{i18n.t('settingsScreen.appearance')}</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="moon-outline" size={22} color={theme.colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{i18n.t('settingsScreen.darkMode')}</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleDarkMode}
              disabled={mode === 'system'}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor="#f4f3f4"
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="phone-portrait-outline" size={22} color={theme.colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{i18n.t('settingsScreen.useSystemTheme')}</Text>
            </View>
            <Switch
              value={mode === 'system'}
              onValueChange={toggleSystemTheme}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor="#f4f3f4"
            />
          </View>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{i18n.t('settingsScreen.data')}</Text>
          
          <TouchableOpacity 
            style={[styles.dangerButton, { backgroundColor: theme.colors.error }]}
            onPress={handleReset}
          >
            <Ionicons name="trash-outline" size={22} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.dangerButtonText}>{i18n.t('settingsScreen.reset')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 },
  settingsSection: { marginBottom: 24, width: '100%' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, marginLeft: 8 },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;
