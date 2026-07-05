import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '../../theme';
import { api } from '../../services/api';

export default function PartnerScreen() {
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

  if (!data) return <View style={styles.loading}><ActivityIndicator color={theme.roseL} /></View>;

  if (!data.match || !data.match.partner) {
    return (
      <View style={styles.empty}>
        <Text style={{ fontSize: 40, marginBottom: 16 }}>🌙</Text>
        <Text style={styles.emptyTitle}>No partner yet</Text>
        <Text style={styles.emptyBody}>Complete your scan to be matched with a complementary partner.</Text>
      </View>
    );
  }

  const partner = data.match.partner;
  const partnerEntries = data.partnerEntries || [];
  const day = data.match.day;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Partner Card */}
      <View style={styles.partnerCard}>
        <View><Text style={{ fontSize: 32 }}>🌙</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.pEy}>Your Partner</Text>
          <Text style={styles.pName}>{partner.archetype || 'Anonymous'}</Text>
          <Text style={styles.pStatus}>{partnerEntries.length} entries written</Text>
        </View>
        <View style={styles.activeDot} />
      </View>

      {/* Sealed entries */}
      {day >= 21 ? (
        <View style={styles.revealBlock}>
          <Text style={styles.revealTitle}>Journey Complete</Text>
          <Text style={styles.revealBody}>The 21 days are up. Check the reveal tab to decide if you want to meet.</Text>
        </View>
      ) : day > 1 ? (
        <View style={styles.sealedBlock}>
          <Text style={styles.sealedTitle}>Partner's Entries</Text>
          {partnerEntries.slice(0, 3).map((e, i) => (
            <View key={i} style={styles.sealedCard}>
              <View style={styles.sealedCardTop}>
                <Text style={styles.sealedCardLbl}>Day {e.day_number}</Text>
                <Text style={styles.sealedCardBadge}>{e.mood}</Text>
              </View>
              <Text style={styles.sealedTxt} numberOfLines={2}>{e.text}</Text>
            </View>
          ))}
          {partnerEntries.length === 0 && (
            <Text style={styles.waitingText}>Waiting for your partner to write...</Text>
          )}
        </View>
      ) : (
        <View style={styles.waitingBlock}>
          <Text style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>🌙</Text>
          <Text style={styles.waitingTitle}>Day 1 of 21</Text>
          <Text style={styles.waitingBody}>Start by writing your first entry. Your partner's entries will appear here once they've written, and the day has passed.</Text>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  content: {},
  loading: { flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { fontFamily: theme.fontSerif, fontSize: 22, color: theme.ink, marginBottom: 8 },
  emptyBody: { color: theme.inkM, fontSize: 14, textAlign: 'center', lineHeight: 22 },
  partnerCard: { margin: 24, backgroundColor: 'rgba(212,133,154,0.06)', borderWidth: 1, borderColor: 'rgba(212,133,154,0.13)', borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  pEy: { color: theme.rose, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  pName: { fontFamily: theme.fontSerif, fontSize: 16, fontStyle: 'italic', color: theme.ink },
  pStatus: { color: theme.inkS, fontSize: 11, marginTop: 3 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.roseL },
  sealedBlock: { paddingHorizontal: 24 },
  sealedTitle: { color: theme.inkS, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  sealedCard: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: 20, padding: 16, marginBottom: 12 },
  sealedCardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  sealedCardLbl: { color: theme.inkS, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' },
  sealedCardBadge: { fontSize: 13 },
  sealedTxt: { fontFamily: theme.fontSerif, fontStyle: 'italic', fontSize: 13, color: theme.inkM, lineHeight: 22 },
  waitingText: { color: theme.inkS, fontSize: 13, textAlign: 'center', fontStyle: 'italic', marginTop: 20 },
  waitingBlock: { padding: 32, alignItems: 'center' },
  waitingTitle: { fontFamily: theme.fontSerif, fontSize: 24, color: theme.goldL, marginBottom: 12 },
  waitingBody: { color: theme.inkM, fontSize: 14, textAlign: 'center', lineHeight: 22 },
  revealBlock: { padding: 32, alignItems: 'center' },
  revealTitle: { fontFamily: theme.fontSerif, fontSize: 24, color: theme.roseL, marginBottom: 12 },
  revealBody: { color: theme.inkM, fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
