import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';

export default function ArchetypeIntroScreen({ navigation }) {
  return (
    <AnimatedScreen style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.label}>STEP 1 OF 3</Text>
        <Text style={styles.heading}>What kind of writer are you?</Text>
        <Text style={styles.subtitle}>
          Three questions to find a compatible match — someone whose writing rhythm
          mirrors your own, so the exchange feels natural from the first word.
        </Text>
        <View style={styles.divider} />
        <Text style={styles.poetic}>
          Somewhere out there, someone writes the way you do.{'\n'}
          Same cadence. Same silence between words.
        </Text>
      </View>
      <View style={styles.footer}>
        <AppButton title="Begin the questions" onPress={() => navigation.navigate('ArchetypeQ')} />
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg, justifyContent: 'space-between' },
  body: { flex: 1, justifyContent: 'center', paddingTop: theme.spacing['2xl'] },
  label: { fontFamily: theme.fontSans, fontSize: 11, letterSpacing: 2, color: theme.inkS, marginBottom: theme.spacing.md },
  heading: { fontFamily: theme.fontSerif, fontSize: 30, color: theme.ink, marginBottom: theme.spacing.md, lineHeight: 38 },
  subtitle: { fontFamily: theme.fontSans, fontSize: 15, color: theme.inkM, lineHeight: 24 },
  divider: { height: 1, backgroundColor: theme.line, marginVertical: theme.spacing.lg },
  poetic: { fontFamily: theme.fontSerif, fontStyle: 'italic', fontSize: 16, color: theme.rose, lineHeight: 26 },
  footer: { paddingBottom: theme.spacing.xl },
});
