import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme';

const wallPosts = [
  { id: 1, text: "I keep telling everyone I'm fine but I haven't slept properly in weeks and I don't know how to ask for help.", meToo: 23, time: '2h ago' },
  { id: 2, text: 'I miss who I was before everything changed and I feel guilty for feeling that way.', meToo: 17, time: '4h ago' },
  { id: 3, text: "Started therapy today. The hardest part was admitting I couldn't do it alone.", meToo: 31, time: '6h ago' },
];

export default function TonightScreen() {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [openToMatch, setOpenToMatch] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.header}>
          <View style={styles.logoMini}>
            <View style={styles.logoDot} />
          </View>
          <Text style={styles.logoText}>mentally prepare</Text>
          <View style={styles.dayBadge}>
            <Text style={styles.dayText}>Day 7</Text>
          </View>
        </View>

        <View style={styles.promptCard}>
          <View style={styles.promptGlow} />
          <Text style={styles.promptLabel}>Tonight's Question</Text>
          <Text style={styles.promptText}>What's something you've been carrying that you haven't said out loud?</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>☾</Text>
              <Text style={styles.metaLabel}>Waning Crescent</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>✦</Text>
              <Text style={styles.metaLabel}>142 writing</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>♡</Text>
              <Text style={styles.metaLabel}>Not alone</Text>
            </View>
          </View>
        </View>

        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            multiline placeholder="Write what you're carrying..."
            placeholderTextColor={theme.textFaint}
            value={text} onChangeText={setText}
          />
          <View style={styles.inputFooter}>
            <TouchableOpacity style={styles.matchToggle} onPress={() => setOpenToMatch(!openToMatch)}>
              <View style={[styles.checkbox, openToMatch && styles.checkboxOn]}>
                {openToMatch && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.matchLabel}>Open to match</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>THE WALL</Text>
        {wallPosts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <Text style={styles.postText}>{post.text}</Text>
            <View style={styles.postFooter}>
              <TouchableOpacity style={styles.meTooBtn}>
                <Text style={styles.heartIcon}>♡</Text>
                <Text style={styles.meTooText}>Me Too</Text>
                <Text style={styles.meTooCount}>{post.meToo}</Text>
              </TouchableOpacity>
              <Text style={styles.postTime}>{post.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 },
  logoMini: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: 'rgba(200,180,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  logoDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: theme.lavender },
  logoText: { flex: 1, fontSize: 13, fontWeight: '500', color: theme.text, letterSpacing: 0.5 },
  dayBadge: { height: 30, borderRadius: 15, paddingHorizontal: 12, backgroundColor: theme.purple, alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: 11, color: '#fff', fontWeight: '500' },
  promptCard: {
    position: 'relative', overflow: 'hidden',
    backgroundColor: theme.surface, borderWidth: 0.5, borderColor: theme.border,
    borderRadius: 20, padding: 22, marginBottom: 20,
  },
  promptGlow: {
    position: 'absolute', top: -20, right: -20,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(123,94,167,0.15)',
  },
  promptLabel: { fontSize: 10, color: theme.lavenderDim, letterSpacing: 1.5, marginBottom: 8 },
  promptText: { fontSize: 18, fontFamily: theme.fontSerif, fontStyle: 'italic', color: theme.text, lineHeight: 26, marginBottom: 18 },
  metaRow: { flexDirection: 'row', gap: 8 },
  metaItem: { flex: 1, backgroundColor: 'rgba(123,94,167,0.12)', borderWidth: 0.5, borderColor: 'rgba(123,94,167,0.2)', borderRadius: 12, padding: 12, alignItems: 'center' },
  metaIcon: { fontSize: 18, marginBottom: 4 },
  metaLabel: { fontSize: 9, color: theme.textFaint },
  inputCard: { backgroundColor: theme.surface, borderWidth: 0.5, borderColor: theme.border, borderRadius: 16, padding: 16, marginBottom: 20 },
    input: { height: 80, backgroundColor: 'transparent', borderWidth: 0, color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: theme.fontSerif, fontStyle: 'italic', lineHeight: 22 },
  inputFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  matchToggle: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: 'rgba(200,180,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: theme.purple, borderColor: theme.purple },
  checkMark: { fontSize: 11, color: '#fff', fontWeight: '700' },
  matchLabel: { fontSize: 11, color: theme.lavenderDim },
  shareBtn: { height: 32, paddingHorizontal: 18, borderRadius: 10, backgroundColor: theme.purple, alignItems: 'center', justifyContent: 'center' },
  shareText: { fontSize: 11, color: '#fff', fontWeight: '500' },
  sectionTitle: { fontSize: 11, fontWeight: '500', color: theme.textDim, letterSpacing: 0.5, marginBottom: 12 },
  postCard: { backgroundColor: theme.surface, borderWidth: 0.5, borderColor: theme.border, borderRadius: 14, padding: 14, marginBottom: 10 },
  postText: { fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 20, fontFamily: theme.fontSerif, fontStyle: 'italic', marginBottom: 10 },
  postFooter: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  meTooBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heartIcon: { fontSize: 14, color: theme.lavenderDim },
  meTooText: { fontSize: 11, color: theme.lavenderDim },
  meTooCount: { fontSize: 11, color: theme.lavenderFaint },
  postTime: { fontSize: 10, color: theme.textFaint },
});
