import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';

export default function RemainAnonScreen({ navigation }) {
  return (
    <AnimatedScreen style={styles.container}>
      <Ionicons name="moon" size={48} color={theme.gold} style={styles.icon} />

      <Text style={styles.line}>
        Some connections are meant to remain a mystery.
      </Text>
      <Text style={styles.sub}>
        The night does not need to know your name to hold you. The
        constellation remembers not the star's name, only its light.
      </Text>

      <AppButton
        title="Return to tonight"
        onPress={() => navigation.navigate('TonightDash')}
        style={styles.btn}
      />
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg, alignItems: 'center', justifyContent: 'center' },
  icon: { marginBottom: theme.spacing.lg },
  line: { fontFamily: theme.fontSerif, fontSize: 24, color: theme.ink, textAlign: 'center', lineHeight: 32, marginBottom: theme.spacing.md },
  sub: { fontFamily: theme.fontSerif, fontSize: 16, color: theme.inkM, textAlign: 'center', lineHeight: 24, marginBottom: theme.spacing['2xl'] },
  btn: { width: '100%' },
});
