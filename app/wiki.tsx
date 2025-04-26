import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import PillToggle from '../src/components/PillToggle';
import I18n from '../src/i18n';
import { Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import wikiContent from '../src/data/wikiContent';

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{I18n.t('sleepCyclesGuide')}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {wikiContent.map((section) => (
          <React.Fragment key={section.id}>
            <PillToggle
              title={section.title}
              expanded={expandedSections[section.id]}
              onPress={() => toggleSection(section.id)}
            />
            {expandedSections[section.id] && (
              <View style={styles.expandedContent}>
                {section.blocks.map((block, idx) => {
                  switch (block.type) {
                    case 'text':
                      return (
                        <Text key={idx} style={block.style === 'subSubheading' ? styles.subSubheading : styles.paragraph}>
                          {block.content}
                        </Text>
                      );
                    case 'list':
                      return block.items.map((item, i) => (
                        <Text key={i} style={styles.paragraph}>{item}</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#ddd' },
  title: { fontSize: 18, fontWeight: 'bold', marginLeft: 12 },
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
