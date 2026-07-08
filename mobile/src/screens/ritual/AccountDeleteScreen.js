import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '../../components/Toast';

export default function AccountDeleteScreen({ navigation }) {
  const [confirmed, setConfirmed] = useState(false);
  const { showToast } = useToast();

  return (
    <AnimatedScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="warning-outline" size={32} color={theme.warn} />
          <Text style={styles.heading}>Delete account</Text>
        </View>

        <Card variant="highlight" padding={theme.spacing.lg} style={styles.warningCard}>
          <Text style={styles.warningText}>
            This will permanently delete your account, all your writing, and your current pairing. You will lose access to all notes and your partner will be notified. This cannot be undone.
          </Text>
        </Card>

        <View style={styles.confirmRow}>
          <Switch
            value={confirmed}
            onValueChange={setConfirmed}
            trackColor={{ false: theme.line, true: theme.warn }}
            thumbColor={confirmed ? theme.paper : theme.inkS}
          />
          <Text style={styles.confirmLabel}>I understand this is permanent</Text>
        </View>

        <AppButton
          title="Delete my account"
          variant="danger"
          disabled={!confirmed}
          onPress={() => {
            showToast('Account deletion requested.', 'error');
            navigation.goBack();
          }}
          style={styles.deleteBtn}
        />

        <AppButton
          title="Keep my account"
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
  warningCard: { marginBottom: theme.spacing.lg },
  warningText: { fontFamily: theme.fontSans, fontSize: 14, color: theme.inkM, lineHeight: 20 },
  confirmRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.xl, paddingHorizontal: theme.spacing.xs },
  confirmLabel: { fontFamily: theme.fontSans, fontSize: 14, color: theme.ink, flex: 1 },
  deleteBtn: { marginBottom: theme.spacing.sm },
});
