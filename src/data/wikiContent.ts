import I18n from '../i18n';
import { Section } from '../models/content';
import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width - 32;
const phasesSections = I18n.t('sleepPhasesExplained.sections') as any[];

const wikiContent: Section[] = [
  {
    id: 'recommendedCycles',
    title: I18n.t('recommendedSleepCycles.title'),
    blocks: [
      { type: 'list', items: I18n.t('recommendedSleepCycles.items') as string[] },
    ],
  },
  {
    id: 'whyCyclesMatter',
    title: I18n.t('whySleepCyclesMatter.title'),
    blocks: [
      { type: 'list', items: I18n.t('whySleepCyclesMatter.items') as string[] },
    ],
  },
  {
    id: 'sleepPhases',
    title: I18n.t('sleepPhasesExplained.title'),
    blocks: [
      { type: 'text', content: phasesSections[0].subtitle, style: 'subSubheading' },
      { type: 'list', items: phasesSections[0].items as string[] },
      { type: 'text', content: phasesSections[1].subtitle, style: 'subSubheading' },
      { type: 'list', items: phasesSections[1].items as string[] },
      { type: 'bar', data: { labels: ['0-20', '20-70', '70-90'], datasets: [{ data: [20, 50, 20] }] }, width, height: 180, yAxisLabel: '', yAxisSuffix: '', chartConfig: { backgroundColor: '#ffffff', backgroundGradientFrom: '#ffffff', backgroundGradientTo: '#ffffff', decimalPlaces: 0, color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }, style: { marginVertical: 8, borderRadius: 8 }, fromZero: true },
    ],
  },
  {
    id: 'cycleDetails',
    title: I18n.t('ninetyMinuteCycleBreakdown.title'),
    blocks: [
      { type: 'list', items: I18n.t('ninetyMinuteCycleBreakdown.items') as string[] },
      { type: 'pie', data: [ { name: 'Light Sleep', population: 20, color: '#74b9ff', legendFontColor: '#333', legendFontSize: 12 }, { name: 'Deep Sleep', population: 50, color: '#0984e3', legendFontColor: '#333', legendFontSize: 12 }, { name: 'REM Sleep', population: 20, color: '#00cec9', legendFontColor: '#333', legendFontSize: 12 } ], width, height: 160, chartConfig: { backgroundColor: '#ffffff', backgroundGradientFrom: '#ffffff', backgroundGradientTo: '#ffffff', color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})` }, accessor: 'population', backgroundColor: 'transparent', paddingLeft: '15', absolute: true },
    ],
  },
  {
    id: 'nappingStrategy',
    title: I18n.t('nappingStrategy.title'),
    blocks: [
      { type: 'list', items: I18n.t('nappingStrategy.items') as string[] },
    ],
  },
];

export default wikiContent;
