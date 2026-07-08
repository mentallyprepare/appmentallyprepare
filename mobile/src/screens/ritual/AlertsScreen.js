import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import Card from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';

const alerts = [
  { id: '1', type: 'system', icon: 'moon', text: 'Night 3 is ready', time: '2h ago', unread: true },
  { id: '2', type: 'partner', icon: 'people', text: 'Your partner has written', time: '5h ago', unread: true },
  { id: '3', type: 'system', icon: 'calendar', text: 'Day 21 is approaching', time: '1d ago', unread: true },
  { id: '4', type: 'partner', icon: 'lock-closed', text: 'Your partner sealed their note', time: '1d ago', unread: false },
  { id: '5', type: 'partner', icon: 'eye', text: 'Your partner read your note', time: '2d ago', unread: false },
  { id: '6', type: 'community', icon: 'heart', text: 'Someone resonated with your line', time: '3d ago', unread: true },
  { id: '7', type: 'community', icon: 'chatbubbles', text: 'New voices in Loneliness room', time: '4d ago', unread: false },
];

const alertIcons = {
  system: 'moon',
  partner: 'people',
  community: 'heart',
};

export default function AlertsScreen({ navigation }) {
  return (
    <AnimatedScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.heading}>Alerts</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.markAll}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        {alerts.map((alert) => (
          <Card key={alert.id} padding={theme.spacing.md} style={styles.alertCard}>
            <View style={styles.alertRow}>
              <View style={styles.iconWrap}>
                <Ionicons name={alert.icon || alertIcons[alert.type]} size={18} color={theme.rose} />
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertText}>{alert.text}</Text>
                <Text style={styles.alertTime}>{alert.time}</Text>
              </View>
              {alert.unread && <View style={styles.unreadDot} />}
            </View>
          </Card>
        ))}
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg },
  scroll: { paddingTop: theme.spacing.xl, paddingBottom: theme.spacing['2xl'] },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  heading: { fontFamily: theme.fontSerif, fontSize: 32, color: theme.ink },
  markAll: { fontFamily: theme.fontSans, fontSize: 13, color: theme.roseD },
  alertCard: { marginBottom: theme.spacing.sm },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  iconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: theme.cardS,
    alignItems: 'center', justifyContent: 'center',
  },
  alertContent: { flex: 1 },
  alertText: { fontFamily: theme.fontSans, fontSize: 14, color: theme.ink, marginBottom: 2 },
  alertTime: { fontFamily: theme.fontSans, fontSize: 11, color: theme.inkS },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.rose },
});
