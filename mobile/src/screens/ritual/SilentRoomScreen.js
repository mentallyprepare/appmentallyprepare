import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme';

const lines = [
  { id: 1, text: "I'm tired in a way that sleep can't fix.", resonated: 34, seen: 201 },
  { id: 2, text: "Everyone thinks I have it together and that's the loneliest part.", resonated: 28, seen: 156 },
  { id: 3, text: "I don't want to disappear but I don't know how to stay visible either.", resonated: 41, seen: 289 },
  { id: 4, text: "The silence between who I am and who I pretend to be is getting louder.", resonated: 19, seen: 134 },
  { id: 5, text: "I keep waiting for the version of my life where everything makes sense.", resonated: 37, seen: 212 },
];

export default function SilentRoomScreen() {
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState('');

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.heading}>The Silent Room</Text>
            <Text style={styles.sub}>One line. No names. Just what you feel.</Text>
          </View>
          <Text style={styles.count}>87 here</Text>
        </View>

        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            multiline placeholder="Write one line..."
            placeholderTextColor={theme.textFaint}
            value={input} onChangeText={setInput}
          />
          <View style={styles.inputFooter}>
            <Text style={styles.charLimit}>200 chars · 7 days</Text>
            <TouchableOpacity style={styles.releaseBtn}>
              <Text style={styles.releaseText}>Release</Text>
            </TouchableOpacity>
          </View>
        </View>

        {lines.map((line) => (
          <View key={line.id} style={styles.lineBlock}>
            <View style={[styles.lineDash, { opacity: 0.4 - line.id * 0.05 }]} />
            <Text style={styles.lineText}>{line.text}</Text>
            <View style={styles.lineFooter}>
              <TouchableOpacity style={styles.resonateBtn}>
                <Text style={styles.resonateIcon}>✦</Text>
                <Text style={styles.resonateLabel}>resonated</Text>
                <Text style={styles.resonateCount}>{line.resonated}</Text>
              </TouchableOpacity>
              <Text style={styles.seenText}>seen {line.seen} times</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, paddingHorizontal: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  heading: { fontSize: 22, fontFamily: theme.fontSerif, color: theme.text },
  sub: { fontSize: 10, color: theme.lavenderDim, marginTop: 4 },
  count: { fontSize: 10, color: theme.lavenderDim },
  inputCard: { backgroundColor: theme.surface, borderWidth: 0.5, borderColor: theme.border, borderRadius: 16, padding: 16, marginBottom: 24 },
    input: { height: 50, backgroundColor: 'transparent', borderWidth: 0, color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: theme.fontSerif, fontStyle: 'italic', lineHeight: 22 },
  inputFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  charLimit: { fontSize: 10, color: theme.textFaint },
  releaseBtn: { height: 30, paddingHorizontal: 16, borderRadius: 10, backgroundColor: theme.purple, alignItems: 'center', justifyContent: 'center' },
  releaseText: { fontSize: 11, color: '#fff', fontWeight: '500' },
  lineBlock: { paddingVertical: 12, paddingHorizontal: 4, marginBottom: 8 },
  lineDash: { width: 2, height: '100%', position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: 'rgba(200,180,255,0.2)', borderRadius: 1 },
  lineText: { fontSize: 14, color: 'rgba(255,255,255,0.78)', lineHeight: 22, fontFamily: theme.fontSerif, fontStyle: 'italic', marginBottom: 10 },
  lineFooter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resonateBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  resonateIcon: { fontSize: 11, color: theme.lavenderDim },
  resonateLabel: { fontSize: 10, color: theme.lavenderDim },
  resonateCount: { fontSize: 10, color: theme.lavenderFaint },
  seenText: { fontSize: 9, color: theme.textFaint },
});
