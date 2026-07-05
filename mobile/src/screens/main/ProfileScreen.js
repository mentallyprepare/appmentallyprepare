import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { theme } from '../../theme';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const me = await api.me();
      setData(me);
    } catch (e) {}
  };

  const handleDelete = () => {
    Alert.alert('Delete Account', 'This permanently erases all your data. Contact support to complete deletion.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await api.deleteAccount('confirmed');
        } catch (e) {
          Alert.alert('Error', 'Use the web app to delete your account for security.');
        }
      }},
    ]);
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
  };

  if (!data) return <View style={styles.loading}><ActivityIndicator color={theme.roseL} /></View>;

  const { user: profile, match } = data;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={{ fontSize: 36 }}>🌙</Text>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.college}>{profile.college}</Text>
      </View>

      {/* Archetype */}
      {profile.archetype && (
        <View style={styles.archCard}>
          <Text style={styles.archEy}>Your Archetype</Text>
          <Text style={styles.archName}>{profile.archetype}</Text>
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statN}>{data.entries?.length || 0}</Text>
          <Text style={styles.statL}>Entries</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statN}>{data.streak || 0}</Text>
          <Text style={styles.statL}>Day Streak</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statN}>{match?.day || '-'}</Text>
          <Text style={styles.statL}>Day</Text>
        </View>
      </View>

      {/* Recent Entries */}
      {data.entries && data.entries.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          {data.entries.slice(-3).reverse().map((e, i) => (
            <View key={i} style={styles.entry}>
              <View style={styles.entryTop}>
                <Text style={styles.entryDay}>Day {e.day_number}</Text>
                <Text>{e.mood || '🌓'}</Text>
              </View>
              <Text style={styles.entryTxt} numberOfLines={2}>{e.text}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLogout}>
          <Text style={styles.actionBtnText}>Sign out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnDanger} onPress={handleDelete}>
          <Text style={styles.actionBtnDangerText}>Delete account</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  content: {},
  loading: { flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' },
  hero: { alignItems: 'center', paddingTop: 28, paddingHorizontal: 24 },
  avatar: { width: 86, height: 86, borderRadius: 43, backgroundColor: theme.roseD, alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: '#C9A96E', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 40 },
  name: { fontFamily: theme.fontSerif, fontSize: 24, color: theme.ink, marginBottom: 4 },
  college: { color: theme.inkS, fontSize: 12, marginBottom: 20 },
  archCard: { marginHorizontal: 24, backgroundColor: 'rgba(212,133,154,0.09)', borderWidth: 1, borderColor: 'rgba(212,133,154,0.18)', borderRadius: 20, padding: 16 },
  archEy: { color: theme.rose, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 },
  archName: { fontFamily: theme.fontSerif, fontSize: 18, fontStyle: 'italic', color: theme.ink },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 24, paddingTop: 20 },
  stat: { flex: 1, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: 16, padding: 14, alignItems: 'center' },
  statN: { fontFamily: theme.fontSerif, fontSize: 24, color: theme.roseL, lineHeight: 28 },
  statL: { color: theme.inkS, fontSize: 9, marginTop: 4 },
  section: { paddingHorizontal: 24, paddingTop: 20 },
  sectionTitle: { color: theme.inkS, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  entry: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: 18, padding: 16, marginBottom: 8 },
  entryTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  entryDay: { color: theme.inkS, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' },
  entryTxt: { fontFamily: theme.fontSerif, fontStyle: 'italic', fontSize: 13, color: theme.inkM, lineHeight: 22 },
  actionBtn: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 8 },
  actionBtnText: { color: theme.inkM, fontSize: 14 },
  actionBtnDanger: { borderWidth: 1, borderColor: 'rgba(212,133,154,0.2)', borderRadius: 14, padding: 16, alignItems: 'center' },
  actionBtnDangerText: { color: theme.rose, fontSize: 14 },
});
