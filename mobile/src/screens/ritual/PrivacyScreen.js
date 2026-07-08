import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '../../components/Toast';

const infoCards = [
  { icon: 'eye-off-outline', title: 'Full anonymity', desc: 'No names, photos, or identifying info are ever shared. You are known only by your words.' },
  { icon: 'calendar-outline', title: '21-day data retention', desc: 'Notes are automatically deleted after 21 days. Nothing is stored beyond your current cycle.' },
  { icon: 'share-outline', title: 'No personal info shared', desc: 'Your identity is never revealed to your partner. Anonymity is the foundation of this space.' },
  { icon: 'lock-closed-outline', title: 'Encrypted notes', desc: 'All writing is encrypted in transit and at rest. Your thoughts remain private.' },
];

export default function PrivacyScreen({ navigation }) {
  const { showToast } = useToast();

  return (
    <AnimatedScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Privacy & anonymity</Text>

        {infoCards.map((card) => (
          <Card key={card.title} padding={theme.spacing.md} style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name={card.icon} size={22} color={theme.mauve} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>{card.title}</Text>
                <Text style={styles.infoDesc}>{card.desc}</Text>
              </View>
            </View>
          </Card>
        ))}

        <AppButton
          title="Export my data"
          variant="ghost"
          onPress={() => showToast('Data export requested. You\'ll receive an email within 24 hours.', 'info')}
          style={styles.exportBtn}
        />

        <TouchableOpacity
          style={styles.deleteLink}
          onPress={() => navigation.navigate('AccountDelete')}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteLinkText}>Delete my account</Text>
        </TouchableOpacity>
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg },
  scroll: { paddingTop: theme.spacing.xl, paddingBottom: theme.spacing['2xl'] },
  heading: { fontFamily: theme.fontSerif, fontSize: 28, color: theme.ink, marginBottom: theme.spacing.lg },
  infoCard: { marginBottom: theme.spacing.sm },
  infoRow: { flexDirection: 'row', gap: theme.spacing.md, alignItems: 'flex-start' },
  infoContent: { flex: 1 },
  infoTitle: { fontFamily: theme.fontSerif, fontSize: 16, color: theme.ink, marginBottom: 4 },
  infoDesc: { fontFamily: theme.fontSans, fontSize: 13, color: theme.inkM, lineHeight: 18 },
  exportBtn: { marginTop: theme.spacing.lg },
  deleteLink: { paddingVertical: theme.spacing.lg, alignItems: 'center' },
  deleteLinkText: { fontFamily: theme.fontSans, fontSize: 14, color: theme.warn },
});
