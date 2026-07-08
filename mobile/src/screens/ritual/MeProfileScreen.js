import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';

const settingsRows = [
  { label: 'Writing history', icon: 'time-outline', screen: 'WritingHistory' },
  { label: 'Notification settings', icon: 'notifications-outline', screen: 'NotifSettings' },
  { label: 'Privacy & anonymity', icon: 'shield-outline', screen: 'Privacy' },
  { label: 'Safety centre', icon: 'alert-circle-outline', screen: 'SafetyCentre' },
];

export default function MeProfileScreen({ navigation }) {
  return (
    <AnimatedScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Me</Text>

        <Card padding={theme.spacing.lg} style={styles.userCard}>
          <Text style={styles.userLabel}>You</Text>
          <Text style={styles.userSub}>Night 7 of 21</Text>
          <View style={styles.constellationRow}>
            {Array.from({ length: 21 }, (_, i) => (
              <View key={i} style={[styles.dot, i < 7 && styles.dotFilled]} />
            ))}
          </View>
        </Card>

        <Card padding={0} style={styles.settingsCard}>
          {settingsRows.map((row, i) => (
            <TouchableOpacity
              key={row.label}
              style={[styles.settingRow, i < settingsRows.length - 1 && styles.settingRowBordered]}
              onPress={() => navigation.navigate(row.screen)}
              activeOpacity={0.7}
            >
              <Ionicons name={row.icon} size={20} color={theme.inkM} />
              <Text style={styles.settingLabel}>{row.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.inkS} />
            </TouchableOpacity>
          ))}
        </Card>

        <TouchableOpacity
          style={styles.deleteRow}
          onPress={() => navigation.navigate('AccountDelete')}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteText}>Delete account</Text>
        </TouchableOpacity>
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg },
  scroll: { paddingTop: theme.spacing.xl, paddingBottom: theme.spacing['2xl'] },
  heading: { fontFamily: theme.fontSerif, fontSize: 28, color: theme.ink, marginBottom: theme.spacing.lg },
  userCard: { marginBottom: theme.spacing.md, alignItems: 'center' },
  userLabel: { fontFamily: theme.fontSerif, fontSize: 22, color: theme.ink, marginBottom: theme.spacing.xs },
  userSub: { fontFamily: theme.fontSans, fontSize: 13, color: theme.inkM, marginBottom: theme.spacing.md },
  constellationRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.cardS, borderWidth: 1, borderColor: theme.line },
  dotFilled: { backgroundColor: theme.gold, borderColor: theme.gold },
  settingsCard: { marginBottom: theme.spacing.md },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.md, gap: theme.spacing.sm },
  settingRowBordered: { borderBottomWidth: 1, borderBottomColor: theme.line },
  settingLabel: { fontFamily: theme.fontSans, fontSize: 15, color: theme.inkM, flex: 1 },
  deleteRow: { paddingVertical: theme.spacing.lg, alignItems: 'center' },
  deleteText: { fontFamily: theme.fontSans, fontSize: 14, color: theme.warn },
});
