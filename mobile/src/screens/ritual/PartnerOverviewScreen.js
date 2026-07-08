import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';
import { useToast } from '../../components/Toast';

export default function PartnerOverviewScreen({ navigation }) {
  const { showToast } = useToast();

  return (
    <AnimatedScreen style={styles.container}>
      <Text style={styles.heading}>Your partner</Text>

      <Card padding={theme.spacing.xl} style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color={theme.gold} />
        </View>
        <Text style={styles.anonymousName}>A_5281</Text>
        <Text style={styles.anonymousSub}>Anonymous partner</Text>
      </Card>

      <Card padding={theme.spacing.lg} style={styles.statsCard}>
        <View style={styles.statRow}>
          <Ionicons name="moon" size={16} color={theme.inkM} />
          <Text style={styles.statText}>Connected for 12 nights</Text>
        </View>
        <View style={styles.statRow}>
          <Ionicons name="time" size={16} color={theme.inkM} />
          <Text style={styles.statText}>They write late — around 11 PM</Text>
        </View>
        <View style={styles.statRow}>
          <Ionicons name="speedometer" size={16} color={theme.inkM} />
          <Text style={styles.statText}>Similar pace — you both write daily</Text>
        </View>
      </Card>

      <Card padding={theme.spacing.lg} style={styles.constellationMini}>
        <Text style={styles.miniLabel}>Constellation progress</Text>
        <View style={styles.dotsRow}>
          {Array.from({ length: 21 }, (_, i) => (
            <View key={i} style={[styles.miniDot, i < 8 && styles.miniDotFilled, i === 8 && styles.miniDotCurrent]} />
          ))}
        </View>
        <View style={styles.dotsRow}>
          {Array.from({ length: 21 }, (_, i) => (
            <View key={i} style={[styles.miniDot, i < 6 && styles.miniDotPartner]} />
          ))}
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.gold }]} />
            <Text style={styles.legendText}>You</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.mauve }]} />
            <Text style={styles.legendText}>Partner</Text>
          </View>
        </View>
      </Card>

      <AppButton
        title="Send gentle reminder"
        icon={<Ionicons name="notifications-outline" size={18} color="#fff" />}
        onPress={() => { showToast('Gentle reminder sent.', 'info'); }}
        style={styles.btn}
      />
      <AppButton
        title="Find new partner"
        variant="ghost"
        onPress={() => { showToast('This feature is coming soon.', 'warning'); }}
      />
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg },
  heading: { fontFamily: theme.fontSerif, fontSize: 24, color: theme.ink, textAlign: 'center', marginTop: theme.spacing.lg, marginBottom: theme.spacing.lg },
  profileCard: { alignItems: 'center', marginBottom: theme.spacing.md },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: theme.cardS, alignItems: 'center', justifyContent: 'center',
    marginBottom: theme.spacing.md, borderWidth: 1, borderColor: theme.gold,
  },
  anonymousName: { fontFamily: theme.fontSans, fontSize: 18, color: theme.ink, fontWeight: '600' },
  anonymousSub: { fontFamily: theme.fontSans, fontSize: 13, color: theme.inkM, marginTop: 2 },
  statsCard: { marginBottom: theme.spacing.md },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.sm },
  statText: { fontFamily: theme.fontSans, fontSize: 14, color: theme.inkM, flex: 1 },
  constellationMini: { marginBottom: theme.spacing.lg },
  miniLabel: { fontFamily: theme.fontSans, fontSize: 11, color: theme.inkS, letterSpacing: 1, marginBottom: theme.spacing.sm, textTransform: 'uppercase' },
  dotsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: theme.spacing.sm },
  miniDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.cardS, borderWidth: 1, borderColor: theme.line },
  miniDotFilled: { backgroundColor: theme.gold, borderColor: theme.gold },
  miniDotCurrent: { backgroundColor: theme.rose, borderColor: theme.rose },
  miniDotPartner: { backgroundColor: theme.mauve, borderColor: theme.mauve },
  legendRow: { flexDirection: 'row', gap: theme.spacing.lg, marginTop: theme.spacing.xs },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendText: { fontFamily: theme.fontSans, fontSize: 11, color: theme.inkS },
  btn: { marginBottom: theme.spacing.sm },
});
