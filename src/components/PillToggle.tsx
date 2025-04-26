import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PillToggle = ({ title, expanded, onPress }: { title: string; expanded: boolean; onPress: () => void; }) => (
  <TouchableOpacity style={[styles.container, expanded && styles.active]} onPress={onPress}>
    <Text style={styles.title}>{title}</Text>
    <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color="#555" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 20,
    marginVertical: 10,
  },
  active: {
    backgroundColor: '#e0e0e0',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
});

export default PillToggle;
