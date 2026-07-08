import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';

const steps = [
  { number: '①', title: 'Write what you feel', description: 'Anonymous and unfiltered. No one knows your name, so there\'s nothing to perform. Just write.' },
  { number: '②', title: 'Seal it for the night', description: 'Your entry is locked until your partner writes too. No peeking. No editing.' },
  { number: '③', title: 'Read and be read', description: 'Every 24 hours, you exchange. You read theirs, they read yours. A mutual act of trust.' },
];

export default function PromiseScreen({ navigation }) {
  const [step, setStep] = useState(0);

  return (
    <AnimatedScreen style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.heading}>The ritual in three parts</Text>
        <Text style={styles.subheading}>This is how it works. No surprises.</Text>
        <View style={styles.stepsWrap}>
          {steps.map((s, i) => (
            <Card
              key={s.number}
              variant={i === step ? 'highlight' : 'default'}
              padding={theme.spacing.md}
              style={styles.stepCard}
            >
              <Text style={[styles.stepNumber, i === step && styles.stepNumberActive]}>{s.number}</Text>
              <View style={styles.stepTextWrap}>
                <Text style={[styles.stepTitle, i === step && styles.stepTitleActive]}>{s.title}</Text>
                <Text style={styles.stepDesc}>{s.description}</Text>
              </View>
            </Card>
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <AppButton
          title="I understand"
          onPress={() => navigation.navigate('Name')}
        />
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg, justifyContent: 'space-between' },
  body: { flex: 1, justifyContent: 'center', paddingTop: theme.spacing.xl },
  heading: { fontFamily: theme.fontSerif, fontSize: 28, color: theme.ink, marginBottom: theme.spacing.xs },
  subheading: { color: theme.inkM, fontSize: 14, marginBottom: theme.spacing.lg, fontFamily: theme.fontSans },
  stepsWrap: { gap: theme.spacing.sm },
  stepCard: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  stepNumber: { fontSize: 28, color: theme.inkS },
  stepNumberActive: { color: theme.rose },
  stepTextWrap: { flex: 1 },
  stepTitle: { fontFamily: theme.fontSerif, fontSize: 17, color: theme.ink, marginBottom: 2 },
  stepTitleActive: { color: theme.rose },
  stepDesc: { color: theme.inkM, fontSize: 13, lineHeight: 19, fontFamily: theme.fontSans },
  footer: { paddingBottom: theme.spacing.xl },
});
