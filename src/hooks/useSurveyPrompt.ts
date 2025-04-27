import { useEffect } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

const SURVEY_LOG_KEY = 'surveyLog';
const SURVEY_URL = 'https://forms.gle/YtuDnNBvxf449BQu6';
const THROTTLE_MS = 1000 * 60 * 60 * 24; // 1 day

type SurveyResp = 'noThanks' | 'sure';

async function logSurveyResponse(resp: SurveyResp) {
  try {
    const json = await AsyncStorage.getItem(SURVEY_LOG_KEY);
    const list: Array<{ resp: SurveyResp; at: number }> = json ? JSON.parse(json) : [];
    list.push({ resp, at: Date.now() });
    await AsyncStorage.setItem(SURVEY_LOG_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to log survey response', e);
  }
}

async function shouldPrompt(): Promise<boolean> {
  try {
    const json = await AsyncStorage.getItem(SURVEY_LOG_KEY);
    const list: Array<{ resp: SurveyResp; at: number }> = json ? JSON.parse(json) : [];
    if (list.length === 0) return true;
    const last = list[list.length - 1];
    if (last.resp === 'sure') return false;
    return Date.now() - last.at > THROTTLE_MS;
  } catch (e) {
    console.warn('Failed to check survey prompt state', e);
    return false;
  }
}

export default function useSurveyPrompt() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    (async () => {
      if (Platform.OS !== 'ios') return;
      if (!(await shouldPrompt())) return;
      timer = setTimeout(() => {
        Alert.alert(
          i18n.t('surveyAlert.title'),
          i18n.t('surveyAlert.message'),
          [
            {
              text: i18n.t('surveyAlert.noThanks'),
              style: 'cancel',
              onPress: () => {
                logSurveyResponse('noThanks');
              },
            },
            {
              text: i18n.t('surveyAlert.sure'),
              onPress: () => {
                logSurveyResponse('sure');
                Linking.openURL(SURVEY_URL);
              },
            },
          ],
          { cancelable: true }
        );
      }, 2 * 60 * 1000);
    })();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);
}
