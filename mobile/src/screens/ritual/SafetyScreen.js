import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';

const rules = [
  { title: 'Anonymous matching', desc: 'You\'ll be paired with a stranger. No names, no photos, no profiles — just words.' },
  { title: 'Never share personal info', desc: 'This space works because it\'s anonymous. Keep it that way.' },
  { title: 'Report system', desc: 'If something feels off, you can report anonymously. We take it seriously.' },
  { title: '21-day cycle', desc: 'After 21 nights, the exchange ends. You can start again with someone new.' },
];

export default function SafetyScreen({ navigation }) {
  return (
    <AnimatedScreen style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.heading}>Before we begin</Text>
        <Text style={styles.subheading}>
          A few things to know — so this stays safe for everyone.
        </Text>
        <Card variant="default" padding={theme.spacing.md} style={styles.card}>
          {rules.map((r, i) => (
            <View key={r.title} style={[styles.ruleRow, i < rules.length - 1 && styles.ruleRowBordered]}>
              <Text style={styles.ruleTitle}>{r.title}</Text>
              <Text style={styles.ruleDesc}>{r.desc}</Text>
            </View>
          ))}
        </Card>
      </View>
      <View style={styles.footer}>
        <AppButton
          title="I understand"
          onPress={() => navigation.navigate('NotifPerm')}
        />
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg, justifyContent: 'space-between' },
  body: { flex: 1, justifyContent: 'center', paddingTop: theme.spacing.xl },
  heading: { fontFamily: theme.fontSerif, fontSize: 28, color: theme.ink, marginBottom: theme.spacing.sm },
  subheading: { color: theme.inkM, fontSize: 14, marginBottom: theme.spacing.lg, fontFamily: theme.fontSans, lineHeight: 20 },
  card: { gap: 0 },
  ruleRow: { paddingVertical: theme.spacing.md },
  ruleRowBordered: { borderBottomWidth: 1, borderBottomColor: theme.line },
  ruleTitle: { fontFamily: theme.fontSerif, fontSize: 16, color: theme.ink, marginBottom: 4 },
  ruleDesc: { color: theme.inkM, fontSize: 13, lineHeight: 19, fontFamily: theme.fontSans },
  footer: { paddingBottom: theme.spacing.xl },
});
