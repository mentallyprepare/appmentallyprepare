import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../../theme';
import { api } from '../../services/api';
import AnimatedScreen from '../../components/AnimatedScreen';
import AppButton from '../../components/AppButton';
import Card from '../../components/Card';
import { Icon } from '../../components/Icon';
import { useToast } from '../../components/Toast';

export default function ExchangeScreen() {
  const { showToast } = useToast();
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeExchange, setActiveExchange] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const inputRef = useRef(null);

  const loadExchanges = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await api.partnerStatus();
      setExchanges(data?.exchanges || []);
    } catch (e) {
      setError(e.message || 'Could not load exchanges');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadExchanges(); }, [loadExchanges]);

  const handleSendReply = useCallback(async () => {
    if (!replyText.trim() || !activeExchange) return;
    setSending(true);
    try {
      await api.comment({ exchangeId: activeExchange.id, text: replyText.trim() });
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
      setReplyText('');
      await loadExchanges();
    } catch (e) {
      showToast(e.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  }, [replyText, activeExchange, loadExchanges, showToast]);

  const renderExchangeItem = ({ item }) => {
    const isNew = item.unreadCount > 0;
    return (
      <TouchableOpacity
        style={[styles.exchangeCard, isNew && styles.exchangeCardNew]}
        onPress={() => { setActiveExchange(item); try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {} }}
        accessibilityLabel={`Exchange about ${item.situation}`}
      >
        <View style={styles.exchangeHeader}>
          <View style={styles.exchangeMeta}>
            <Text style={styles.exchangeSituation}>{item.situation}</Text>
            <Text style={styles.exchangeDate}>{item.date}</Text>
          </View>
          {isNew && <View style={styles.unreadBadge}><Text style={styles.unreadText}>{item.unreadCount}</Text></View>}
        </View>
        <Text style={styles.exchangePreview} numberOfLines={2}>{item.lastMessage}</Text>
        <Text style={styles.exchangeRound}>Round {item.round} of 5</Text>
      </TouchableOpacity>
    );
  };

  if (activeExchange) {
    return (
      <AnimatedScreen>
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setActiveExchange(null)} style={styles.backBtn} accessibilityLabel="Back to exchanges">
              <Icon name="chevron-back" size={22} color={theme.ink} />
            </TouchableOpacity>
            <View style={styles.chatMeta}>
              <Text style={styles.chatSituation}>{activeExchange.situation}</Text>
              <Text style={styles.chatRound}>Round {activeExchange.round} of 5</Text>
            </View>
          </View>

          <FlatList
            data={activeExchange.messages || []}
            keyExtractor={(_, i) => String(i)}
            contentContainerStyle={styles.messagesList}
            renderItem={({ item }) => (
              <View style={[styles.messageBubble, item.isOwn ? styles.messageOwn : styles.messageOther]}>
                <Text style={[styles.messageText, item.isOwn && styles.messageTextOwn]}>{item.text}</Text>
                <Text style={styles.messageTime}>{item.time}</Text>
              </View>
            )}
          />

          {activeExchange.round <= 5 && (
            <View style={styles.replyRow}>
              <TextInput
                ref={inputRef}
                style={styles.replyInput}
                value={replyText}
                onChangeText={setReplyText}
                placeholder="Write a reflection..."
                placeholderTextColor={theme.inkS}
                multiline
              />
              <TouchableOpacity
                style={[styles.sendBtn, !replyText.trim() && styles.sendBtnDisabled]}
                onPress={handleSendReply}
                disabled={!replyText.trim() || sending}
                accessibilityLabel="Send reply"
              >
                <Icon name="send" size={18} color={replyText.trim() ? theme.accent : theme.inkS} />
              </TouchableOpacity>
            </View>
          )}

          {activeExchange.round > 5 && (
            <View style={styles.exchangeEnded}>
              <Icon name="checkmark-circle" size={20} color={theme.green} />
              <Text style={styles.exchangeEndedText}>This exchange has ended</Text>
            </View>
          )}
        </View>
      </AnimatedScreen>
    );
  }

  return (
    <AnimatedScreen>
      <View style={styles.container}>
        <Text style={styles.heading}>Your exchanges</Text>
        <Text style={styles.subheading}>Reflect together, one situation at a time</Text>

        {loading && (
          <View style={styles.center}>
            <Text style={styles.emptyText}>Loading...</Text>
          </View>
        )}

        {!loading && error && (
          <View style={styles.center}>
            <Icon name="cloud-offline-outline" size={36} color={theme.inkS} />
            <Text style={styles.errorText}>{error}</Text>
            <AppButton title="Retry" variant="ghost" onPress={loadExchanges} />
          </View>
        )}

        {!loading && !error && exchanges.length === 0 && (
          <View style={styles.center}>
            <Icon name="chatbubbles-outline" size={40} color={theme.inkS} />
            <Text style={styles.emptyText}>No exchanges yet</Text>
            <Text style={styles.emptyHint}>Complete a preparation and choose "Share for exchange" to match with someone</Text>
          </View>
        )}

        {!loading && !error && exchanges.length > 0 && (
          <FlatList
            data={exchanges}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            renderItem={renderExchangeItem}
          />
        )}
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.md },
  heading: { fontSize: 24, fontFamily: theme.fontSerif, color: theme.ink, marginBottom: theme.spacing.xs },
  subheading: { fontSize: 15, color: theme.inkM, fontFamily: theme.fontSans, marginBottom: theme.spacing.lg },
  emptyText: { fontSize: 16, color: theme.inkS, fontFamily: theme.fontSans },
  emptyHint: { fontSize: 14, color: theme.inkS, fontFamily: theme.fontSans, textAlign: 'center', lineHeight: 20 },
  errorText: { fontSize: 14, color: theme.inkM, fontFamily: theme.fontSans },
  list: { gap: theme.spacing.sm },
  exchangeCard: { padding: theme.spacing.md, borderRadius: theme.borderRadius.md, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, gap: theme.spacing.xs },
  exchangeCardNew: { borderColor: theme.accent, backgroundColor: 'rgba(196,148,94,0.08)' },
  exchangeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exchangeMeta: { flex: 1 },
  exchangeSituation: { fontSize: 16, color: theme.ink, fontFamily: theme.fontSans, fontWeight: '500' },
  exchangeDate: { fontSize: 12, color: theme.inkS, fontFamily: theme.fontSans, marginTop: 2 },
  unreadBadge: { width: 22, height: 22, borderRadius: theme.borderRadius.full, backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center' },
  unreadText: { fontSize: 11, color: theme.bg, fontFamily: theme.fontSans, fontWeight: '600' },
  exchangePreview: { fontSize: 14, color: theme.inkM, fontFamily: theme.fontSans, lineHeight: 20 },
  exchangeRound: { fontSize: 12, color: theme.inkS, fontFamily: theme.fontSans },
  chatContainer: { flex: 1 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, padding: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.line },
  backBtn: { width: 36, height: 36, borderRadius: theme.borderRadius.full, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center' },
  chatMeta: { flex: 1 },
  chatSituation: { fontSize: 16, color: theme.ink, fontFamily: theme.fontSans, fontWeight: '500' },
  chatRound: { fontSize: 13, color: theme.inkS, fontFamily: theme.fontSans },
  messagesList: { padding: theme.spacing.md, gap: theme.spacing.sm },
  messageBubble: { maxWidth: '80%', padding: theme.spacing.sm + 2, borderRadius: theme.borderRadius.md, gap: 2 },
  messageOwn: { backgroundColor: theme.accentD, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  messageOther: { backgroundColor: theme.card, alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: theme.line },
  messageText: { fontSize: 15, color: theme.ink, fontFamily: theme.fontSans, lineHeight: 21 },
  messageTextOwn: { color: '#FFF' },
  messageTime: { fontSize: 11, color: theme.inkS, fontFamily: theme.fontSans, alignSelf: 'flex-end' },
  replyRow: { flexDirection: 'row', alignItems: 'flex-end', gap: theme.spacing.sm, padding: theme.spacing.md, borderTopWidth: 1, borderTopColor: theme.line },
  replyInput: { flex: 1, fontSize: 15, color: theme.ink, fontFamily: theme.fontSans, backgroundColor: theme.card, borderRadius: theme.borderRadius.md, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm + 2, maxHeight: 100 },
  sendBtn: { width: 40, height: 40, borderRadius: theme.borderRadius.full, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.5 },
  exchangeEnded: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm, padding: theme.spacing.lg },
  exchangeEndedText: { fontSize: 15, color: theme.inkM, fontFamily: theme.fontSans },
});
