import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';
import { Icon } from '../../components/Icon';
import { useAuth } from '../../context/AuthContext';

export default function MatchFoundScreen({ navigation }) {
  const { login } = useAuth();
  return (
    <AnimatedScreen style={styles.container}>
      <View style={styles.body}>
        <View style={styles.starRow}>
          <Icon name="star" size={16} color={theme.gold} />
          <Icon name="star" size={20} color={theme.rose} style={{ marginHorizontal: theme.spacing.xs }} />
          <Icon name="star" size={16} color={theme.gold} />
        </View>
        <Text style={styles.heading}>A match is found</Text>
        <Card variant="elevated" padding={theme.spacing.lg} style={styles.card}>
          <Text style={styles.nightLabel}>Night 1 of 21</Text>
          <View style={styles.divider} />
          <Text style={styles.poem}>
            Two strangers,{'\n'}
            each carrying a story too heavy for one.{'\n'}
            Tonight, the weight is shared.
          </Text>
          <View style={styles.divider} />
          <View style={styles.partnerRow}>
            <View style={styles.avatarRing}>
              <Icon name="person" size={20} color={theme.inkM} />
            </View>
            <View style={styles.partnerInfo}>
              <Text style={styles.partnerLabel}>Someone who writes like you</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>✧ 24 · similar pace</Text>
              </View>
            </View>
          </View>
        </Card>
      </View>
      <View style={styles.footer}>
        <AppButton title="Begin Night 1" onPress={() => { login({ name: 'You', nightsCompleted: 0 }); navigation.navigate('MainTabs'); }} />
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg, justifyContent: 'space-between' },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: theme.spacing['2xl'] },
  starRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md },
  heading: { fontFamily: theme.fontSerif, fontSize: 30, color: theme.ink, marginBottom: theme.spacing.xl },
  card: { width: '100%', alignItems: 'center' },
  nightLabel: { fontFamily: theme.fontSans, fontSize: 12, letterSpacing: 1.5, color: theme.inkM },
  divider: { height: 1, backgroundColor: theme.line, width: '60%', marginVertical: theme.spacing.md },
  poem: { fontFamily: theme.fontSerif, fontStyle: 'italic', fontSize: 16, color: theme.inkM, textAlign: 'center', lineHeight: 26 },
  partnerRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, width: '100%' },
  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.cardS,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.line,
  },
  partnerInfo: { flex: 1 },
  partnerLabel: { fontFamily: theme.fontSans, fontSize: 14, color: theme.ink, marginBottom: theme.spacing.xs },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(211,160,177,0.1)',
  },
  badgeText: { fontFamily: theme.fontSans, fontSize: 11, color: theme.rose },
  footer: { paddingBottom: theme.spacing.xl },
});
