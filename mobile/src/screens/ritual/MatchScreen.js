import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme';

export default function MatchScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.heading}>Your Match</Text>
            <Text style={styles.sub}>21-day anonymous connection</Text>
          </View>
          <View style={styles.dayBadge}>
            <Text style={styles.dayText}>Day 7</Text>
          </View>
        </View>

        <View style={styles.matchCard}>
          <View style={styles.matchGlow} />
          <View style={styles.avatarWrap}>
            <View style={styles.avatarLarge}>
              <View style={styles.avatarCore} />
            </View>
          </View>
          <Text style={styles.matchLabel}>Anonymous Soul</Text>
          <Text style={styles.matchSub}>Matched through the Wall · 14 days left</Text>
          <View style={styles.scoreRow}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>87%</Text>
              <Text style={styles.scoreLabel}>psych match</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>92%</Text>
              <Text style={styles.scoreLabel}>taste match</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>Both</Text>
              <Text style={styles.scoreLabel}>wind down</Text>
            </View>
          </View>
        </View>

        <View style={styles.promptCard}>
          <Text style={styles.promptLabel}>Tonight's Shared Prompt</Text>
          <Text style={styles.promptText}>What's one thing you wish someone had told you this semester?</Text>
          <View style={styles.promptReplies}>
            <View style={styles.replyLeft}>
              <Text style={styles.replyText}>That it's okay to not have a plan. Everyone pretends they do but most of us are just figuring it out day by day.</Text>
              <Text style={styles.replyMeta}>Your match · 2h ago</Text>
            </View>
            <View style={styles.replyRight}>
              <Text style={styles.replyText}>That asking for help isn't weakness. It took me almost failing to learn that.</Text>
              <Text style={[styles.replyMeta, { color: 'rgba(88,178,220,0.5)' }]}>You · 1h ago</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Shared Taste This Week</Text>
        <View style={styles.tasteRow}>
          <View style={[styles.tasteItem, { backgroundColor: theme.blue + '14', borderColor: theme.blue + '1E' }]}>
            <Text style={[styles.tasteName, { color: theme.blue }]}>Nils Frahm</Text>
            <Text style={styles.tasteSub}>both listening</Text>
          </View>
          <View style={[styles.tasteItem, { backgroundColor: theme.purpleLight + '14', borderColor: theme.purpleLight + '1E' }]}>
            <Text style={[styles.tasteName, { color: theme.purpleLight }]}>Severance</Text>
            <Text style={styles.tasteSub}>both watching</Text>
          </View>
          <View style={[styles.tasteItem, { backgroundColor: theme.teal + '14', borderColor: theme.teal + '1E' }]}>
            <Text style={[styles.tasteName, { color: theme.teal }]}>Gris</Text>
            <Text style={styles.tasteSub}>both playing</Text>
          </View>
        </View>

        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Send a gentle reminder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnGhost]}>
            <Text style={styles.actionBtnGhostText}>Find a new partner</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, paddingHorizontal: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  heading: { fontSize: 22, fontFamily: theme.fontSerif, color: theme.text },
  sub: { fontSize: 10, color: theme.lavenderDim, marginTop: 4 },
  dayBadge: { height: 24, paddingHorizontal: 10, borderRadius: 999, backgroundColor: 'rgba(64,180,62,0.12)', borderWidth: 0.5, borderColor: 'rgba(64,180,62,0.18)', alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: 9, fontWeight: '500', color: 'rgba(64,180,62,0.8)' },
  matchCard: { position: 'relative', overflow: 'hidden', backgroundColor: theme.surface, borderWidth: 0.5, borderColor: theme.border, borderRadius: 20, padding: 20, marginBottom: 16, alignItems: 'center' },
  matchGlow: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -60 }, { translateY: -60 }], width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(123,94,167,0.15)' },
  avatarWrap: { marginBottom: 12 },
  avatarLarge: { width: 52, height: 52, borderRadius: 26, backgroundColor: theme.purple, alignItems: 'center', justifyContent: 'center' },
  avatarCore: { width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.7)' },
  matchLabel: { fontSize: 14, fontWeight: '500', color: theme.text, marginBottom: 4 },
  matchSub: { fontSize: 10, color: theme.lavenderDim, marginBottom: 16 },
  scoreRow: { flexDirection: 'row', gap: 8 },
  scoreItem: { backgroundColor: 'rgba(123,94,167,0.12)', borderWidth: 0.5, borderColor: 'rgba(123,94,167,0.18)', borderRadius: 10, padding: 10, alignItems: 'center', minWidth: 70 },
  scoreValue: { fontSize: 14, fontWeight: '500', color: theme.lavender },
  scoreLabel: { fontSize: 9, color: theme.textFaint, marginTop: 2 },
  promptCard: { backgroundColor: theme.surface, borderWidth: 0.5, borderColor: theme.border, borderRadius: 16, padding: 16, marginBottom: 16 },
  promptLabel: { fontSize: 10, color: theme.lavenderDim, letterSpacing: 1.5, marginBottom: 12 },
  promptText: { fontSize: 14, color: 'rgba(255,255,255,0.82)', lineHeight: 20, fontFamily: theme.fontSerif, fontStyle: 'italic', marginBottom: 14 },
  promptReplies: { gap: 10 },
  replyLeft: { padding: 12, backgroundColor: 'rgba(123,94,167,0.08)', borderRadius: 12, borderWidth: 0.5, borderColor: 'rgba(123,94,167,0.12)' },
  replyRight: { padding: 12, backgroundColor: 'rgba(88,178,220,0.06)', borderRadius: 12, borderWidth: 0.5, borderColor: 'rgba(88,178,220,0.1)' },
  replyText: { fontSize: 12, color: 'rgba(255,255,255,0.68)', lineHeight: 18, fontFamily: theme.fontSerif, fontStyle: 'italic', marginBottom: 8 },
  replyMeta: { fontSize: 9, color: theme.lavenderDim },
  sectionTitle: { fontSize: 11, fontWeight: '500', color: theme.textDim, letterSpacing: 0.5, marginBottom: 12 },
  tasteRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tasteItem: { flex: 1, borderRadius: 10, borderWidth: 0.5, padding: 10, alignItems: 'center' },
  tasteName: { fontSize: 10, fontWeight: '500', fontFamily: theme.fontSerif },
  tasteSub: { fontSize: 8, color: theme.textFaint, marginTop: 3 },
  actionsCard: { gap: 10, marginTop: 8 },
  actionBtn: { height: 44, borderRadius: 12, backgroundColor: theme.purple, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 13, color: '#fff', fontWeight: '500' },
  actionBtnGhost: { backgroundColor: 'transparent', borderWidth: 0.5, borderColor: theme.border },
  actionBtnGhostText: { fontSize: 13, color: theme.textDim, fontWeight: '500' },
});
