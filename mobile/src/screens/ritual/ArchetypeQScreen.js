import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';

const questions = [
  {
    title: 'How do you usually process difficult emotions?',
    choices: ['I write them down', 'I talk to someone', 'I sit with them quietly', 'I distract myself'],
  },
  {
    title: 'What does intimate writing mean to you?',
    choices: ['Raw honesty without filter', 'Carefully chosen words', 'Poetic expression', "Questions I can't ask aloud"],
  },
  {
    title: 'How do you prefer to receive feedback?',
    choices: ['Just knowing someone read it', 'A few words in return', 'Shared silence is enough', 'I want to feel understood'],
  },
];

export default function ArchetypeQScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  const question = questions[step];
  const isLast = step === questions.length - 1;

  const handleSelect = (choice) => {
    setSelected(choice);
  };

  const handleContinue = () => {
    const newAnswers = [...answers, selected];
    if (isLast) {
      navigation.navigate('ArchetypeResult', { answers: newAnswers });
    } else {
      setAnswers(newAnswers);
      setStep(step + 1);
      setSelected(null);
    }
  };

  return (
    <AnimatedScreen style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.stepIndicator}>QUESTION {step + 1} OF {questions.length}</Text>
        <Text style={styles.heading}>{question.title}</Text>
        <View style={styles.choicesWrap}>
          {question.choices.map((choice) => {
            const active = selected === choice;
            return (
              <TouchableOpacity
                key={choice}
                style={[styles.choice, active && styles.choiceActive]}
                onPress={() => handleSelect(choice)}
                activeOpacity={0.7}
              >
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{choice}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.footer}>
        <AppButton
          title={isLast ? 'See my result' : 'Continue'}
          onPress={handleContinue}
          disabled={!selected}
        />
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg, justifyContent: 'space-between' },
  body: { flex: 1, justifyContent: 'center', paddingTop: theme.spacing['2xl'] },
  stepIndicator: { fontFamily: theme.fontSans, fontSize: 11, letterSpacing: 2, color: theme.inkS, marginBottom: theme.spacing.md },
  heading: { fontFamily: theme.fontSerif, fontSize: 24, color: theme.ink, marginBottom: theme.spacing.xl, lineHeight: 32 },
  choicesWrap: { gap: theme.spacing.sm },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.line,
  },
  choiceActive: {
    borderColor: theme.rose,
    backgroundColor: 'rgba(211,160,177,0.08)',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: theme.inkS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: theme.rose },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.rose,
  },
  choiceText: { fontSize: 15, color: theme.inkM, fontFamily: theme.fontSans, flex: 1 },
  choiceTextActive: { color: theme.ink },
  footer: { paddingBottom: theme.spacing.xl },
});
