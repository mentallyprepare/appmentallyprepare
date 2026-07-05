import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { theme } from '../../theme';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SettingsScreen({ navigation }) {
  const { logout } = useAuth();
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
          Alert.alert('Done', 'Consent withdrawn.');
        } catch (e) {
          Alert.alert('Error', e.message);
        }
      }},
    ]);
  };

  const handleExport = async () => {
    try {
      await api.myData();
      Alert.alert('Data Exported', 'Your data has been prepared for download.');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
  };

  const items = [
    { icon: '📊', label: 'Export my data', onPress: handleExport },
    { icon: '🔄', label: `Consent: ${consent ? 'Active' : 'Withdrawn'}`, onPress: consent ? handleWithdrawConsent : null, badge: consent ? 'Active' : 'Inactive' },
    { icon: '❓', label: 'About', onPress: () => navigation.navigate('About') },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      {items.map((item, i) => (
        <TouchableOpacity key={i} style={styles.si} onPress={item.onPress} disabled={!item.onPress}>
          <Text style={styles.siIco}>{item.icon}</Text>
          <Text style={styles.siLbl}>{item.label}</Text>
          {item.badge && <Text style={styles.siBadge}>{item.badge}</Text>}
          <Text style={styles.siArrow}>→</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign out</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  content: { padding: 24, paddingTop: 60 },
  title: { fontFamily: theme.fontSerif, fontSize: 28, color: theme.ink, marginBottom: 24 },
  si: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: 14, marginBottom: 8 },
  siIco: { fontSize: 18 },
  siLbl: { color: theme.inkM, fontSize: 14, flex: 1 },
  siBadge: { color: theme.roseL, fontSize: 9, letterSpacing: 1, backgroundColor: 'rgba(212,133,154,0.1)', borderWidth: 1, borderColor: 'rgba(212,133,154,0.18)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100 },
  siArrow: { color: theme.inkS, fontSize: 14 },
  logoutBtn: { marginTop: 20, borderWidth: 1, borderColor: theme.line, borderRadius: 14, padding: 16, alignItems: 'center' },
  logoutText: { color: theme.inkM, fontSize: 14 },
});
