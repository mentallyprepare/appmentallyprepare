import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';

export default function WelcomeScreen({ navigation }) {
  return (
    <AnimatedScreen style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.label}>Before you write your first note</Text>
        <Text style={styles.title}>
          This is a 21-night ritual.{'\n'}
          <Text style={styles.titleItalic}>Anonymous.</Text>{' '}
          <Text style={styles.titleItalic}>Unpolished.</Text>{' '}
          <Text style={styles.titleItalic}>Yours.</Text>
        </Text>
        <Text style={styles.description}>
          Each night, you write what's true — without judgment, without editing. A stranger
          somewhere reads it. You read theirs. No names. No profiles. Just honest words passed
          between two people who chose to show up.
        </Text>
        <Text style={styles.description}>
          Over 21 nights, you build a practice. A quiet discipline of being known — and knowing
          someone else — one entry at a time.
        </Text>
      </View>
      <View style={styles.footer}>
        <AppButton
          title="Begin the <ritual>"
          onPress={() => navigation.navigate('Promise')}
        />
        <AppButton
          title="I have an account"
          variant="ghost"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg, justifyContent: 'space-between' },
  body: { flex: 1, justifyContent: 'center', paddingTop: theme.spacing.xl },
  label: { color: theme.inkS, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: theme.spacing.md },
  title: { fontFamily: theme.fontSerif, fontSize: 30, color: theme.ink, lineHeight: 38, marginBottom: theme.spacing.lg },
  titleItalic: { fontStyle: 'italic', color: theme.inkM },
  description: { color: theme.inkM, fontSize: 14, lineHeight: 22, marginBottom: theme.spacing.md, fontFamily: theme.fontSans },
  footer: { gap: theme.spacing.sm, paddingBottom: theme.spacing.xl },
});
