import { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../../theme';
import { api } from '../../services/api';
import { Icon } from '../../components/Icon';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationsScreen() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { fetchNotifs(); }, []);

  const fetchNotifs = async () => {
    setError(null);
    try {
      const data = await api.notifications();
      setNotifs(data);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifs();
    setRefreshing(false);
  }, []);

  const markRead = async (id) => {
    try {
      await api.markNotifRead(id);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: 1 } : n));
      try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await api.markAllNotifRead();
      setNotifs(prev => prev.map(n => ({ ...n, read: 1 })));
      try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    } catch {}
  };

  const notifIcon = (type) => {
    switch (type) {
      case 'partner_entry': return { name: 'moon', color: theme.purpleL };
      case 'comment': return { name: 'chatbubble-ellipses', color: theme.roseL };
      case 'match': return { name: 'heart', color: theme.rose };
      case 'reveal': return { name: 'unlock', color: theme.goldL };
      default: return { name: 'notifications', color: theme.inkM };
    }
  };

  if (loading && notifs.length === 0) {
    return (
      <AnimatedScreen>
        <View style={styles.content}>
          <Text style={styles.title}>Notifications</Text>
          {[1, 2, 3].map(i => (
            <Card key={i} padding={16} style={{ marginBottom: 8, opacity: 1 - i * 0.2 }}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(248,242,255,0.04)' }} />
                <View style={{ flex: 1, gap: 6 }}>
                  <View style={{ height: 12, backgroundColor: 'rgba(248,242,255,0.04)', borderRadius: 6, width: '70%' }} />
                  <View style={{ height: 10, backgroundColor: 'rgba(248,242,255,0.03)', borderRadius: 5, width: '40%' }} />
                </View>
              </View>
            </Card>
          ))}
        </View>
      </AnimatedScreen>
    );
  }

  if (error && notifs.length === 0) {
    return (
      <AnimatedScreen style={styles.center}>
        <Icon name="cloud-offline-outline" size={40} color={theme.inkS} />
        <Text style={styles.errorText}>{error}</Text>
        <AppButton title="Tap to retry" variant="ghost" onPress={fetchNotifs} />
      </AnimatedScreen>
    );
  }

  const unread = notifs.filter(n => !n.read).length;

  return (
    <AnimatedScreen>
      <ScrollView contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.roseL} />}>
        <View style={styles.header}>
          <Text style={styles.title}>Notifications</Text>
          {unread > 0 && (
            <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
              <Icon name="checkmark-done" size={16} color={theme.roseL} />
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {notifs.length === 0 && (
          <View style={styles.empty}>
            <Icon name="notifications-off-outline" size={48} color={theme.inkS} />
            <Text style={styles.emptyTitle}>All clear</Text>
            <Text style={styles.emptyBody}>Notifications will appear here when your partner writes or reacts.</Text>
          </View>
        )}

        {notifs.map((n) => {
          const icon = notifIcon(n.type);
          return (
            <TouchableOpacity key={n.id} onPress={() => !n.read && markRead(n.id)} activeOpacity={0.7}>
              <Card padding={16} style={[styles.notifCard, !n.read && styles.notifUnread]}>
                <View style={[styles.notifIcon, { backgroundColor: icon.color + '15' }]}>
                  <Icon name={icon.name} size={18} color={icon.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.notifMsg, !n.read && styles.notifMsgUnread]}>{n.message}</Text>
                  <Text style={styles.notifTime}>{timeAgo(n.created_at)}</Text>
                </View>
                {!n.read && <View style={styles.unreadDot} />}
              </Card>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingTop: 60 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  errorText: { color: theme.rose, fontSize: 14, textAlign: 'center', marginBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontFamily: theme.fontSerif, fontSize: 28, color: theme.ink },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  markAllText: { color: theme.roseL, fontSize: 12 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontFamily: theme.fontSerif, fontSize: 20, color: theme.ink },
  emptyBody: { color: theme.inkM, fontSize: 14, textAlign: 'center', lineHeight: 22 },
  notifCard: { marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifUnread: { borderColor: theme.roseD + '30' },
  notifIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  notifMsg: { color: theme.inkM, fontSize: 13, lineHeight: 18, flex: 1 },
  notifMsgUnread: { color: theme.ink, fontWeight: '500' },
  notifTime: { color: theme.inkS, fontSize: 10, marginTop: 3 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.roseL },
});
