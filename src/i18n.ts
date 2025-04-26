// @ts-nocheck
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './locales/en.json';

// initialize translations
const i18n = new I18n({ en });
i18n.fallbacks = true;
i18n.defaultLocale = 'en';
i18n.locale = Localization.locale.startsWith('en') ? 'en' : Localization.locale;

// recursively unwrap indexed translation objects and arrays
function unwrapIndexed(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => unwrapIndexed(item));
  }
  if (obj && typeof obj === 'object') {
    // leaf indexed object
    if ('index' in obj && 'value' in obj) {
      return unwrapIndexed(obj.value);
    }
    const res: any = {};
    for (const key in obj) {
      res[key] = unwrapIndexed(obj[key]);
    }
    return res;
  }
  return obj;
}

const originalT = i18n.t.bind(i18n);
i18n.t = (key: string, config?: any) => {
  const entry: any = originalT(key);
  const unwrapped = unwrapIndexed(entry);
  if (typeof unwrapped === 'string' && config) {
    let result = unwrapped;
    for (const varKey in config) {
      const re = new RegExp(`%{${varKey}}`, 'g');
      result = result.replace(re, String(config[varKey]));
    }
    return result;
  }
  return unwrapped;
};

export default i18n;
