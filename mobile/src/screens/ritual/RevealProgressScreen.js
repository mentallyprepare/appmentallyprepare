import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';

const TOTAL = 21;
const COMPLETED = 7;

export default function RevealProgressScreen({ navigation }) {
  return (
    <AnimatedScreen style={styles.container}>
      <Text style={styles.heading}>Constellation</Text>

      <View style={styles.constellation}>
        {Array.from({ length: TOTAL }, (_, i) => {
          const angle = (i / TOTAL) * Math.PI * 2;
          const radius = 80 + (i % 7) * 12;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const filled = i < COMPLETED;
          const current = i === COMPLETED;

          return (
            <View key={i} style={[styles.dotWrap, { transform: [{ translateX: x }, { translateY: y }] }]}>
              {i > 0 && (
                <View
                  style={[
                    styles.connection,
                    { transform: [{ rotate: `${angle}rad` }], width: 24 },
                  ]}
                />
              )}
              <View
                style={[
                  styles.dot,
                  filled && styles.dotFilled,
                  current && styles.dotCurrent,
                ]}
              />
            </View>
          );
        })}
      </View>

      <Text style={styles.progressText}>
        {COMPLETED} of {TOTAL} nights complete
      </Text>

      <AppButton
        title="Continue writing"
        onPress={() => navigation.navigate('TonightDash')}
        style={styles.btn}
      />
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg, alignItems: 'center' },
  heading: { fontFamily: theme.fontSerif, fontSize: 24, color: theme.ink, textAlign: 'center', marginTop: theme.spacing.lg, marginBottom: theme.spacing['2xl'] },
  constellation: {
    width: 280, height: 280,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  dotWrap: {
    position: 'absolute', alignItems: 'center', justifyContent: 'center',
  },
  dot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: theme.cardS, borderWidth: 1, borderColor: theme.line,
  },
  dotFilled: {
    backgroundColor: theme.gold, borderColor: theme.gold,
    ...theme.shadow.glow(theme.gold),
  },
  dotCurrent: {
    backgroundColor: theme.rose, borderColor: theme.rose,
    ...theme.shadow.glow(theme.rose),
  },
  connection: {
    position: 'absolute', height: 1,
    backgroundColor: theme.line, top: 6, left: 6,
  },
  progressText: { fontFamily: theme.fontSans, fontSize: 14, color: theme.inkM, marginBottom: theme.spacing.xl },
  btn: { width: '100%' },
});
