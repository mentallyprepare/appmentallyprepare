import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { theme } from '../../theme';
import AnimatedScreen from '../../components/AnimatedScreen';
import Card from '../../components/Card';

const toggles = [
  { key: 'dailyReminder', label: 'Daily writing reminder', desc: '8pm every night' },
  { key: 'partnerWrote', label: 'Partner wrote', desc: 'When they seal their note' },
  { key: 'partnerRead', label: 'Partner read your note', desc: '' },
  { key: 'day21', label: 'Day 21 reminder', desc: '' },
  { key: 'community', label: 'Community activity', desc: '' },
];

export default function NotifSettingsScreen({ navigation }) {
  const [settings, setSettings] = useState({
    dailyReminder: true,
    partnerWrote: true,
    partnerRead: false,
    day21: true,
    community: false,
  });

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <AnimatedScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Notification settings</Text>

        <Card padding={0}>
          {toggles.map((item, i) => (
            <View key={item.key} style={[styles.toggleRow, i < toggles.length - 1 && styles.toggleRowBordered]}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>{item.label}</Text>
                {item.desc ? <Text style={styles.toggleDesc}>{item.desc}</Text> : null}
              </View>
              <Switch
                value={settings[item.key]}
                onValueChange={() => toggle(item.key)}
                trackColor={{ false: theme.line, true: theme.green }}
                thumbColor={settings[item.key] ? theme.paper : theme.inkS}
              />
            </View>
          ))}
        </Card>
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: theme.spacing.lg },
  scroll: { paddingTop: theme.spacing.xl, paddingBottom: theme.spacing['2xl'] },
  heading: { fontFamily: theme.fontSerif, fontSize: 28, color: theme.ink, marginBottom: theme.spacing.lg },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.md },
  toggleRowBordered: { borderBottomWidth: 1, borderBottomColor: theme.line },
  toggleInfo: { flex: 1, marginRight: theme.spacing.md },
  toggleLabel: { fontFamily: theme.fontSans, fontSize: 15, color: theme.ink },
  toggleDesc: { fontFamily: theme.fontSans, fontSize: 12, color: theme.inkS, marginTop: 2 },
});
