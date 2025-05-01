import React, { useState } from 'react';
import HomeScreen from '../src/screens/HomeScreen';
import SleepAtScreen from '../src/screens/SleepAtScreen';
import Schedule from '../src/components/Schedule';
import HistoryScreen from '../src/screens/HistoryScreen';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, Image, TouchableWithoutFeedback, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../src/i18n';

export default function Track() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'choose' | 'wake' | 'sleep' | 'weekly'>('choose');
  const handleAdd = () => { setModalType('choose'); setModalVisible(true); };
  const handleWeekly = () => { setModalType('weekly'); setModalVisible(true); };
  const openWake = () => setModalType('wake');
  const openSleep = () => setModalType('sleep');

  return (
    <View style={styles.container}>
      {/* Plus button to open question modal */}
      <TouchableOpacity onPress={handleAdd} style={styles.plusIcon}>
        <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
      </TouchableOpacity>
      {/* Weekly calendar button to open schedule modal */}
      <TouchableOpacity onPress={handleWeekly} style={styles.weekIcon}>
        <Ionicons name="calendar-outline" size={28} color="#007AFF" />
      </TouchableOpacity>
      {/* Settings link */}
      <Link href="/settings" asChild>
        <TouchableOpacity style={styles.settingsIcon}>
          <Ionicons name="settings-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </Link>
      {/* Info link to Wiki */}
      <Link href="/wiki" asChild>
        <TouchableOpacity style={styles.infoIcon}>
          <Image source={require('../assets/sleepInfoThickIcon.png')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      </Link>
      {/* History & Upcoming Notifications */}
      <HistoryScreen />
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <SafeAreaView style={[styles.modalWrapper, modalType === 'weekly' && styles.weeklyWrapper]}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
              <Ionicons name="close-circle" size={28} color="#333" />
            </TouchableOpacity>
            {modalType === 'choose' && (
              <View style={styles.choiceContainer}>
                <TouchableOpacity style={styles.choiceButton} onPress={openWake}>
                  <Text style={styles.choiceButtonText}>{i18n.t('whatTimeWakeUp')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.choiceButton} onPress={openSleep}>
                  <Text style={styles.choiceButtonText}>{i18n.t('whatTimeSleep')}</Text>
                </TouchableOpacity>
              </View>
            )}
            {modalType === 'wake' && <HomeScreen />}
            {modalType === 'sleep' && <SleepAtScreen />}
            {modalType === 'weekly' && <Schedule />}
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  infoIcon: { alignSelf: 'flex-end', marginTop: 60, marginRight: 16 },
  plusIcon: { position: 'absolute', top: 60, right: 56, zIndex: 10 },
  weekIcon: { position: 'absolute', top: 60, right: 96, zIndex: 10 },
  settingsIcon: { position: 'absolute', top: 60, right: 136, zIndex: 10 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalWrapper: { backgroundColor: '#fff', borderRadius: 8, padding: 16, width: '85%', maxHeight: '80%', alignSelf: 'center' },
  weeklyWrapper: { flex: 1, marginHorizontal: '5%', marginVertical: '10%' },
  modalClose: { alignSelf: 'flex-end', marginBottom: 12 },
  choiceContainer: { alignItems: 'center' },
  choiceButton: { backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, marginVertical: 8, width: '80%' },
  choiceButtonText: { fontSize: 16, textAlign: 'center' }
});