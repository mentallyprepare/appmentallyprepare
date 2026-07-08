import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';

export default function RevealWaitingScreen({ navigation }) {
  return (
    <AnimatedScreen style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="eye-outline" size={48} color={theme.gold} />
      </View>

      <Text style={styles.heading}>Waiting for your partner...</Text>

      <Card padding={theme.spacing.lg} style={styles.card}>
        <Text style={styles.explainer}>
          You have chosen what to reveal. Now it is a quiet waiting — a
          held breath. When your partner responds, the stars will decide
          what is ready to be seen.
        </Text>
      </Card>

      <AppButton
        title="Continue to reveal"
        onPress={() => navigation.navigate('MutualReveal')}
        style={styles.btn}
      />
      <AppButton
        title="Continue anonymously"
        variant="ghost"
        onPress={() => navigation.navigate('RemainAnon')}
      />
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg, alignItems: 'center' },
  iconWrap: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(208,178,120,0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginTop: theme.spacing['3xl'], marginBottom: theme.spacing.lg,
    ...theme.shadow.glow(theme.gold),
  },
  heading: { fontFamily: theme.fontSerif, fontSize: 24, color: theme.ink, textAlign: 'center', marginBottom: theme.spacing.lg },
  card: { width: '100%', marginBottom: theme.spacing.xl },
  explainer: { fontFamily: theme.fontSerif, fontSize: 16, color: theme.inkM, lineHeight: 24, textAlign: 'center' },
  btn: { width: '100%', marginBottom: theme.spacing.sm },
});
