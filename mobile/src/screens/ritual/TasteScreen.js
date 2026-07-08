import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme';

const pills = ['All', 'Music', 'Games', 'Books', 'Shows'];
const categories = ['all', 'music', 'games', 'books', 'shows'];

const wallItems = [
  { id: 1, name: 'Tycho', cat: 'music', color: theme.blue },
  { id: 2, name: 'Gris', cat: 'games', color: theme.teal },
  { id: 3, name: 'Piranesi', cat: 'books', color: theme.purpleLight },
  { id: 4, name: 'Severance', cat: 'shows', color: theme.coral },
];

const souls = [
  { initial: 'L', gradient: [theme.blue, theme.teal], name: 'Luna', activity: 'listening to', target: 'Nils Frahm', match: 92, mood: 'winding down' },
  { initial: 'K', gradient: [theme.coral, '#E98B2A'], name: 'Kai', activity: 'reading', target: 'Piranesi', match: 88, mood: 'contemplative' },
];

export default function TasteScreen() {
  const insets = useSafeAreaInsets();
  const [activePill, setActivePill] = useState('all');
  const filtered = activePill === 'all' ? wallItems : wallItems.filter(w => w.cat === activePill);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.heading}>Constellation</Text>
            <Text style={styles.sub}>Your archetype: The Quiet Storm</Text>
          </View>
          <View style={styles.avatar}>
            <View style={styles.avatarCore} />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginBottom: 20 }}>
          {pills.map((p, i) => (
            <TouchableOpacity
              key={p} activeOpacity={0.7}
              style={[styles.pill, activePill === categories[i] && { backgroundColor: 'rgba(200,180,255,0.15)', borderColor: 'rgba(200,180,255,0.2)' }]}
              onPress={() => setActivePill(categories[i])}
            >
              <Text style={[styles.pillText, activePill === categories[i] && { color: theme.lavender }]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.prepCard}>
          <View style={styles.prepGlow} />
          <Text style={styles.prepLabel}>Prepare for Tonight</Text>
          <View style={styles.prepBtns}>
            <TouchableOpacity style={[styles.prepBtn, styles.prepBtnActive]}>
              <Text style={styles.prepBtnText}>Wind Down</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.prepBtn}>
              <Text style={styles.prepBtnTextInactive}>Focus Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.prepBtn}>
              <Text style={styles.prepBtnTextInactive}>Feel Seen</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Souls in Sync</Text>
        {souls.map((s, i) => (
          <View key={i} style={styles.soulCard}>
            <View style={[styles.soulAvatar, { backgroundColor: s.gradient[0] }]}>
              <Text style={styles.soulInitial}>{s.initial}</Text>
            </View>
            <View style={styles.soulInfo}>
              <Text style={styles.soulName}>
                <Text style={styles.soulNameBold}>{s.name}</Text>
                <Text style={styles.soulFaint}> {s.activity} </Text>
                <Text style={styles.soulNameBold}>{s.target}</Text>
              </Text>
              <Text style={styles.soulMatch}>{s.match}% match · {s.mood}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Your Stardust Wall</Text>
        <View style={styles.starGrid}>
          {filtered.map(item => (
            <View key={item.id} style={[styles.starItem, { backgroundColor: item.color + '14', borderColor: item.color + '26' }]}>
              <Text style={[styles.starName, { color: item.color }]}>{item.name}</Text>
            </View>
          ))}
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
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: theme.purple, alignItems: 'center', justifyContent: 'center' },
  avatarCore: { width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.7)' },
  pill: { height: 28, paddingHorizontal: 12, borderRadius: 999, backgroundColor: theme.surface, borderWidth: 0.5, borderColor: theme.border, alignItems: 'center', justifyContent: 'center' },
  pillText: { fontSize: 10, fontWeight: '500', color: theme.textDim },
  prepCard: { position: 'relative', overflow: 'hidden', backgroundColor: theme.surface, borderWidth: 0.5, borderColor: theme.border, borderRadius: 16, padding: 16, marginBottom: 16 },
  prepGlow: { position: 'absolute', top: -15, right: -15, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(123,94,167,0.12)' },
  prepLabel: { fontSize: 10, color: theme.lavenderDim, letterSpacing: 1.5, marginBottom: 12 },
  prepBtns: { flexDirection: 'row', gap: 8 },
  prepBtn: { flex: 1, height: 34, borderRadius: 10, borderWidth: 0.5, borderColor: theme.border, alignItems: 'center', justifyContent: 'center' },
  prepBtnActive: { backgroundColor: 'rgba(123,94,167,0.15)', borderColor: 'rgba(123,94,167,0.22)' },
  prepBtnText: { fontSize: 10, fontWeight: '500', color: theme.lavender },
  prepBtnTextInactive: { fontSize: 10, fontWeight: '500', color: theme.textDim },
  sectionTitle: { fontSize: 11, fontWeight: '500', color: theme.textDim, letterSpacing: 0.5, marginBottom: 12, marginTop: 4 },
  soulCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: theme.surface, borderWidth: 0.5, borderColor: theme.border, borderRadius: 12, marginBottom: 8 },
  soulAvatar: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  soulInitial: { fontSize: 11, color: '#fff', fontWeight: '500' },
  soulInfo: { flex: 1 },
  soulName: { fontSize: 11, color: 'rgba(255,255,255,0.78)' },
  soulNameBold: { fontWeight: '500' },
  soulFaint: { color: theme.textFaint },
  soulMatch: { fontSize: 9, color: theme.lavenderDim, marginTop: 2 },
  starGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  starItem: { width: '47%', aspectRatio: 1, borderRadius: 12, borderWidth: 0.5, alignItems: 'center', justifyContent: 'center', padding: 6 },
  starName: { fontSize: 12, fontWeight: '500', fontFamily: theme.fontSerif, textAlign: 'center' },
});
