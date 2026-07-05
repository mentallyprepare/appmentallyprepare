import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';

const features = [
  { icon: '🪞', title: 'A Mirror, Not a Cheerleader', desc: 'No toxic positivity. No empty affirmations. Just precise, uncomfortable accuracy about who you actually are right now.' },
  { icon: '🌙', title: 'The 21-Day Cycle', desc: 'A complete emotional arc. Each day serves a prompt designed to bypass your defenses and surface what\'s real.' },
  { icon: '🔮', title: 'Complementary Matching', desc: 'You\'re paired with someone from a different world — different college, complementary archetype. The friction is the point.' },
  { icon: '📝', title: 'Adaptive Prompts', desc: 'After 2+ entries, the system learns your emotional themes and serves prompts that meet you where you actually are.' },
  { icon: '🌊', title: 'Mood Intelligence', desc: 'Track your emotional landscape over 21 days. See when you rise, when you dip, and what patterns emerge.' },
  { icon: '🛡️', title: 'Safety First', desc: 'Crisis detection with immediate helpline numbers. Your psychological safety is the only non-negotiable.' },
];

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.eye}>Mentally Prepare</Text>
        <Text style={styles.title}>A psychological{'\n'}operating system</Text>
        <Text style={styles.sub}>For social confidence and emotional resilience.</Text>
      </View>

      {features.map((f, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardIcon}>{f.icon}</Text>
          <Text style={styles.cardTitle}>{f.title}</Text>
          <Text style={styles.cardDesc}>{f.desc}</Text>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Built by people who believe emotional honesty is the rarest form of intelligence.</Text>
        <Text style={styles.footerEye}>Mentally Prepare</Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  content: { padding: 24 },
  hero: { alignItems: 'center', paddingVertical: 32 },
  eye: { color: theme.inkS, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  title: { fontFamily: theme.fontSerif, fontSize: 32, color: theme.ink, textAlign: 'center', lineHeight: 38, marginBottom: 12 },
  sub: { color: theme.inkM, fontSize: 14, textAlign: 'center', lineHeight: 22 },
  card: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: 18, padding: 16, marginBottom: 10 },
  cardIcon: { fontSize: 22, marginBottom: 8 },
  cardTitle: { fontFamily: theme.fontSerif, fontSize: 16, fontStyle: 'italic', color: theme.ink, marginBottom: 6 },
  cardDesc: { color: theme.inkM, fontSize: 13, lineHeight: 20, fontFamily: theme.fontSerif, fontStyle: 'italic' },
  footer: { alignItems: 'center', marginTop: 24, borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 24 },
  footerText: { color: theme.inkS, fontSize: 12, textAlign: 'center', lineHeight: 18, fontStyle: 'italic', fontFamily: theme.fontSerif, marginBottom: 12 },
  footerEye: { color: theme.inkS, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' },
});
