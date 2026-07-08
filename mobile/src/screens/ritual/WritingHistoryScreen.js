import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import Card from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';

const entries = [
  { night: 7, date: 'Jul 7, 2026', preview: 'I felt a strange sense of peace today while walking home. The sun was setting and I...', sealed: true },
  { night: 6, date: 'Jul 6, 2026', preview: 'Work was overwhelming. I need to find a way to slow down and breathe. Maybe to...', sealed: true },
  { night: 5, date: 'Jul 5, 2026', preview: 'Had a dream about flying over the city. It felt so real I could feel the wind...', sealed: true },
  { night: 4, date: 'Jul 4, 2026', preview: 'I called my mom today. We talked for an hour. It reminded me how much I...', sealed: true },
  { night: 3, date: 'Jul 3, 2026', preview: 'Still thinking about what my partner wrote on night 1. It\'s strange how...', sealed: true },
  { night: 2, date: 'Jul 2, 2026', preview: 'Today I tried something new. I went to a pottery class. I was terrible at...', sealed: false },
  { night: 1, date: 'Jul 1, 2026', preview: 'This is my first night. I don\'t know what to write but I\'m excited to...', sealed: false },
];

export default function WritingHistoryScreen({ navigation }) {
  return (
    <AnimatedScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Your writing</Text>

        {entries.map((entry, i) => (
          <Card key={entry.night} padding={theme.spacing.md} style={[styles.entryCard, i >= 5 && styles.entryDimmed]}>
            <View style={styles.entryHeader}>
              <View style={styles.entryMeta}>
                <Text style={styles.entryNight}>Night {entry.night}</Text>
                <Text style={styles.entryDate}>{entry.date}</Text>
              </View>
              <Ionicons
                name={entry.sealed ? 'lock-closed' : 'create-outline'}
                size={18}
                color={entry.sealed ? theme.gold : theme.inkS}
              />
            </View>
            <Text style={styles.entryPreview} numberOfLines={2}>
              {entry.preview}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg },
  scroll: { paddingTop: theme.spacing.xl, paddingBottom: theme.spacing['2xl'] },
  heading: { fontFamily: theme.fontSerif, fontSize: 28, color: theme.ink, marginBottom: theme.spacing.lg },
  entryCard: { marginBottom: theme.spacing.sm },
  entryDimmed: { opacity: 0.55 },
  entryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.sm },
  entryMeta: { flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.sm },
  entryNight: { fontFamily: theme.fontSerif, fontSize: 16, color: theme.ink },
  entryDate: { fontFamily: theme.fontSans, fontSize: 12, color: theme.inkS },
  entryPreview: { fontFamily: theme.fontSans, fontSize: 13, color: theme.inkM, lineHeight: 18 },
});
