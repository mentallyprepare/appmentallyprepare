import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import { Icon } from '../../components/Icon';

const reminders = [
  { icon: 'create-outline', text: 'A daily nudge when it\'s time to write' },
  { icon: 'sync-outline', text: 'A quiet ping when your partner has written' },
  { icon: 'sunny-outline', text: 'A heads-up when reveal day arrives' },
];

export default function NotifPermScreen({ navigation }) {
  return (
    <AnimatedScreen style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.heading}>We'll nudge you gently</Text>
        <Text style={styles.subheading}>
          No noise. Just the right reminders at the right time.
        </Text>
        <View style={styles.list}>
          {reminders.map((r) => (
            <View key={r.icon} style={styles.row}>
              <View style={styles.iconWrap}>
                <Icon name={r.icon} size={20} color={theme.rose} />
              </View>
              <Text style={styles.rowText}>{r.text}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.note}>
          You can change this anytime in settings.
        </Text>
      </View>
      <View style={styles.footer}>
        <AppButton
          title="Allow reminders"
          onPress={() => navigation.navigate('ArchetypeIntro')}
        />
        <AppButton
          title="Not now"
          variant="ghost"
          onPress={() => navigation.navigate('ArchetypeIntro')}
        />
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg, justifyContent: 'space-between' },
  body: { flex: 1, justifyContent: 'center', paddingTop: theme.spacing.xl },
  heading: { fontFamily: theme.fontSerif, fontSize: 28, color: theme.ink, marginBottom: theme.spacing.sm },
  subheading: { color: theme.inkM, fontSize: 14, marginBottom: theme.spacing.xl, fontFamily: theme.fontSans, lineHeight: 20 },
  list: { gap: theme.spacing.md, marginBottom: theme.spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(211,160,177,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { color: theme.inkM, fontSize: 14, fontFamily: theme.fontSans, flex: 1, lineHeight: 20 },
  note: { color: theme.inkS, fontSize: 12, textAlign: 'center', fontFamily: theme.fontSans },
  footer: { gap: theme.spacing.sm, paddingBottom: theme.spacing.xl },
});
