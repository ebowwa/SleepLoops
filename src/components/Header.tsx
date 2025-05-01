import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { getTheme } from '../styles/theme';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onBackPress, 
  rightComponent 
}) => {
  const router = useRouter();
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.headerBackground, borderBottomColor: theme.colors.border }]}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: theme.colors.headerText }]}>{title}</Text>
      <View style={styles.headerRight}>
        {rightComponent || <View style={{ width: 40 }} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    textAlign: 'center',
    flex: 1,
  },
  backButton: { 
    padding: 8,
    width: 40,
  },
  headerRight: { 
    width: 40,
  },
});

export default Header;
