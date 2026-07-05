import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { theme, moods } from '../../theme';
import { api } from '../../services/api';

const writingTips = [
  'Write for yourself first. Honesty matters more than polish.',
  'If nothing comes to mind, describe the last thing that made you feel something.',
  'Short entries are fine. One honest sentence beats three vague paragraphs.',
];

export default function JournalScreen() {
  const [data, setData] = useState(null);
  const [entryText, setEntryText] = useState('');
  const [selectedMood, setSelectedMood] = useState('🌓');
  const [saving, setSaving] = useState(false);
  const [day, setDay] = useState(1);
  const [streak, setStreak] = useState(0);
  const [pips, setPips] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const me = await api.me();
      setData(me);
      if (me.match) {
        setDay(me.match.day);
        setStreak(me.streak || 0);
        const done = {};
        (me.entries || []).forEach(e => done[e.day_number] = true);
        const p = [];
        for (let i = 1; i <= Math.min(me.match.day, 21); i++) {
          p.push({ day: i, done: !!done[i], now: i === me.match.day });
        }
        setPips(p);
      }
    } catch (e) {
      // silently fail
    }
  };

  const saveEntry = async () => {
    if (!entryText.trim()) {
      Alert.alert('Write something', 'Your entry can\'t be empty.');
      return;
    }
    setSaving(true);
    try {
      const res = await api.entry({ text: entryText, mood: selectedMood });
      Alert.alert('Saved', `Day ${res.day} entry recorded.`);
      setEntryText('');
      loadData();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <View style={styles.loading}><ActivityIndicator color={theme.roseL} /></View>;

  const prompt = data.match?.currentPrompt || 'What\'s on your mind?';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Streak */}
      {pips.length > 0 && (
        <View style={styles.streak}>
          <View style={styles.streakTop}>
            <Text style={styles.streakLbl}>Streak</Text>
            <Text style={styles.streakCt}>{streak} day{streak !== 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.pips}>
            {pips.map((p, i) => (
              <View key={i} style={[styles.pip, p.done && styles.pipDone, p.now && styles.pipNow]} />
            ))}
          </View>
        </View>
      )}

      {/* Moon + Day */}
      <View style={styles.moonBlock}>
        <View style={styles.moon}><Text style={{ fontSize: 36 }}>🌙</Text></View>
        <Text style={styles.cd}>Day {day}</Text>
        <Text style={styles.cdSub}>of 21</Text>
      </View>

      {/* Prompt */}
      <View style={styles.promptBlock}>
        <Text style={styles.promptText}>{prompt}</Text>
        {writingTips.length > 0 && (
          <View style={styles.tip}>
            <Text style={styles.tipText}>💡 {writingTips[day % writingTips.length]}</Text>
          </View>
        )}
      </View>

      {/* Mood */}
      <View style={styles.moodBlock}>
        <Text style={styles.moodLbl}>How are you feeling?</Text>
        <View style={styles.moods}>
          {moods.map((m) => (
            <TouchableOpacity key={m.value} style={[styles.mood, selectedMood === m.emoji && styles.moodOn]} onPress={() => setSelectedMood(m.emoji)}>
              <Text style={styles.moodEm}>{m.emoji}</Text>
              <Text style={[styles.moodW, selectedMood === m.emoji && styles.moodWOn]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Write */}
      <View style={styles.writeBlock}>
        <View style={styles.writeBox}>
          <Text style={styles.writeDate}>Today's entry</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Write what's true right now..."
            placeholderTextColor="rgba(248,242,255,0.15)"
            value={entryText}
            onChangeText={setEntryText}
            multiline
            maxLength={5000}
          />
          <View style={styles.writeFt}>
            <Text style={styles.ww}>{entryText.length}/5000</Text>
          </View>
        </View>
      </View>

      {/* Save */}
      <View style={styles.cta}>
        <TouchableOpacity style={[styles.btn, saving && { opacity: 0.5 }]} onPress={saveEntry} disabled={saving}>
          <Text style={styles.btnText}>{saving ? 'Saving...' : 'Save entry'}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  content: {},
  loading: { flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' },
  streak: { paddingHorizontal: 24, paddingTop: 20 },
  streakTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  streakLbl: { color: theme.inkS, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  streakCt: { fontFamily: theme.fontSerif, fontSize: 13, color: theme.goldL },
  pips: { flexDirection: 'row', gap: 4 },
  pip: { flex: 1, height: 4, borderRadius: 100, backgroundColor: 'rgba(248,242,255,0.06)' },
  pipDone: { backgroundColor: theme.roseD },
  pipNow: { backgroundColor: 'rgba(212,133,154,0.18)', borderWidth: 1, borderColor: 'rgba(212,133,154,0.35)' },
  moonBlock: { alignItems: 'center', paddingTop: 28, paddingHorizontal: 24 },
  moon: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#C9A96E', alignItems: 'center', justifyContent: 'center', shadowColor: '#C9A96E', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 40 },
  cd: { fontFamily: theme.fontSerif, fontSize: 32, color: theme.goldL, marginTop: 16, letterSpacing: 1 },
  cdSub: { color: theme.inkS, fontSize: 11 },
  promptBlock: { paddingHorizontal: 24, paddingTop: 24 },
  promptText: { fontFamily: theme.fontSerif, fontSize: 20, fontStyle: 'italic', color: theme.ink, lineHeight: 28 },
  tip: { marginTop: 12, backgroundColor: 'rgba(232,168,124,0.08)', borderWidth: 1, borderColor: 'rgba(232,168,124,0.2)', borderRadius: 100, paddingHorizontal: 12, paddingVertical: 5, alignSelf: 'flex-start' },
  tipText: { fontSize: 10, color: 'rgba(232,168,124,0.85)', letterSpacing: 0.5 },
  moodBlock: { paddingHorizontal: 24, paddingTop: 20 },
  moodLbl: { color: theme.inkS, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  moods: { flexDirection: 'row', gap: 8 },
  mood: { flex: 1, alignItems: 'center', padding: 10, borderRadius: 14, borderWidth: 1, borderColor: theme.line, backgroundColor: 'rgba(248,242,255,0.02)' },
  moodOn: { borderColor: 'rgba(212,133,154,0.35)', backgroundColor: 'rgba(212,133,154,0.07)' },
  moodEm: { fontSize: 20 },
  moodW: { fontSize: 9, color: theme.inkS, marginTop: 5 },
  moodWOn: { color: theme.roseL },
  writeBlock: { paddingHorizontal: 24, paddingTop: 20, flex: 1 },
  writeBox: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: 20, padding: 18 },
  writeDate: { color: theme.inkS, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 },
  textarea: { backgroundColor: 'transparent', borderWidth: 0, fontSize: 15, fontFamily: theme.fontSerif, fontStyle: 'italic', color: theme.inkM, lineHeight: 26, minHeight: 120, textAlignVertical: 'top' },
  writeFt: { borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 10, marginTop: 10, alignItems: 'flex-end' },
  ww: { color: theme.inkS, fontSize: 10 },
  cta: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12 },
  btn: { backgroundColor: theme.roseD, paddingVertical: 16, borderRadius: 100, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 14, letterSpacing: 0.5 },
});
