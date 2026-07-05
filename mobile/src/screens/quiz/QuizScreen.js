import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../theme';

const questions = [
  { text: 'I find it easy to share what I\'m really feeling with others.', category: 'Emotional Disclosure', axis: 'openness', reverse: false },
  { text: 'Being emotionally vulnerable with someone feels safe to me.', category: 'Vulnerability Comfort', axis: 'openness', reverse: false },
  { text: 'When I\'m struggling, I reach out to the people around me.', category: 'Support Seeking', axis: 'openness', reverse: false },
  { text: 'I can usually identify exactly what I\'m feeling.', category: 'Emotional Awareness', axis: 'awareness', reverse: false },
  { text: 'I often wish I had someone I could be completely honest with.', category: 'Connection Need', axis: 'awareness', reverse: true },
  { text: 'I sometimes feel alone even when I\'m surrounded by people.', category: 'Loneliness Recognition', axis: 'awareness', reverse: true },
  { text: 'I worry people will judge me if they see the real me.', category: 'Fear of Judgment', axis: 'guard', reverse: false },
  { text: 'I keep my feelings to myself even when they\'re overwhelming.', category: 'Emotional Suppression', axis: 'guard', reverse: false },
  { text: 'I show a version of myself to others that isn\'t quite real.', category: 'Performative Behaviour', axis: 'guard', reverse: false },
  { text: 'I believe most people would try to understand me if I opened up.', category: 'Trust in Others', axis: 'reciprocity', reverse: false },
  { text: 'I feel comfortable when someone shares their emotional struggles with me.', category: 'Empathic Comfort', axis: 'reciprocity', reverse: false },
];

const SCALE_LABELS = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

export default function QuizScreen({ route, navigation }) {
  const { onComplete } = route.params;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  const q = questions[index];
  const pct = Math.round((index / questions.length) * 100);
  const isLast = index === questions.length - 1;
  const currentAnswer = answers[index];

  const selectValue = (val) => {
    const nextAnswers = [...answers];
    nextAnswers[index] = val;
    setAnswers(nextAnswers);
  };

  const next = () => {
    if (answers.some(a => a === null)) return;
    if (isLast) {
      const scores = calculateScores(answers);
      const archetype = determineArchetype(scores);
      onComplete({ scores, archetype, answers });
    } else {
      setIndex(i => i + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.progress}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{index + 1} of {questions.length}</Text>
        </View>
      </View>

      <Text style={styles.category}>{q.category}</Text>

      <View style={styles.card}>
        <Text style={styles.qNum}>Q{index + 1}</Text>
        <Text style={styles.qText}>{q.text}</Text>
      </View>

      <View style={styles.scaleRow}>
        {[0, 1, 2, 3, 4].map((val) => (
          <TouchableOpacity
            key={val}
            style={[styles.scaleBtn, currentAnswer === val && styles.scaleBtnOn]}
            onPress={() => selectValue(val)}
          >
            <Text style={[styles.scaleBtnText, currentAnswer === val && styles.scaleBtnTextOn]}>{val + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.scaleLabels}>
        <Text style={styles.scaleLabel}>{SCALE_LABELS[0]}</Text>
        <Text style={styles.scaleLabel}>{SCALE_LABELS[4]}</Text>
      </View>

      <TouchableOpacity
        style={[styles.btn, currentAnswer === null && styles.btnDisabled]}
        onPress={next}
        disabled={currentAnswer === null}
      >
        <Text style={styles.btnText}>{isLast ? 'See my archetype' : 'Next →'}</Text>
      </TouchableOpacity>
    </View>
  );
}

function calculateScores(answers) {
  const axes = { openness: [], awareness: [], guard: [], reciprocity: [] };
  questions.forEach((q, i) => {
    let val = answers[i] ?? 2;
    if (q.reverse) val = 4 - val;
    axes[q.axis].push(val);
  });
  const scores = {};
  for (const [axis, vals] of Object.entries(axes)) {
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    scores[axis] = Math.round((avg / 4) * 100);
  }
  return scores;
}

function determineArchetype(scores) {
  if (scores.openness < 50 && scores.guard > 50) return 'protector';
  if (scores.openness > 50 && scores.awareness > 50) return 'connector';
  if (scores.guard > 50 && scores.reciprocity < 50) return 'performer';
  return 'disconnector';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, padding: 24 },
  header: { marginBottom: 16 },
  backBtn: { marginBottom: 16 },
  backText: { color: theme.inkS, fontSize: 12 },
  progress: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressTrack: { flex: 1, height: 3, backgroundColor: 'rgba(248,242,255,0.08)', borderRadius: 100, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: theme.roseD, borderRadius: 100 },
  progressLabel: { color: theme.inkS, fontSize: 10 },
  category: { color: theme.gold, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginTop: 10, marginBottom: 12 },
  card: { backgroundColor: 'rgba(17,13,26,0.8)', borderWidth: 1, borderColor: theme.line, borderRadius: 22, padding: 20, marginBottom: 20 },
  qNum: { fontFamily: theme.fontSerif, fontSize: 11, fontStyle: 'italic', color: 'rgba(212,133,154,0.4)', marginBottom: 8 },
  qText: { fontFamily: theme.fontSerif, fontSize: 18, color: theme.ink, lineHeight: 26 },
  scaleRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  scaleBtn: { flex: 1, height: 44, borderRadius: 10, backgroundColor: 'rgba(248,242,255,0.03)', borderWidth: 1, borderColor: theme.line, alignItems: 'center', justifyContent: 'center' },
  scaleBtnOn: { backgroundColor: 'rgba(212,133,154,0.12)', borderColor: theme.rose },
  scaleBtnText: { color: theme.inkS, fontSize: 14, fontFamily: theme.fontSerif },
  scaleBtnTextOn: { color: theme.ink },
  scaleLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, paddingHorizontal: 2 },
  scaleLabel: { color: theme.inkS, fontSize: 9 },
  btn: { backgroundColor: theme.roseD, paddingVertical: 18, borderRadius: 100, alignItems: 'center', shadowColor: theme.roseD, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 32 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontSize: 14, letterSpacing: 0.5 },
});
