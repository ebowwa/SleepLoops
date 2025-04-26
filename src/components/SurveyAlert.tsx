// components/SurveyAlert.tsx
import React, { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import i18n from '../i18n';

export default function SurveyAlert() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (Platform.OS === 'ios') {
      timer = setTimeout(() => {
        Alert.alert(
          i18n.t('surveyAlert.title'),
          i18n.t('surveyAlert.message'),
          [
            { text: i18n.t('surveyAlert.noThanks'), style: 'cancel' },
            { text: i18n.t('surveyAlert.sure'), onPress: () => {} },
          ],
          { cancelable: true }
        );
      }, 2 * 60 * 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return null;
}