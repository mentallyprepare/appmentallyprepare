import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';
import { useToast } from '../../components/Toast';

export default function ReadNoteScreen({ navigation }) {
  const { showToast } = useToast();

  return (
    <AnimatedScreen style={styles.container}>
      <Text style={styles.label}>Your partner wrote...</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <Card variant="elevated" padding={theme.spacing.lg} style={styles.card}>
          <Text style={styles.noteText}>
            Today I walked past the old garden where we used to sit. The
            bench is still there, a little worn, a little wiser. I thought
            about how some silences hold more than words ever could.
          </Text>
          <View style={styles.divider} />
          <Text style={styles.noteText}>
            Do you remember the way the light used to fall through the
            maple leaves? Like fragments of a dream we both agreed to
            remember.
          </Text>
          <View style={styles.divider} />
          <Text style={styles.noteText}>
            I hope tonight finds you well. I will be here, writing into
            the dark, trusting that something is listening.
          </Text>
        </Card>
      </ScrollView>

      <AppButton
        title="I witnessed this"
        icon={<Ionicons name="eye" size={18} color="#fff" />}
        onPress={() => {
          showToast('Your partner will know you were here.', 'success');
          navigation.navigate('TonightDash');
        }}
        style={styles.btn}
      />
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg, flex: 1 },
  label: { fontFamily: theme.fontSans, fontSize: 13, color: theme.inkM, letterSpacing: 1, marginTop: theme.spacing.lg, marginBottom: theme.spacing.md },
  scroll: { flex: 1, marginBottom: theme.spacing.md },
  card: { flex: 1 },
  noteText: { fontFamily: theme.fontSerif, fontSize: 16, color: theme.ink, lineHeight: 26, marginBottom: theme.spacing.md },
  divider: { height: 1, backgroundColor: theme.line, marginVertical: theme.spacing.md },
  btn: { marginBottom: theme.spacing.lg },
});
