import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';

export default function SealConfirmScreen({ navigation }) {
  return (
    <AnimatedScreen style={styles.container}>
      <Ionicons name="lock-closed" size={40} color={theme.gold} style={styles.icon} />
      <Text style={styles.heading}>Seal your note?</Text>

      <Card variant="elevated" padding={theme.spacing.lg} style={styles.card}>
        <View style={styles.decorativeBorder} />
        <Text style={styles.explainer}>
          Once sealed, this note cannot be edited. Your partner will receive it
          when they write back. Some words are meant to travel in their own time.
        </Text>
      </Card>

      <AppButton
        title="Seal note"
        onPress={() => navigation.navigate('NoteSealed')}
        style={styles.sealBtn}
      />
      <AppButton
        title="Keep writing"
        variant="ghost"
        onPress={() => navigation.goBack()}
      />
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg, alignItems: 'center' },
  icon: { marginTop: theme.spacing['3xl'], marginBottom: theme.spacing.md },
  heading: { fontFamily: theme.fontSerif, fontSize: 24, color: theme.ink, textAlign: 'center', marginBottom: theme.spacing.lg },
  card: { width: '100%', marginBottom: theme.spacing.xl, position: 'relative' },
  decorativeBorder: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
    backgroundColor: theme.gold, opacity: 0.3,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  explainer: { fontFamily: theme.fontSerif, fontSize: 16, color: theme.inkM, lineHeight: 24, textAlign: 'center' },
  sealBtn: { marginBottom: theme.spacing.sm },
});
