import { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme, archetypes } from '../../theme';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Icon } from '../../components/Icon';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';
import { ProfileSkeleton } from '../../components/SkeletonLoader';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setError(null);
    try {
      const me = await api.me();
      setData(me);
    } catch (e) {
      setError(e.message || 'Failed to load');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const handleLogout = async () => {
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
  };

  if (!data && error) {
    return (
      <AnimatedScreen style={styles.center}>
        <Icon name="cloud-offline-outline" size={40} color={theme.inkS} />
        <Text style={styles.errorText}>{error}</Text>
        <AppButton title="Tap to retry" variant="ghost" onPress={loadData} />
      </AnimatedScreen>
    );
  }

  if (!data) return <AnimatedScreen><ProfileSkeleton /></AnimatedScreen>;

  const { user: profile, match } = data;
  const archInfo = archetypes[profile.archetype];

  return (
    <AnimatedScreen>
      <ScrollView contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.roseL} />}>
        <View style={styles.hero}>
          <View style={[styles.avatar, archInfo && { backgroundColor: archInfo.color + '30', borderColor: archInfo.color + '50' }]}>
            <Text style={{ fontSize: 36 }}>{archInfo?.icon || '🌙'}</Text>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          {profile.college && <Text style={styles.college}>{profile.college}</Text>}
        </View>

        {profile.archetype && (
          <Card variant="highlight" padding={16} style={styles.archCard}>
            <Text style={styles.archEy}>Your Archetype</Text>
            <Text style={styles.archName}>{profile.archetype}</Text>
          </Card>
        )}

        <View style={styles.statsRow}>
          {[
            { value: data.entries?.length || 0, label: 'Entries', icon: 'document-text-outline' },
            { value: data.streak || 0, label: 'Day Streak', icon: 'flame-outline' },
            { value: match?.day || '-', label: 'Day', icon: 'calendar-outline' },
          ].map((s, i) => (
            <Card key={i} padding={14} style={{ flex: 1, alignItems: 'center' }}>
              <Icon name={s.icon} size={18} color={theme.roseL} />
              <Text style={styles.statN}>{s.value}</Text>
              <Text style={styles.statL}>{s.label}</Text>
            </Card>
          ))}
        </View>

        {data.entries && data.entries.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Entries</Text>
            {data.entries.slice(-3).reverse().map((e, i) => (
              <Card key={i} padding={16} style={{ marginBottom: 8 }}>
                <View style={styles.entryTop}>
                  <Text style={styles.entryDay}>Day {e.day_number}</Text>
                  <Text>{e.mood || '🌓'}</Text>
                </View>
                <Text style={styles.entryTxt} numberOfLines={2}>{e.text}</Text>
              </Card>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Shop')}>
            <Icon name="bag-outline" size={18} color={theme.inkM} />
            <Text style={styles.actionBtnText}>Shop</Text>
            <Icon name="chevron-forward" size={16} color={theme.inkS} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnDanger} onPress={handleLogout}>
            <Icon name="log-out-outline" size={18} color={theme.rose} />
            <Text style={styles.actionBtnDangerText}>Sign out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  content: {},
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  errorText: { color: theme.rose, fontSize: 14, textAlign: 'center', marginBottom: 16 },
  hero: { alignItems: 'center', paddingTop: 28, paddingHorizontal: 24 },
  avatar: { width: 86, height: 86, borderRadius: 43, backgroundColor: theme.roseD, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 2, borderColor: theme.roseD + '40', ...theme.shadow.glow('#C9A96E') },
  name: { fontFamily: theme.fontSerif, fontSize: 24, color: theme.ink, marginBottom: 4 },
  college: { color: theme.inkS, fontSize: 12, marginBottom: 20 },
  archCard: { marginHorizontal: 24 },
  archEy: { color: theme.rose, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 },
  archName: { fontFamily: theme.fontSerif, fontSize: 18, fontStyle: 'italic', color: theme.ink },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 24, paddingTop: 20 },
  statN: { fontFamily: theme.fontSerif, fontSize: 24, color: theme.roseL, lineHeight: 28, marginTop: 4 },
  statL: { color: theme.inkS, fontSize: 9, marginTop: 2 },
  section: { paddingHorizontal: 24, paddingTop: 20 },
  sectionTitle: { color: theme.inkS, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  entryTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  entryDay: { color: theme.inkS, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' },
  entryTxt: { fontFamily: theme.fontSerif, fontStyle: 'italic', fontSize: 13, color: theme.inkM, lineHeight: 22 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: theme.borderRadius.md, padding: 16, marginBottom: 8 },
  actionBtnText: { color: theme.inkM, fontSize: 14, flex: 1 },
  actionBtnDanger: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(212,133,154,0.2)', borderRadius: theme.borderRadius.md, padding: 16 },
  actionBtnDangerText: { color: theme.rose, fontSize: 14 },
});
