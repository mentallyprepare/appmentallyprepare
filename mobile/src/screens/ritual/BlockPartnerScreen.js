import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '../../components/Toast';

const consequences = [
  'Your current pairing will end immediately',
  'All notes from this cycle will be sealed permanently',
  'You will be matched with a new partner on your next cycle',
  'This action cannot be undone',
];

export default function BlockPartnerScreen({ navigation }) {
  const { showToast } = useToast();

  return (
    <AnimatedScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="hand-left-outline" size={32} color={theme.warn} />
          <Text style={styles.heading}>Block your partner</Text>
        </View>

        <Card variant="highlight" padding={theme.spacing.lg} style={styles.warningCard}>
          <Text style={styles.warningTitle}>Are you sure?</Text>
          <View style={styles.consequencesList}>
            {consequences.map((item, i) => (
              <View key={i} style={styles.consequenceRow}>
                <Text style={styles.bullet}>&#8226;</Text>
                <Text style={styles.consequenceText}>{item}</Text>
              </View>
            ))}
          </View>
        </Card>

        <AppButton
          title="Block partner"
          variant="danger"
          onPress={() => {
            showToast('Partner has been blocked.', 'warning');
            navigation.goBack();
          }}
          style={styles.blockBtn}
        />

        <AppButton
          title="Cancel"
          variant="ghost"
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg },
  scroll: { paddingTop: theme.spacing.xl, paddingBottom: theme.spacing['2xl'] },
  header: { alignItems: 'center', marginBottom: theme.spacing.lg, gap: theme.spacing.sm },
  heading: { fontFamily: theme.fontSerif, fontSize: 24, color: theme.ink, textAlign: 'center' },
  warningCard: { marginBottom: theme.spacing.xl },
  warningTitle: { fontFamily: theme.fontSerif, fontSize: 18, color: theme.warn, marginBottom: theme.spacing.md },
  consequencesList: { gap: theme.spacing.sm },
  consequenceRow: { flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'flex-start' },
  bullet: { color: theme.inkM, fontSize: 16, lineHeight: 20 },
  consequenceText: { fontFamily: theme.fontSans, fontSize: 14, color: theme.inkM, flex: 1, lineHeight: 20 },
  blockBtn: { marginBottom: theme.spacing.sm },
});
