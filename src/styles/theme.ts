export interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  card: string;
  error: string;
  success: string;
  headerBackground: string;
  headerText: string;
  buttonBackground: string;
  buttonText: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

export const lightTheme: Theme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    text: '#333333',
    primary: '#007AFF',
    secondary: '#5AC8FA',
    accent: '#647eff',
    border: '#E0E0E0',
    card: '#F5F5F5',
    error: '#FF3B30',
    success: '#34C759',
    headerBackground: '#FFFFFF',
    headerText: '#333333',
    buttonBackground: '#007AFF',
    buttonText: '#FFFFFF',
  },
};

export const darkTheme: Theme = {
  dark: true,
  colors: {
    background: '#121212',
    text: '#F0F0F0',
    primary: '#0A84FF',
    secondary: '#64D2FF',
    accent: '#7D93FF',
    border: '#2C2C2C',
    card: '#1E1E1E',
    error: '#FF453A',
    success: '#30D158',
    headerBackground: '#1E1E1E',
    headerText: '#F0F0F0',
    buttonBackground: '#0A84FF',
    buttonText: '#FFFFFF',
  },
};

export const getTheme = (isDark: boolean): Theme => {
  return isDark ? darkTheme : lightTheme;
};
