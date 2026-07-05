import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { theme } from '../../theme';
import { api } from '../../services/api';

export default function RevealScreen() {
  const [data, setData] = useState(null);
  const [choice, setChoice] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const me = await api.me();
      setData(me);
      if (me.reveal) {
        setChoice(me.reveal.myChoice);
      }
    } catch (e) {}
  };

  const handleReveal = async (c) => {
    setSubmitting(true);
    try {
      await api.reveal({ choice: c });
      setChoice(c);
      loadData();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!data) return <View style={styles.loading}><ActivityIndicator color={theme.roseL} /></View>;

  const { match, reveal, entries } = data;
  const day = match?.day || 1;

  if (day < 21) {
    return (
      <View style={styles.container}>
        <View style={styles.waitBody}>
          <View style={styles.moonWrap}>
            <View style={styles.moon}><Text style={{ fontSize: 48 }}>🌙</Text></View>
          </View>
          <Text style={styles.eyebrow}>The Journey</Text>
          <Text style={styles.waitH}>Day {day}<Text style={styles.em}> of 21</Text></Text>
          <Text style={styles.waitP}>Keep writing. Identity reveal unlocks on Day 21.</Text>
          <View style={styles.pips}>
            {Array.from({ length: 21 }, (_, i) => (
              <View key={i} style={[styles.pip, i < day && styles.pipDone]} />
            ))}
          </View>
        </View>
      </View>
    );
  }

  // Day 21 reached
  if (reveal?.revealed) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center', padding: 24, paddingTop: 60 }}>
        <View style={styles.revMoonWrap}>
          <View style={styles.revMoon}><Text style={{ fontSize: 44 }}>🌙</Text></View>
        </View>
        <Text style={styles.revEyebrow}>Connected</Text>
        <Text style={styles.revName}>{reveal.partner?.name || 'Your Partner'}</Text>
        <Text style={styles.revCollege}>{reveal.partner?.college || ''} · {reveal.partner?.year || ''}</Text>

        <View style={styles.daysCard}>
          <Text style={styles.daysEy}>Days Together</Text>
          <View style={styles.daysPips}>
            {Array.from({ length: 21 }, (_, i) => (
              <View key={i} style={styles.dPip} />
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  if (reveal?.anonymous) {
    return (
      <View style={styles.container}>
        <View style={styles.waitBody}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🌙</Text>
          <Text style={styles.waitH}>Staying anonymous</Text>
          <Text style={styles.waitP}>One or both of you chose not to reveal. The connection remains what it was — honest, sealed, and complete.</Text>
        </View>
      </View>
    );
  }

  // Waiting for partner or need to choose
  if (choice === null && reveal?.partnerChose === false) {
    return (
      <View style={styles.container}>
        <View style={styles.waitBody}>
          <View style={styles.moonWrap}>
            <View style={styles.moon}><Text style={{ fontSize: 48 }}>🌙</Text></View>
          </View>
          <Text style={styles.eyebrow}>Day 21</Text>
          <Text style={styles.waitH}>Ready to{'\n'}<Text style={styles.em}>reveal yourself?</Text></Text>
          <Text style={styles.waitP}>Your partner has 21 days of your words. Choose whether they learn your name too.</Text>
          <TouchableOpacity style={styles.btnYes} onPress={() => handleReveal('yes')} disabled={submitting}>
            <Text style={styles.btnYesText}>Yes, reveal my identity</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnNo} onPress={() => handleReveal('no')} disabled={submitting}>
            <Text style={styles.btnNoText}>No, stay anonymous</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Made choice, waiting for partner
  return (
    <View style={styles.container}>
      <View style={styles.waitBody}>
        <View style={styles.moonWrap}>
          <View style={styles.moon}><Text style={{ fontSize: 48 }}>🌙</Text></View>
        </View>
        <Text style={styles.eyebrow}>Waiting</Text>
        <Text style={styles.waitH}>You've made{'\n'}<Text style={styles.em}>your choice</Text></Text>
        <Text style={styles.waitP}>Waiting for your partner to decide. Check back soon.{'\n\n'}You chose: {choice === 'yes' ? 'Reveal ✓' : 'Anonymous'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  loading: { flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' },
  waitBody: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  moonWrap: { position: 'relative', marginBottom: 32 },
  moon: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#C9A96E', alignItems: 'center', justifyContent: 'center', shadowColor: '#C9A96E', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.55, shadowRadius: 50 },
  eyebrow: { color: theme.gold, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 },
  waitH: { fontFamily: theme.fontSerif, fontSize: 32, fontStyle: 'italic', color: theme.ink, textAlign: 'center', lineHeight: 38, marginBottom: 14 },
  em: { fontStyle: 'italic', color: theme.inkM },
  waitP: { color: theme.inkM, fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 28, maxWidth: 290 },
  pips: { flexDirection: 'row', gap: 3 },
  pip: { width: 12, height: 4, borderRadius: 100, backgroundColor: 'rgba(248,242,255,0.06)' },
  pipDone: { backgroundColor: theme.roseD },
  revMoonWrap: { marginBottom: 28 },
  revMoon: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#C9A96E', alignItems: 'center', justifyContent: 'center', shadowColor: '#C9A96E', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.65, shadowRadius: 60 },
  revEyebrow: { color: theme.gold, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' },
  revName: { fontFamily: theme.fontSerif, fontSize: 36, fontStyle: 'italic', color: theme.roseL, textAlign: 'center', marginBottom: 6 },
  revCollege: { color: theme.inkS, fontSize: 12, textAlign: 'center', marginBottom: 24 },
  daysCard: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: 20, padding: 18, width: '100%' },
  daysEy: { color: theme.inkS, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  daysPips: { flexDirection: 'row', gap: 3, flexWrap: 'wrap' },
  dPip: { width: 12, height: 12, borderRadius: 3, backgroundColor: theme.roseD },
  btnYes: { width: '100%', backgroundColor: theme.roseD, paddingVertical: 17, borderRadius: 100, alignItems: 'center', marginBottom: 10, shadowColor: theme.roseD, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.45, shadowRadius: 40 },
  btnYesText: { color: '#fff', fontSize: 14, letterSpacing: 0.5 },
  btnNo: { width: '100%', backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.line, paddingVertical: 14, borderRadius: 100, alignItems: 'center' },
  btnNoText: { color: theme.inkS, fontSize: 12, letterSpacing: 0.5 },
});
