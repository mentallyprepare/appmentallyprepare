import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme';

const rooms = [
  { id: 'anxiety', name: 'Anxiety', color: theme.blue },
  { id: 'loneliness', name: 'Loneliness', color: theme.purpleLight },
  { id: 'pressure', name: 'Pressure', color: theme.coral },
  { id: 'identity', name: 'Identity', color: theme.teal },
];

const needs = ['Listen', 'Think', 'Share', 'Encourage', 'Quiet'];

const posts = [
  { id: 1, need: 'listen', needColor: theme.blue, text: "My chest gets tight before every class and I can't explain why. It's not even about the class. It's about being seen.", relate: 8, listening: 5, notAlone: 12, expires: '8h' },
  { id: 2, need: 'encourage', needColor: theme.teal, text: "I finally told my roommate I've been struggling. It felt terrifying but also like the first real breath in months.", relate: 14, support: 9, expires: '5h' },
  { id: 3, need: 'share', needColor: theme.coral, text: "I don't even know what I need right now. I just needed to say it somewhere.", relate: 21, listening: 8, expires: '2h' },
];

export default function RoomsScreen() {
  const insets = useSafeAreaInsets();
  const [activeRoom, setActiveRoom] = useState('anxiety');
  const [activeNeed, setActiveNeed] = useState('listen');

  const filtered = posts.filter(p => p.need === activeNeed);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Rooms</Text>
          <Text style={styles.headingSub}>Anonymous spaces</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomTabs} contentContainerStyle={{ gap: 6 }}>
          {rooms.map(r => (
            <TouchableOpacity
              key={r.id} activeOpacity={0.7}
              style={[styles.roomTab, activeRoom === r.id && { backgroundColor: 'rgba(200,180,255,0.15)', borderColor: 'rgba(200,180,255,0.2)' }]}
              onPress={() => setActiveRoom(r.id)}
            >
              <Text style={[styles.roomTabText, activeRoom === r.id && { color: theme.lavender }]}>{r.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.needLabel}>What do you need?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginBottom: 20 }}>
          {needs.map(n => (
            <TouchableOpacity
              key={n} activeOpacity={0.7}
              style={[styles.needPill, activeNeed === n.toLowerCase() && { backgroundColor: 'rgba(123,94,167,0.18)', borderColor: 'rgba(123,94,167,0.25)' }]}
              onPress={() => setActiveNeed(n.toLowerCase())}
            >
              <Text style={[styles.needPillText, activeNeed === n.toLowerCase() && { color: theme.lavender }]}>{n}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filtered.map(p => (
          <View key={p.id} style={styles.postCard}>
            <View style={styles.postGlow} />
            <View style={styles.postMeta}>
              <View style={[styles.needBadge, { backgroundColor: p.needColor + '1A', borderColor: p.needColor + '2E' }]}>
                <Text style={[styles.needBadgeText, { color: p.needColor }]}>needs: {p.need}</Text>
              </View>
              <Text style={styles.expiresText}>expires in {p.expires}</Text>
            </View>
            <Text style={styles.postText}>{p.text}</Text>
            <View style={styles.reactions}>
              <TouchableOpacity style={styles.reactBtn}>
                <Text style={styles.reactIcon}>♥</Text>
                <Text style={styles.reactLabel}>relate</Text>
                <Text style={styles.reactCount}>{p.relate}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reactBtn}>
                <Text style={styles.reactIcon}>♪</Text>
                <Text style={styles.reactLabel}>listening</Text>
                <Text style={styles.reactCount}>{p.listening}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reactBtn}>
                <Text style={styles.reactIcon}>✦</Text>
                <Text style={styles.reactLabel}>not alone</Text>
                <Text style={styles.reactCount}>{p.notAlone}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, paddingHorizontal: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  heading: { fontSize: 22, fontFamily: theme.fontSerif, color: theme.text },
  headingSub: { fontSize: 10, color: theme.lavenderDim },
  roomTabs: { marginBottom: 20 },
  roomTab: { height: 30, paddingHorizontal: 14, borderRadius: 999, backgroundColor: theme.surface, borderWidth: 0.5, borderColor: theme.border, alignItems: 'center', justifyContent: 'center' },
  roomTabText: { fontSize: 11, fontWeight: '500', color: theme.textDim },
  needLabel: { fontSize: 10, color: theme.lavenderDim, letterSpacing: 1.5, marginBottom: 12 },
  needPill: { height: 30, paddingHorizontal: 12, borderRadius: 10, backgroundColor: theme.surface, borderWidth: 0.5, borderColor: theme.border, alignItems: 'center', justifyContent: 'center' },
  needPillText: { fontSize: 11, fontWeight: '500', color: theme.textDim },
  postCard: { position: 'relative', overflow: 'hidden', backgroundColor: theme.surface, borderWidth: 0.5, borderColor: theme.border, borderRadius: 16, padding: 16, marginBottom: 10 },
  postGlow: { position: 'absolute', top: -10, right: -10, width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(88,178,220,0.08)' },
  postMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  needBadge: { height: 20, paddingHorizontal: 8, borderRadius: 999, borderWidth: 0.5, alignItems: 'center', justifyContent: 'center' },
  needBadgeText: { fontSize: 9, fontWeight: '500' },
  expiresText: { fontSize: 9, color: theme.textFaint },
  postText: { fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 20, fontFamily: theme.fontSerif, fontStyle: 'italic', marginBottom: 12 },
  reactions: { flexDirection: 'row', gap: 10 },
  reactBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  reactIcon: { fontSize: 13, color: theme.lavenderDim },
  reactLabel: { fontSize: 10, color: theme.lavenderDim },
  reactCount: { fontSize: 10, color: theme.lavenderFaint },
});
