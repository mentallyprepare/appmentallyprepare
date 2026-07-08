import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';

export default function Day21Screen({ navigation }) {
  return (
    <AnimatedScreen style={styles.container}>
      <Text style={styles.heading}>The constellation is complete.</Text>

      <View style={styles.dotsRow}>
        {Array.from({ length: 21 }, (_, i) => (
          <View key={i} style={styles.goldDot} />
        ))}
      </View>

      <Text style={styles.verse}>Twenty-one nights. Twenty-one truths.</Text>

      <AppButton
        title="Consider mutual reveal"
        onPress={() => navigation.navigate('RevealChoice')}
        style={styles.btn}
      />
      <AppButton
        title="Stay anonymous"
        variant="ghost"
        onPress={() => navigation.navigate('RemainAnon')}
      />
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg, alignItems: 'center', justifyContent: 'center' },
  heading: { fontFamily: theme.fontSerif, fontSize: 26, color: theme.ink, textAlign: 'center', marginBottom: theme.spacing.xl },
  dotsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginBottom: theme.spacing.xl, maxWidth: 200 },
  goldDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: theme.gold, borderColor: theme.gold,
    ...theme.shadow.glow(theme.gold),
  },
  verse: { fontFamily: theme.fontSerif, fontSize: 17, color: theme.inkM, textAlign: 'center', lineHeight: 26, marginBottom: theme.spacing['2xl'] },
  btn: { width: '100%', marginBottom: theme.spacing.sm },
});
