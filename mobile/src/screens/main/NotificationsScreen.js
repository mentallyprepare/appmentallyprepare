import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '../../theme';
import { api } from '../../services/api';

function timeAgo(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
  return d.toLocaleDateString();
}

export default function NotificationsScreen() {
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifs();
  }, []);

  const loadNotifs = async () => {
    setLoading(true);
    try {
      const data = await api.notifications();
      setNotifs(data.notifications || []);
      setUnread(data.unread || 0);
    } catch { }
    setLoading(false);
  };

  const markRead = async (id) => {
    try {
      await api.markNotifRead(id);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch { }
  };

  const markAllRead = async () => {
    try {
      await api.markAllNotifRead();
      setNotifs(prev => prev.map(n => ({ ...n, read: true })));
      setUnread(0);
    } catch { }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>mentally prepare</Text>
        <View style={styles.headerRight}>
          {unread > 0 && (
            <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unread || 0}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title}>Notifications</Text>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={theme.roseL} size="large" />
        </View>
      ) : notifs.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyIco}>🔔</Text>
          <Text style={styles.emptyTxt}>No notifications yet</Text>
          <Text style={styles.emptySub}>When your partner writes or comments, you'll see it here.</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {notifs.map(n => (
            <TouchableOpacity
              key={n.id}
              style={[styles.item, !n.read && styles.itemUnread]}
              onPress={() => !n.read && markRead(n.id)}
            >
              <View style={styles.itemLeft}>
                {!n.read && <View style={styles.dot} />}
              </View>
              <View style={styles.itemBody}>
                <Text style={styles.itemTitle}>{n.title}</Text>
                <Text style={styles.itemBodyText} numberOfLines={2}>{n.body}</Text>
                <Text style={styles.itemTime}>{timeAgo(n.createdAt)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20 },
  logo: { fontFamily: theme.fontSerif, fontSize: 15, fontStyle: 'italic', color: theme.inkM },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  markAllBtn: { paddingHorizontal: 10, paddingVertical: 4 },
  markAllText: { fontSize: 11, color: theme.roseL },
  badge: { width: 28, height: 28, borderRadius: 14, backgroundColor: theme.roseD, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 11, fontWeight: '600', color: theme.ink },
  title: { fontFamily: theme.fontSerif, fontSize: 22, fontWeight: '600', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 4, color: theme.ink },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyIco: { fontSize: 48, opacity: 0.3, marginBottom: 16 },
  emptyTxt: { fontSize: 14, color: theme.inkS, marginBottom: 8 },
  emptySub: { fontSize: 11, color: theme.inkS, textAlign: 'center', opacity: 0.6 },
  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 100 },
  item: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 16, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, marginBottom: 6, alignItems: 'flex-start' },
  itemUnread: { borderColor: 'rgba(212,133,154,0.25)', backgroundColor: 'rgba(212,133,154,0.04)' },
  itemLeft: { width: 8, paddingTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.roseD },
  itemBody: { flex: 1 },
  itemTitle: { fontSize: 13, fontWeight: '500', color: theme.ink, marginBottom: 3 },
  itemBodyText: { fontSize: 11, color: theme.inkS, lineHeight: 16 },
  itemTime: { fontSize: 9, color: theme.inkS, marginTop: 4, opacity: 0.5 },
});
