import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';

export default function PermissionsScreen({ onNext, onBack }) {
  const [notifs, setNotifs] = useState(true);
  const [missions, setMissions] = useState(true);

  const Toggle = ({ label, sub, value, onToggle }) => (
    <TouchableOpacity style={styles.toggleRow} onPress={onToggle}>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleSub}>{sub}</Text>
      </View>
      <View style={[styles.toggleTrack, value && styles.toggleOn]}>
        <View style={[styles.toggleThumb, value && { transform: [{ translateX: 20 }] }]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.line} />
        <Text style={styles.eye}>Environment</Text>
        <Text style={styles.title}>Set your{'\n'}<Text style={styles.em}>boundaries.</Text></Text>
        <Text style={styles.body}>You control the volume. No unnecessary noise, just pure signal.</Text>

        <View style={styles.toggles}>
          <Toggle label="Daily practice nudge" sub="One gentle prompt, once per day." value={notifs} onToggle={() => setNotifs(v => !v)} />
          <Toggle label="Situation alerts" sub="Reminders before logged social events." value={missions} onToggle={() => setMissions(v => !v)} />
        </View>

        <Text style={styles.footnote}>You can adjust these boundaries at any time. We strictly protect your psychological data.</Text>
      </ScrollView>

      <View style={styles.btns}>
        <TouchableOpacity style={styles.btn} onPress={onNext}>
          <Text style={styles.btnText}>Confirm boundaries →</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.cancel}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F8F4', paddingBottom: 48 },
  scroll: { flex: 1, paddingHorizontal: 32 },
  scrollContent: { paddingTop: 52 },
  line: { width: 1, height: 40, backgroundColor: '#D1C2A3', marginBottom: 32 },
  eye: { color: '#7A7975', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  title: { fontFamily: theme.fontSerif, fontSize: 34, color: '#2B2A27', lineHeight: 40, marginBottom: 16 },
  em: { fontStyle: 'italic' },
  body: { color: '#7A7975', fontSize: 14, lineHeight: 22, marginBottom: 40 },
  toggles: { borderTopWidth: 1, borderTopColor: '#E6E4DF' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#E6E4DF' },
  toggleLabel: { fontFamily: theme.fontSerif, fontSize: 18, color: '#2B2A27', marginBottom: 4 },
  toggleSub: { fontSize: 13, color: '#7A7975' },
  toggleTrack: { width: 44, height: 24, borderRadius: 100, backgroundColor: '#E6E4DF', justifyContent: 'center', padding: 3 },
  toggleOn: { backgroundColor: '#2B2A27' },
  toggleThumb: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  footnote: { fontSize: 12, color: '#B8B7B2', lineHeight: 20, marginTop: 32 },
  btns: { paddingHorizontal: 32, gap: 16, marginTop: 16 },
  btn: { backgroundColor: '#2C3E35', paddingVertical: 20, alignItems: 'center' },
  btnText: { color: '#F9F8F4', fontFamily: theme.fontSerif, fontSize: 18, fontStyle: 'italic' },
  cancel: { color: '#7A7975', fontSize: 11, textAlign: 'center', padding: 8, textTransform: 'uppercase', letterSpacing: 1 },
});
