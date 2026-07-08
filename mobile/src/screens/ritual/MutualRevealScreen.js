import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';

export default function MutualRevealScreen({ navigation }) {
  return (
    <AnimatedScreen style={styles.container}>
      <Text style={styles.chosen}>You chose each other.</Text>

      <Card padding={theme.spacing.xl} style={styles.revealCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={theme.gold} />
        </View>
        <Text style={styles.revealName}>Your partner is Alex</Text>
        <View style={styles.divider} />
        <Text style={styles.revealMessage}>
          "I have been looking for a way to say this. Thank you for the
          quiet nights and the words between them."
        </Text>
      </Card>

      <AppButton
        title="Close this chapter"
        onPress={() => navigation.navigate('TonightDash')}
        style={styles.btn}
      />
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg, alignItems: 'center' },
  chosen: { fontFamily: theme.fontSerif, fontSize: 26, color: theme.ink, textAlign: 'center', marginTop: theme.spacing['2xl'], marginBottom: theme.spacing.xl },
  revealCard: { width: '100%', alignItems: 'center', marginBottom: theme.spacing.xl },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: theme.cardS, alignItems: 'center', justifyContent: 'center',
    marginBottom: theme.spacing.md, borderWidth: 1, borderColor: theme.gold,
  },
  revealName: { fontFamily: theme.fontSans, fontSize: 20, color: theme.ink, fontWeight: '600', marginBottom: theme.spacing.md },
  divider: { height: 1, backgroundColor: theme.line, width: '60%', marginBottom: theme.spacing.md },
  revealMessage: { fontFamily: theme.fontSerif, fontSize: 16, color: theme.inkM, lineHeight: 24, textAlign: 'center' },
  btn: { width: '100%' },
});
