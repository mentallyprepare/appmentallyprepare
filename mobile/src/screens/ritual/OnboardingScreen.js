import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { useAuth } from '../../context/AuthContext';

const questions = [
  { cat: 'EMOTIONAL REGULATION', q: 'When something heavy happens, your first instinct is to...', opts: ['Go quiet and process alone', 'Talk it out with someone', 'Distract yourself until it passes', 'Write or create something from it'] },
  { cat: 'ATTACHMENT STYLE', q: 'In close relationships, you tend to...', opts: ['Hold back until you feel safe', 'Dive in deeply and quickly', 'Need space to feel like yourself', 'Alternate between closeness and distance'] },
  { cat: 'SOCIAL ENERGY', q: 'After a long day of people, you feel...', opts: ['Drained and need solitude', 'Energized and want more', 'A mix — tired but fulfilled', 'Indifferent'] },
  { cat: 'COPING STYLE', q: 'When stress builds up, you usually...', opts: ['Withdraw and go inward', 'Push through and stay busy', 'Seek comfort in familiar things', 'Look for someone who understands'] },
  { cat: 'VULNERABILITY', q: 'Sharing something personal feels...', opts: ['Terrifying but necessary', 'Natural when the moment is right', 'Like giving away power', 'Easier in writing than words'] },
  { cat: 'NIGHT MIND', q: 'When the room goes quiet at night, your mind...', opts: ['Replays the day on loop', 'Drifts into imagination', 'Goes blank — a rare peace', 'Gets loud with things unsaid'] },
  { cat: 'SUPPORT STYLE', q: 'The most helpful thing when you are struggling is...', opts: ['Just listen without fixing', 'Offer practical help', 'Share something similar', 'Give me space'] },
  { cat: 'EXPRESSION', q: 'You express your deepest feelings best through...', opts: ['Music that says it for you', 'Writing you may never share', 'Conversations with the right person', 'Actions rather than words'] },
  { cat: 'RESILIENCE', q: 'After a hard week, what brings you back is...', opts: ['A creative project', 'A connection that feels real', 'Time alone with your thoughts', 'Movement and physical activity'] },
  { cat: 'CONNECTION', q: 'You feel most seen when someone...', opts: ['Notices what you do not say', 'Remembers a small detail', 'Sits with you in silence', 'Shares something equally vulnerable'] },
  { cat: 'INNER WORLD', q: 'Your relationship with your thoughts is...', opts: ['A constant companion', 'A quiet background hum', 'Something you are still learning', 'A landscape — dark and vast'] },
];

export default function OnboardingScreen({ navigation }) {
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(new Array(11).fill(-1));

  const select = (idx) => {
    const a = [...answers];
    a[step] = idx;
    setAnswers(a);
  };

  const next = () => {
    if (step < 10) setStep(step + 1);
    else {
      login({ name: 'You', onboardingComplete: true });
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    }
  };

  const prev = () => { if (step > 0) setStep(step - 1); };
  const q = questions[step];
  const selected = answers[step];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <View style={styles.logoMini}>
          <View style={styles.logoDot} />
        </View>
        <Text style={styles.logoText}>mentally prepare</Text>
        <Text style={styles.qNum}>{step + 1} / 11</Text>
      </View>

      <View style={styles.progRow}>
        {questions.map((_, i) => (
          <View key={i} style={[styles.progBar, i <= step && styles.progBarActive]} />
        ))}
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.cat}>{q.cat}</Text>
        <Text style={styles.question}>{q.q}</Text>
        <View style={styles.optsWrap}>
          {q.opts.map((o, i) => (
            <TouchableOpacity
              key={i} activeOpacity={0.7}
              style={[styles.optRow, selected === i && styles.optRowSelected]}
              onPress={() => select(i)}
            >
              <View style={[styles.radio, selected === i && styles.radioSelected]}>
                {selected === i && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.optText, selected === i && styles.optTextSelected]}>{o}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={prev} style={[styles.footerBtn, step === 0 && styles.footerBtnDisabled]}>
          <Text style={[styles.footerBtnText, step === 0 && styles.footerBtnTextDisabled]}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={next}
          style={[styles.primaryBtn, selected === -1 && styles.primaryBtnDisabled]}
          disabled={selected === -1}
        >
          <Text style={styles.primaryBtnText}>{step === 10 ? 'See Your Profile' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  logoMini: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(200,180,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  logoDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.lavender },
  logoText: { flex: 1, fontSize: 13, fontWeight: '500', color: theme.text, letterSpacing: 0.5 },
  qNum: { fontSize: 11, color: theme.lavenderDim },
  progRow: { flexDirection: 'row', gap: 3, marginBottom: 32 },
  progBar: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.06)' },
  progBarActive: { backgroundColor: 'rgba(200,180,255,0.5)' },
  body: { flex: 1 },
  cat: { fontSize: 10, color: theme.lavenderDim, letterSpacing: 2, marginBottom: 10 },
  question: { fontSize: 20, fontFamily: theme.fontSerif, fontStyle: 'italic', color: theme.text, lineHeight: 30, marginBottom: 32 },
  optsWrap: { gap: 10 },
  optRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 16, borderRadius: 14,
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  optRowSelected: { borderColor: 'rgba(200,180,255,0.3)', backgroundColor: 'rgba(123,94,167,0.18)' },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: theme.lavender },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.lavender },
  optText: { flex: 1, fontSize: 14, color: 'rgba(255,255,255,0.55)', fontFamily: theme.fontSerif, lineHeight: 20 },
  optTextSelected: { color: theme.lavender },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, gap: 12 },
  footerBtn: { height: 40, paddingHorizontal: 20, borderRadius: 12, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  footerBtnDisabled: { opacity: 0.4 },
  footerBtnText: { fontSize: 12, fontWeight: '500', color: theme.textFaint },
  footerBtnTextDisabled: { color: 'rgba(255,255,255,0.15)' },
  primaryBtn: { flex: 1, height: 40, borderRadius: 12, backgroundColor: theme.purple, alignItems: 'center', justifyContent: 'center' },
  primaryBtnDisabled: { opacity: 0.4 },
  primaryBtnText: { fontSize: 12, fontWeight: '500', color: '#fff' },
});
