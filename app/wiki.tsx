import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import PillToggle from '../src/components/PillToggle';
import Header from '../src/components/Header';
import I18n from '../src/i18n';
import { Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import wikiContent from '../src/data/wikiContent';
import { useTheme } from '../src/contexts/ThemeContext';
import { getTheme } from '../src/styles/theme';

export default function Wiki() {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState({
    sleepPhases: false,
    cycleDetails: false,
    nappingStrategy: false,
    recommendedCycles: false,
    whyCyclesMatter: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const width = Dimensions.get('window').width - 32;
  const heightBar = 180;
  const heightPie = 160;
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title={I18n.t('sleepCyclesGuide')} />
      <ScrollView contentContainerStyle={styles.content}>
        {wikiContent.map((section) => (
          <React.Fragment key={section.id}>
            <PillToggle
              title={section.title}
              expanded={expandedSections[section.id]}
              onPress={() => toggleSection(section.id)}
            />
            {expandedSections[section.id] && (
              <View style={[styles.expandedContent, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                {section.blocks.map((block, idx) => {
                  switch (block.type) {
                    case 'text':
                      return (
                        <Text key={idx} style={[block.style === 'subSubheading' ? styles.subSubheading : styles.paragraph, { color: theme.colors.text }]}>
                          {block.content}
                        </Text>
                      );
                    case 'list':
                      return block.items.map((item, i) => (
                        <Text key={i} style={[styles.paragraph, { color: theme.colors.text }]}>{item}</Text>
                      ));
                    case 'bar': {
                      const b = block;
                      return (
                        <BarChart
                          key={idx}
                          data={b.data}
                          width={b.width}
                          height={b.height}
                          yAxisLabel={b.yAxisLabel || ''}
                          yAxisSuffix={b.yAxisSuffix || ''}
                          chartConfig={b.chartConfig}
                          style={b.style}
                          fromZero={b.fromZero}
                        />
                      );
                    }
                    case 'pie': {
                      const p = block;
                      return (
                        <PieChart
                          key={idx}
                          data={p.data}
                          width={p.width}
                          height={p.height}
                          chartConfig={p.chartConfig}
                          accessor={p.accessor}
                          backgroundColor={p.backgroundColor}
                          paddingLeft={p.paddingLeft}
                          absolute={p.absolute}
                        />
                      );
                    }
                    default:
                      return null;
                  }
                })}
              </View>
            )}
          </React.Fragment>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  paragraph: { fontSize: 16, marginBottom: 12, lineHeight: 22, color: '#333' },
  subheading: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 8, color: '#222' },
  subSubheading: { fontSize: 16, fontWeight: 'bold', marginTop: 12, marginBottom: 6, color: '#444' },
  toggleSection: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10
  },
  toggleTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#444' 
  },
  expandedContent: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginTop: -5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee'
  }
});
