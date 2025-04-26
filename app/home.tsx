import React, { useState } from 'react';
import HomeScreen from '../src/screens/HomeScreen';
import SleepAtScreen from '../src/screens/SleepAtScreen';
import Schedule from '../src/components/Schedule';
import HistoryScreen from '../src/screens/HistoryScreen';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, Image, TouchableWithoutFeedback } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../src/i18n';

export default function Track() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'choose' | 'wake' | 'sleep' | 'weekly'>('choose');
  const [modalSize, setModalSize] = useState<{ width: number; height: number } | null>(null);
  const handleAdd = () => { setModalType('choose'); setModalVisible(true); };
  const handleWeekly = () => { setModalType('weekly'); setModalVisible(true); };

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
      {/* Info link to Wiki */}
      <Link href="/wiki" asChild>
        <TouchableOpacity style={styles.infoIcon}>
          <Image source={require('../assets/sleepInfoThickIcon.png')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      </Link>
      {/* History & Upcoming Notifications */}
      <HistoryScreen />
      {/* Modal showing current question and details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <SafeAreaView style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View
                style={styles.modalContent}
                onLayout={e => {
                  const { width, height } = e.nativeEvent.layout;
                  if (!modalSize) {
                    setModalSize({ width, height });
                    console.log(`Modal content size: ${width}x${height}`);
                  }
                }}
              >
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalClose}
                >
                  <Ionicons name="close-circle" size={28} color="#333" />
                </TouchableOpacity>
                {/* Mode selection and content */}
                {modalType === 'choose' && (
                  <View style={styles.choiceContainer}>
                    <TouchableOpacity onPress={() => setModalType('wake')} style={styles.choiceButton}>
                      <Text style={styles.choiceButtonText}>{i18n.t('whatTimeWakeUp')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalType('sleep')} style={styles.choiceButton}>
                      <Text style={styles.choiceButtonText}>{i18n.t('whatTimeSleep')}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {modalType === 'wake' && <HomeScreen />}
                {modalType === 'sleep' && <SleepAtScreen />}
                {modalType === 'weekly' && <Schedule />}
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  infoIcon: { alignSelf: 'flex-end', marginTop: 60, marginRight: 16 },
  plusIcon: { position: 'absolute', top: 60, right: 56, zIndex: 10 },
  weekIcon: { position: 'absolute', top: 60, right: 96, zIndex: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { alignSelf: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 16, maxWidth: '90%', maxHeight: '67%' },
  modalClose: { alignSelf: 'flex-end' },
  choiceContainer: { alignItems: 'center', marginTop: 16 },
  choiceButton: { backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, marginVertical: 8, width: '80%' },
  choiceButtonText: { fontSize: 16, textAlign: 'center' },
});