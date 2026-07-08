import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';

export default function NoteSealedScreen({ navigation }) {
  return (
    <AnimatedScreen style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="lock-closed" size={56} color={theme.gold} />
      </View>

      <Text style={styles.heading}>Your note is sealed</Text>
      <Text style={styles.poetic}>Your constellation is one star brighter tonight.</Text>

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
  iconWrap: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(208,178,120,0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadow.glow(theme.gold),
  },
  heading: { fontFamily: theme.fontSerif, fontSize: 26, color: theme.ink, textAlign: 'center', marginBottom: theme.spacing.md },
  poetic: { fontFamily: theme.fontSerif, fontSize: 16, color: theme.inkM, textAlign: 'center', lineHeight: 24, marginBottom: theme.spacing['2xl'] },
  btn: { width: '100%' },
});
