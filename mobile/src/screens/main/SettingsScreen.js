import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../../theme';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { Icon } from '../../components/Icon';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';

export default function SettingsScreen({ navigation }) {
  const { logout } = useAuth();
  const toast = useToast();
  const [consent, setConsent] = useState(true);

  useEffect(() => {
    api.consent().then(d => setConsent(d.consentGiven)).catch(() => {});
  }, []);

  const handleWithdrawConsent = () => {
    Alert.alert('Withdraw Consent', 'You will no longer be eligible for matching. You can still journal privately.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Withdraw', style: 'destructive', onPress: async () => {
        try {
          await api.withdrawConsent();
          setConsent(false);
          try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
          toast.showSuccess('Consent withdrawn');
        } catch (e) {
          toast.showError(e.message);
        }
      }},
    ]);
  };

  const handleExport = async () => {
    try {
      await api.myData();
      toast.showSuccess('Your data has been prepared for download');
    } catch (e) {
      toast.showError(e.message);
    }
  };

  const handleLogout = async () => {
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
  };

  const items = [
    { icon: 'download-outline', label: 'Export my data', onPress: handleExport },
    { icon: 'shield-checkmark-outline', label: `Consent: ${consent ? 'Active' : 'Withdrawn'}`, onPress: consent ? handleWithdrawConsent : null, badge: consent ? 'Active' : 'Inactive' },
    { icon: 'information-circle-outline', label: 'About', onPress: () => navigation.navigate('About') },
  ];

  return (
    <AnimatedScreen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        {items.map((item, i) => (
          <TouchableOpacity key={i} style={styles.si} onPress={item.onPress} disabled={!item.onPress}>
            <Icon name={item.icon} size={20} color={theme.inkM} />
            <Text style={styles.siLbl}>{item.label}</Text>
            {item.badge && (
              <View style={[styles.badge, { borderColor: consent ? 'rgba(101,145,121,0.3)' : 'rgba(212,133,154,0.2)' }]}>
                <Text style={[styles.badgeText, { color: consent ? theme.green : theme.roseL }]}>{item.badge}</Text>
              </View>
            )}
            <Icon name="chevron-forward" size={16} color={theme.inkS} />
          </TouchableOpacity>
        ))}

        <AppButton title="Sign out" variant="danger" onPress={handleLogout} style={{ marginTop: 20 }} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingTop: 60 },
  title: { fontFamily: theme.fontSerif, fontSize: 28, color: theme.ink, marginBottom: 24 },
  si: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: theme.borderRadius.md, marginBottom: 8 },
  siLbl: { color: theme.inkM, fontSize: 14, flex: 1 },
  badge: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100 },
  badgeText: { fontSize: 9, letterSpacing: 1 },
});
